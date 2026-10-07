const authRoutes = require("./routes/authRoutes");
const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

require("./models");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

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
    console.log("All models loaded successfully");

    app.listen(PORT, () => {
      console.log(`CampusVoice backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();
