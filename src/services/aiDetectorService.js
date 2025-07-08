const axios = require("axios");

async function detectAIProbability(text) {
  const res = await axios.post(
    "https://api.gptzero.me/v2/predict/text",
    { document: text, multilingual: false },
    {
      headers: {
        "x-api-key": process.env.GPTZERO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const data = {
    average_generated_prob: res.documents.average_generated_prob,
    ai_probability: res.documents.sentences,
  };

  return data;
}

module.exports = { detectAIProbability };
