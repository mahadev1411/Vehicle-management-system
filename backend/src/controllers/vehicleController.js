const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

/**
 * @desc    Create a new vehicle
 * @route   POST /api/vehicles
 * @access  Admin
 */
const createVehicle = async (req, res) => {
  try {
    const { name, number } = req.body;

    if (!name || !number) {
      return res.status(400).json({ message: "Name and number are required" });
    }

    const vehicleExists = await Vehicle.findOne({ number });
    if (vehicleExists) {
      return res.status(400).json({ message: "Vehicle already exists" });
    }

    const vehicle = await Vehicle.create({ name, number });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all vehicles
 * @route   GET /api/vehicles
 * @access  Admin
 */
const getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().populate("assignedTo", "name email");
  res.json(vehicles);
};

/**
 * @desc    Assign vehicle to user
 * @route   PUT /api/vehicles/:id/assign
 * @access  Admin
 */
const assignVehicle = async (req, res) => {
  try {
    const { userId } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    vehicle.assignedTo = userId;
    await vehicle.save();

    res.json({
      message: "Vehicle assigned successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update vehicle
 * @route   PUT /api/vehicles/:id
 * @access  Admin
 */
const updateVehicle = async (req, res) => {
  try {
    const { name, number } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check if new number already exists (if number is being changed)
    if (number && number !== vehicle.number) {
      const vehicleExists = await Vehicle.findOne({ number });
      if (vehicleExists) {
        return res.status(400).json({ message: "Vehicle number already exists" });
      }
    }

    vehicle.name = name || vehicle.name;
    vehicle.number = number || vehicle.number;
    await vehicle.save();

    res.json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Admin
 */
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get vehicles assigned to logged-in user
 * @route   GET /api/vehicles/my
 * @access  User
 */
const getMyVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ assignedTo: req.user._id });
  res.json(vehicles);
};

module.exports = {
  createVehicle,
  getAllVehicles,
  assignVehicle,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
};
