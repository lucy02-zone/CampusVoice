const express = require("express");
const { getUserStats } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getUserStats);

module.exports = router;
