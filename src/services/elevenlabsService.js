const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function transcribeAudio(audioPath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(audioPath));
  form.append("model_id", "scribe_v1");
  form.append("diarize", "true");

  const res = await axios.post(
    "https://api.elevenlabs.io/v1/speech-to-text",
    form,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        ...form.getHeaders(),
      },
    }
  );

  // Trả về mảng các câu có {text, start, end, speaker}
  return res.data || [];
}

module.exports = { transcribeAudio };
