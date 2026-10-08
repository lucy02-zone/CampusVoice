const { Post, Comment, Vote } = require("../models");

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
};
