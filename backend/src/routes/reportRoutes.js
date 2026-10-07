const express = require("express");

const {
  createReport,
  getReports,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, createReport);

// Only mentors can view reports
router.get("/", protect, authorize("MENTOR"), getReports);

module.exports = router;