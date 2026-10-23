const express = require("express");

const {
  createReport,
  getReports,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, createReport);

router.get("/", protect, authorize("ADMIN"), getReports);

module.exports = router;
