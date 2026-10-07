const express = require("express");

const {
    createComplaintResponse,
    getComplaintResponses,
} = require("../controllers/complaintResponseController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("MENTOR"),
    createComplaintResponse
);

router.get(
    "/",
    protect,
    authorize("MENTOR"),
    getComplaintResponses
);

module.exports = router;