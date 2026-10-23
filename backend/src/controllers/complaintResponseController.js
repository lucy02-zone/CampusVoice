const { Complaint, ComplaintResponse } = require("../models");

const createComplaintResponse = async (req, res) => {
    try {
        const { complaintId, response } = req.body;
        const status = req.body.status || "REVIEWED";

        if (!complaintId || !response?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID and response are required",
            });
        }

        if (!["REVIEWED", "RESOLVED"].includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be REVIEWED or RESOLVED" });
        }
        const complaint = await Complaint.findByPk(complaintId);
        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        const complaintResponse = await ComplaintResponse.create({
            complaintId,
            adminId: req.user.id,
            response: response.trim(),
            status,
        });
        await complaint.update({ status });

        res.status(201).json({
            success: true,
            message: "Complaint response created successfully",
            complaintResponse,
        });
    } catch (error) {
        console.error("Complaint response error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getComplaintResponses = async (req, res) => {
    try {
        const responses = await ComplaintResponse.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.json({
            success: true,
            responses,
        });
    } catch (error) {
        console.error("Get complaint responses error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createComplaintResponse,
    getComplaintResponses,
};
