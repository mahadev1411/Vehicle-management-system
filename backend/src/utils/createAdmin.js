const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: "admin@bullwork.com" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "Admin User",
      email: "admin@bullwork.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
