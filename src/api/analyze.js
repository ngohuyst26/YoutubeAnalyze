const express = require("express");
const router = express.Router();

const { analyzeYoutube } = require("../services/analyzeService");

router.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res
        .status(400)
        .json({ error: "URL is required and must be a string." });
    }

    const resultId = await analyzeYoutube(url);
    res.status(200).json({ id: resultId });
  } catch (error) {
    console.error("Error in /analyze:", error);
    res.status(500).json({ error: "Failed to analyze YouTube video." });
  }
});

module.exports = router;
