/**
 * @desc    Get telemetry data for a vehicle
 * @route   GET /api/telemetry/:vehicleId
 * @access  Protected
 */
const getTelemetry = async (req, res) => {
  const { vehicleId } = req.params;

  // Mock telemetry data
  const telemetry = {
    speed: [10, 15, 20, 18, 22],
    battery: [100, 95, 90, 85, 80],
    temperature: [30, 31, 32, 33, 34],
    gps: {
      lat: 18.52,
      lng: 73.85,
    },
    lastUpdated: new Date(),
  };

  res.json({
    vehicleId,
    telemetry,
  });
};

module.exports = {
  getTelemetry,
};
