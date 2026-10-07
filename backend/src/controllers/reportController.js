const { Report } = require("../models");

const createReport = async (req, res) => {
  try {
    const { postId, reason, description } = req.body;

    if (!postId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Post ID and reason are required",
      });
    }

    const report = await Report.create({
      postId,
      userId: req.user.id,
      reason,
      description: description || null,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createReport,
  getReports,
};
