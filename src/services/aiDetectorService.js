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
  console.log(res.data.documents);

  const data = {
    ai_probability: res.data.documents[0].completely_generated_prob,
    sentences: res.data.documents[0].sentences,
  };

  return data;
}

module.exports = { detectAIProbability };
