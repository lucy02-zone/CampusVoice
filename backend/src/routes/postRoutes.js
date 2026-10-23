const express = require("express");
const {
  createPost,
  getPosts,
  getPostStats,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("STUDENT", "MENTOR"), getPosts);
router.get("/stats", protect, authorize("STUDENT", "MENTOR"), getPostStats);
router.post("/", protect, authorize("STUDENT", "MENTOR"), createPost);

module.exports = router;
