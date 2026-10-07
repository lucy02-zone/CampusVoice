const { Post } = require("../models");

const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content and category are required",
      });
    }

    const post = await Post.create({
      userId: req.user.id,
      anonymousId: `ANON-${req.user.id}`,
      title,
      content,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["userId"],
      },
    });

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
};
