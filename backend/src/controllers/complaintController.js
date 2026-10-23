const { Complaint } = require("../models");

const createComplaint = async (req, res) => {
  try {
    const { subject, category, description } = req.body;
    if (!subject?.trim() || !category?.trim() || !description?.trim()) {
      return res.status(400).json({ success: false, message: "Subject, category, and description are required" });
    }
    const complaint = await Complaint.create({
      userId: req.user.id,
      subject: subject.trim(),
      category: category.trim(),
      description: description.trim(),
    });
    return res.status(201).json({ success: true, message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error("Create complaint error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getComplaints = async (_req, res) => {
  try {
    const complaints = await Complaint.findAll({ order: [["createdAt", "DESC"]] });
    return res.json({ success: true, complaints });
  } catch (error) {
    console.error("Get complaints error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createComplaint, getComplaints };
