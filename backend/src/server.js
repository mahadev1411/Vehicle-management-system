const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/telemetry", telemetryRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("Vehicle Management Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
