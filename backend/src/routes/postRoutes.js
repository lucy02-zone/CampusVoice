const express = require("express");
const {
  createPost,
  getPosts,
  getPostStats,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPosts);
router.get("/stats", getPostStats);
router.post("/", protect, createPost);

module.exports = router;
