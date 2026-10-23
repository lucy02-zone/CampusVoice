const express = require("express");
const { votePost } = require("../controllers/voteController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("STUDENT", "MENTOR"), votePost);

module.exports = router;
