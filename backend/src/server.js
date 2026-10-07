const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

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

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`CampusVoice backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
};

startServer();