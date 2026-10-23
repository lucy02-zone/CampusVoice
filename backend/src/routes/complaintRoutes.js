const express = require("express");
const { createComplaint, getComplaints } = require("../controllers/complaintController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();
router.post("/", protect, authorize("STUDENT", "MENTOR"), createComplaint);
router.get("/", protect, authorize("ADMIN", "MENTOR"), getComplaints);
module.exports = router;
