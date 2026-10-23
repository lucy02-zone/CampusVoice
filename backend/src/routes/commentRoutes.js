const express = require("express");
const {
  createComment,
  getCommentsByPost,
} = require("../controllers/commentController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/:postId", protect, authorize("STUDENT", "MENTOR"), getCommentsByPost);
router.post("/", protect, authorize("STUDENT", "MENTOR"), createComment);

module.exports = router;
