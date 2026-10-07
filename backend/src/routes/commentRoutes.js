const express = require("express");
const {
  createComment,
  getCommentsByPost,
} = require("../controllers/commentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:postId", getCommentsByPost);
router.post("/", protect, createComment);

module.exports = router;
