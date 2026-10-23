const express = require("express");
const { getUserStats, createMentor, getMentors } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/stats", protect, getUserStats);
router.post("/mentors", protect, authorize("ADMIN"), createMentor);
router.get("/mentors", protect, authorize("ADMIN"), getMentors);

module.exports = router;
