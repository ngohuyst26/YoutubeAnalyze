const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { captureThumbnail } = require("./puppeteerService");
const { downloadAndConvertAudio } = require("./audioService");
const { transcribeAudio } = require("./elevenlabsService");
const { detectAIProbability } = require("./aiDetectorService");
const { saveResult } = require("./storageService");

async function analyzeYoutube(url) {
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const id = uuidv4();
  const screenshotPath = path.join("data", `${id}.png`);
  const audioPath = path.join("data", `${id}.wav`);
  const resultPath = path.join("data", `${id}.json`);

  await captureThumbnail(url, screenshotPath);

  await downloadAndConvertAudio(url, audioPath);

  const transcript = await transcribeAudio(audioPath);

  const aiProbality = await detectAIProbability(transcript.text);

  const result = {
    screenshot: screenshotPath,
    language_code: transcript.language_code,
    language_probability: transcript.language_probability,
    content: transcript.text,
    ai_probability: aiProbality.ai_probability,
    sentences: aiProbality.sentences,
    words: transcript.words,
  };

  saveResult(resultPath, result);

  return id;
}

module.exports = { analyzeYoutube };
