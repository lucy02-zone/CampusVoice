const { Comment } = require("../models");

const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: "Post ID and content are required",
      });
    }

    const comment = await Comment.create({
      postId,
      userId: req.user.id,
      anonymousId: `ANON-${req.user.id}`,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Create comment error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "ASC"]],
      attributes: {
        exclude: ["userId"],
      },
    });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
};
