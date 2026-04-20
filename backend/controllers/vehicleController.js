import Vehicle from "../models/Vehicle.js";

export const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, type, capacity } = req.body;

    if (!vehicleNumber || !type || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Vehicle.findOne({ vehicleNumber });
    if (exists) {
      return res.status(409).json({ message: "Vehicle already exists" });
    }

    const vehicle = await Vehicle.create({
      owner: req.user.id,
      vehicleNumber,
      type,
      capacity,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
