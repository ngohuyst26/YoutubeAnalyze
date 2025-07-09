const { spawn } = require("child_process");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Tải audio thô từ YouTube bằng yt-dlp, lưu tạm, sau đó chuyển đổi bằng FFmpeg.
 * @param {string} url - URL của video YouTube.
 * @param {string} finalOutputPath - Đường dẫn đầy đủ của file audio đầu ra (bao gồm cả tên file và định dạng).
 * @param {Object} options - Các tùy chọn bổ sung
 * @param {string} options.proxy - Proxy server (optional)
 * @param {string} options.cookiesFile - Đường dẫn file cookies (optional)
 * @param {number} options.maxRetries - Số lần thử lại tối đa (default: 3)
 * @returns {Promise<void>} - Một Promise sẽ được giải quyết khi quá trình hoàn tất.
 */
function downloadAndConvertAudio(url, finalOutputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime();
    const tempFileName = `temp_audio_${timestamp}.%(ext)s`;
    const maxRetries = options.maxRetries || 3;
    const cookies = JSON.parse(fs.readFileSync("cookies.json"));
    // console.log(cookies);

    // Xây dựng arguments cho yt-dlp
    const ytdlpArgs = [
      url,
      "-f",
      "bestaudio[ext=m4a]/bestaudio", // Ưu tiên m4a, fallback sang best audio
      "-o",
      tempFileName,
      "--no-playlist",
      "--user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    ];

    // Thêm proxy nếu có
    if (options.proxy) {
      ytdlpArgs.push("--proxy", options.proxy);
    }

    // Thêm cookies nếu có
    if (cookies) {
      console.log(cookies);
      ytdlpArgs.push("--cookies", cookies);
    }

    // Thêm các options bổ sung để tránh bot detection
    ytdlpArgs.push(
      "--sleep-interval",
      "1",
      "--max-sleep-interval",
      "5",
      "--ignore-errors",
      "--no-warnings"
    );

    console.log(`Bắt đầu tải audio từ: ${url}`);

    // Hàm thực hiện download với retry
    const attemptDownload = (retryCount = 0) => {
      const ytdlpProcess = spawn("yt-dlp", ytdlpArgs);

      let actualTempFile = null;
      let stderr = "";

      ytdlpProcess.stdout.on("data", (data) => {
        const output = data.toString();
        console.log(`yt-dlp: ${output.trim()}`);

        // Tìm tên file download
        const downloadMatch = output.match(/\[download\] Destination: (.+)/);
        if (downloadMatch) {
          actualTempFile = downloadMatch[1];
        }
      });

      ytdlpProcess.stderr.on("data", (data) => {
        stderr += data.toString();
        console.error(`yt-dlp stderr: ${data.toString().trim()}`);
      });

      ytdlpProcess.on("close", (code) => {
        if (code === 0) {
          // Tìm file temp thực tế nếu chưa tìm thấy
          if (!actualTempFile) {
            const files = fs
              .readdirSync("./")
              .filter((file) => file.startsWith(`temp_audio_${timestamp}`));
            if (files.length > 0) {
              actualTempFile = files[0];
            }
          }

          if (actualTempFile && fs.existsSync(actualTempFile)) {
            console.log(`Đã tải audio tạm thời thành công: ${actualTempFile}`);

            // Chuyển đổi audio bằng FFmpeg
            convertAudio(actualTempFile, finalOutputPath)
              .then(() => {
                // Xóa file tạm
                fs.unlink(actualTempFile, (err) => {
                  if (err) console.error("Lỗi khi xóa file tạm:", err);
                });
                resolve();
              })
              .catch(reject);
          } else {
            reject(new Error("Không tìm thấy file audio đã tải xuống"));
          }
        } else {
          console.error(`yt-dlp thoát với mã lỗi: ${code}`);
          console.error(`stderr: ${stderr}`);

          // Retry logic
          if (retryCount < maxRetries) {
            console.log(`Thử lại lần ${retryCount + 1}/${maxRetries}...`);
            setTimeout(() => {
              attemptDownload(retryCount + 1);
            }, 2000 * (retryCount + 1)); // Exponential backoff
          } else {
            reject(
              new Error(`yt-dlp failed after ${maxRetries} attempts: ${stderr}`)
            );
          }
        }
      });

      ytdlpProcess.on("error", (error) => {
        if (error.code === "ENOENT") {
          reject(
            new Error(
              "yt-dlp không được tìm thấy. Vui lòng cài đặt yt-dlp: pip install yt-dlp"
            )
          );
        } else {
          reject(error);
        }
      });
    };

    // Bắt đầu download
    attemptDownload();
  });
}

/**
 * Chuyển đổi audio bằng FFmpeg
 * @param {string} inputFile - File audio đầu vào
 * @param {string} outputFile - File audio đầu ra
 * @returns {Promise<void>}
 */
function convertAudio(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .save(outputFile)
      .on("end", () => {
        console.log(`Đã chuyển đổi và lưu audio thành công: ${outputFile}`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`Đã xảy ra lỗi khi chuyển đổi audio: ${err.message}`);
        reject(err);
      });
  });
}

/**
 * Lấy thông tin video từ YouTube
 * @param {string} url - URL của video YouTube
 * @returns {Promise<Object>} - Thông tin video
 */
function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const ytdlpProcess = spawn("yt-dlp", [
      url,
      "--print-json",
      "--no-warnings",
      "--skip-download",
    ]);

    let stdout = "";
    let stderr = "";

    ytdlpProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ytdlpProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ytdlpProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(stdout);
          resolve(info);
        } catch (error) {
          reject(
            new Error("Không thể parse thông tin video: " + error.message)
          );
        }
      } else {
        reject(new Error(`yt-dlp failed: ${stderr}`));
      }
    });

    ytdlpProcess.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = {
  downloadAndConvertAudio,
  getVideoInfo,
};
