const { Post } = require("../models");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

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

const getPostStats = async (req, res) => {
  try {
    // Category distribution
    const categoryRows = await Post.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["category"],
      order: [[sequelize.literal("count"), "DESC"]],
      raw: true,
    });

    const categoryDistribution = categoryRows.map((row) => ({
      category: row.category,
      count: parseInt(row.count, 10),
    }));

    // Posts per day – last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyRows = await Post.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    // Fill in missing days with 0
    const postsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const found = dailyRows.find((r) => r.date === dateStr);
      postsPerDay.push({
        date: label,
        posts: found ? parseInt(found.count, 10) : 0,
      });
    }

    res.json({
      success: true,
      categoryDistribution,
      postsPerDay,
    });
  } catch (error) {
    console.error("Get post stats error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostStats,
};
