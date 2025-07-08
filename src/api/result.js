const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.get("/result/:id", (req, res) => {
  const { id } = req.params;
  const resultPath = path.join(__dirname, "../../data", `${id}.json`);

  if (!fs.existsSync(resultPath)) {
    return res.status(404).json({ error: "Result not found." });
  }

  try {
    const data = fs.readFileSync(resultPath, "utf-8");
    const json = JSON.parse(data);
    res.json(json);
  } catch (error) {
    console.error("Error reading result file:", error);
    res.status(500).json({ error: "Error reading result file." });
  }
});

module.exports = router;
