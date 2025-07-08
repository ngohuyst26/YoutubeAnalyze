const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { captureThumbnail } = require("./puppeteerService");
const { downloadAndConvertAudio } = require("./audioService");
const { transcribeAudio } = require("./elevenlabsService");
const { detectAIProbability } = require("./aiDetectorService");
const { saveResult } = require("./storageService");

async function analyzeYoutube(url) {
  const id = uuidv4();
  const screenshotPath = path.join("data", `${id}.png`);
  const audioPath = path.join("data", `${id}.wav`);
  const resultPath = path.join("data", `${id}.json`);

  // 1. Capture screenshot
  await captureThumbnail(url, screenshotPath);

  // 2. Download and convert audio
  await downloadAndConvertAudio(url, audioPath);

  // 3. Transcribe
  const transcript = await transcribeAudio(audioPath);

  // 4. Detect AI probability for each sentence
  const aiProbality = await detectAIProbability(transcript.text);
  // console.log(aiProbality);

  // 5. Save result
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
