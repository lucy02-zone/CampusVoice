const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusVoice API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusVoice API is healthy",
  });
});

app.listen(PORT, () => {
  console.log(`CampusVoice backend running on port ${PORT}`);
});