function detectAIProbability(text) {
  // Mô phỏng xác suất AI, có thể thay bằng gọi API thực
  return parseFloat((Math.random() * 0.6).toFixed(2));
}

// async function detectAIProbability(text) {
//   const res = await axios.post(
//     "https://api.sapling.ai/api/v1/aidetect",
//     { text },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.SAPLING_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   return res.data.probability;
// }

module.exports = { detectAIProbability };
