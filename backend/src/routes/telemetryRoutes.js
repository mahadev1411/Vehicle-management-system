const express = require("express");
const router = express.Router();
const { getTelemetry } = require("../controllers/telemetryController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:vehicleId", protect, getTelemetry);

module.exports = router;
