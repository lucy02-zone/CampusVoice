const express = require("express");

const {
    createComplaintResponse,
    getComplaintResponses,
} = require("../controllers/complaintResponseController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createComplaintResponse);
router.get("/", protect, getComplaintResponses);

module.exports = router;