const { ComplaintResponse } = require("../models");

const createComplaintResponse = async (req, res) => {
    try {
        const { complaintId, response } = req.body;

        if (!complaintId || !response) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID and response are required",
            });
        }

        const complaintResponse = await ComplaintResponse.create({
            complaintId,
            adminId: req.user.id,
            response,
        });

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