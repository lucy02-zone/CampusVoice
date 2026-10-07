const { Vote } = require("../models");

const votePost = async (req, res) => {
  try {
    const { postId, voteType } = req.body;

    if (!postId || !voteType) {
      return res.status(400).json({
        success: false,
        message: "Post ID and vote type are required",
      });
    }

    if (!["UPVOTE", "DOWNVOTE"].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote type",
      });
    }

    const existingVote = await Vote.findOne({
      where: {
        postId,
        userId: req.user.id,
      },
    });

    if (existingVote) {
      existingVote.voteType = voteType;
      await existingVote.save();

      return res.json({
        success: true,
        message: "Vote updated successfully",
        vote: existingVote,
      });
    }

    const vote = await Vote.create({
      postId,
      userId: req.user.id,
      voteType,
    });

    res.status(201).json({
      success: true,
      message: "Vote recorded successfully",
      vote,
    });
  } catch (error) {
    console.error("Vote error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  votePost,
};
