# 🎥 YouTube Analysis Service

Một dịch vụ Node.js nhận URL YouTube và thực hiện:
- Tải thumbnail.
- Tải và convert audio.
- Gửi audio đi transcribe với timestamp và phân biệt người nói.
- Đánh giá mức độ AI-generated qua GPTZero.
- Trả kết quả JSON kèm ảnh thumbnail.

## 🚀 Demo API

| Method | Endpoint              | Mô tả                      |
|--------|------------------------|-----------------------------|
| POST   | `/api/analyze`        | Nhận URL YouTube, xử lý và trả về ID |
| GET    | `/api/result/:id`     | Trả về kết quả JSON đã phân tích |
| GET    | `/data/:filename`     | Truy cập ảnh thumbnail hoặc file audio |

---

## 🛠 Công nghệ sử dụng

- Node.js + Express
- Puppeteer (headless Chrome)
- FFmpeg (chuyển định dạng audio)
- ytdl-core (tải audio YouTube)
- ElevenLabs Scribe API (chuyển âm thanh thành văn bản)
- GPTZero / OpenAI / Sapling (đánh giá AI-generated)
- Docker + Docker Compose

---

## ⚙️ Cài đặt thủ công

```bash
# Clone dự án
git clone https://github.com/ngohuyst26/YoutubeAnalyze.git
cd youtube-analyze

# Cài dependencies
npm install

# Cài đặt yt-dlp dùng để tải audio từ youtube
pip install yt-dlp

# Tạo thư mục lưu trữ kết quả
mkdir -p ../data

# Chạy server
node app.js
