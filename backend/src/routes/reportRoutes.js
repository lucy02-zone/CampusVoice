const express = require("express");

const {
  createReport,
  getReports,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("STUDENT", "MENTOR"), createReport);

router.get("/", protect, authorize("ADMIN", "MENTOR"), getReports);

module.exports = router;
