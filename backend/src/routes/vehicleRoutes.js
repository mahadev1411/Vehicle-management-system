const express = require("express");
const router = express.Router();

const {
  createVehicle,
  getAllVehicles,
  assignVehicle,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
} = require("../controllers/vehicleController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Admin routes
router.post("/", protect, authorizeRoles("admin"), createVehicle);
router.get("/", protect, authorizeRoles("admin"), getAllVehicles);
router.put("/:id", protect, authorizeRoles("admin"), updateVehicle);
router.delete("/:id", protect, authorizeRoles("admin"), deleteVehicle);
router.put("/:id/assign", protect, authorizeRoles("admin"), assignVehicle);

// User route
router.get("/my", protect, authorizeRoles("user"), getMyVehicles);

module.exports = router;
