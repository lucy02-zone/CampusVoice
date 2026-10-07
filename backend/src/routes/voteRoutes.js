const express = require("express");
const { votePost } = require("../controllers/voteController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, votePost);

module.exports = router;
