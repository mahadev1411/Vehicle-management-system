const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// @desc    Create user
// @route   POST /api/users
// @access  Admin
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

module.exports = router;
