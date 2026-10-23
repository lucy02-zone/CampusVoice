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
    authorize("ADMIN", "MENTOR"),
    createComplaintResponse
);

router.get(
    "/",
    protect,
    authorize("ADMIN", "MENTOR"),
    getComplaintResponses
);

module.exports = router;
