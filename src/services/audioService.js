const ytdl = require("@distube/ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Tải audio thô từ YouTube, lưu tạm, sau đó chuyển đổi bằng FFmpeg.
 * @param {string} url - URL của video YouTube.
 * @param {string} finalOutputPath - Đường dẫn đầy đủ của file audio đầu ra (bao gồm cả tên file và định dạng).
 * @returns {Promise<void>} - Một Promise sẽ được giải quyết khi quá trình hoàn tất.
 */
function downloadAndConvertAudio(url, finalOutputPath) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime();
    const tempFileName = `temp_audio_${timestamp}.m4a`;

    ytdl(url, { filter: "audioonly", quality: "highestaudio" })
      .pipe(fs.createWriteStream(tempFileName))
      .on("finish", () => {
        console.log(`Đã tải audio tạm thời thành công: ${tempFileName}`);

        ffmpeg(tempFileName)
          .audioCodec("pcm_s16le")
          .audioChannels(1)
          .audioFrequency(16000)
          .format("wav")
          .save(finalOutputPath)
          .on("end", () => {
            console.log(
              `Đã chuyển đổi và lưu audio thành công: ${finalOutputPath}`
            );
            fs.unlink(tempFileName, (err) => {
              // Xóa file tạm
              if (err) console.error("Lỗi khi xóa file tạm:", err);
              resolve();
            });
          })
          .on("error", (err) => {
            console.error(
              `Đã xảy ra lỗi khi chuyển đổi audio từ file tạm: ${err.message}`
            );
            reject(err);
          });
      })
      .on("error", (err) => {
        console.error("Đã xảy ra lỗi khi tải audio từ YouTube:", err);
        reject(err);
      });
  });
}

module.exports = { downloadAndConvertAudio };
