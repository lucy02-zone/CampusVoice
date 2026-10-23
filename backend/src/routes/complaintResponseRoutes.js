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
    authorize("ADMIN"),
    createComplaintResponse
);

router.get(
    "/",
    protect,
    authorize("ADMIN"),
    getComplaintResponses
);

module.exports = router;
