const bcrypt = require("bcrypt");
const { Post, Comment, Vote, User } = require("../models");
const { generateAnonymousHandle } = require("../utils/anonymousHandle");

const createMentor = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account already uses this email" });
    }

    const mentor = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: "MENTOR" });
    const anonymousHandle = generateAnonymousHandle(mentor.id);
    await mentor.update({ anonymousHandle });
    return res.status(201).json({
      success: true,
      message: "Mentor account created successfully",
      user: { id: mentor.id, name: mentor.name, email: mentor.email, role: mentor.role },
    });
  } catch (error) {
    console.error("Create mentor error:", error.message);
    return res.status(500).json({ success: false, message: "Server error creating mentor account" });
  }
};

const getMentors = async (_req, res) => {
  try {
    const mentors = await User.findAll({
      where: { role: "MENTOR" },
      attributes: ["id", "name", "email", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, mentors });
  } catch (error) {
    console.error("Get mentors error:", error.message);
    return res.status(500).json({ success: false, message: "Server error loading mentors" });
  }
};

const updateMentor = async (req, res) => {
  try {
    const mentor = await User.findOne({ where: { id: req.params.id, role: "MENTOR" } });
    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor account not found" });
    }

    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== mentor.id) {
      return res.status(409).json({ success: false, message: "An account already uses this email" });
    }

    await mentor.update({ name, email });
    return res.json({
      success: true,
      message: "Mentor account updated successfully",
      user: { id: mentor.id, name: mentor.name, email: mentor.email, role: mentor.role, createdAt: mentor.createdAt },
    });
  } catch (error) {
    console.error("Update mentor error:", error.message);
    return res.status(500).json({ success: false, message: "Server error updating mentor account" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const postsCount = await Post.count({ where: { userId } });
    const commentsCount = await Comment.count({ where: { userId } });
    const votesGiven = await Vote.count({ where: { userId } });

    // Calculate reputation based on upvotes received on user's posts
    const userPosts = await Post.findAll({
      where: { userId },
      attributes: ["id"],
    });
    const postIds = userPosts.map((post) => post.id);

    let upvotesReceived = 0;
    let downvotesReceived = 0;

    if (postIds.length > 0) {
      upvotesReceived = await Vote.count({
        where: {
          postId: postIds,
          voteType: "UPVOTE",
        },
      });

      downvotesReceived = await Vote.count({
        where: {
          postId: postIds,
          voteType: "DOWNVOTE",
        },
      });
    }

    res.json({
      success: true,
      stats: {
        postsCount,
        commentsCount,
        votesGiven,
        upvotesReceived,
        downvotesReceived,
        reputation: upvotesReceived - downvotesReceived,
      },
    });
  } catch (error) {
    console.error("Get User Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user stats",
    });
  }
};

module.exports = {
  getUserStats,
  createMentor,
  getMentors,
  updateMentor,
};
