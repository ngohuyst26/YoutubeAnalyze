# Base image
FROM node:20

# Cài các thư viện cần thiết cho Puppeteer và FFmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Thư mục ứng dụng trong container
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cài đặt npm packages
RUN npm install

# Tạo thư mục lưu data nếu chưa có
RUN mkdir -p /data

# Phơi bày port
EXPOSE 8080

# Start ứng dụng
CMD ["node src/app.js", "app.js"]
