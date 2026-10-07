const express = require("express");
const {
  createReport,
  getReports,
} = require("../controllers/reportController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReport);
router.get("/", protect, getReports);

module.exports = router;
