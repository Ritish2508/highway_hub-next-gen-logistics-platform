// import Driver from "../models/Driver.js";

// export const assignDriverToOwner = async (req, res) => {
//   const { driverId } = req.params;

//   const driver = await Driver.findById(driverId);
//   if (!driver) {
//     return res.status(404).json({ message: "Driver not found" });
//   }

//   driver.owner = req.user._id;
//   await driver.save();

//   res.json({
//     success: true,
//     message: "Driver assigned to owner successfully",
//     driver,
//   });
// };

import Driver from "../models/Driver.js";

export const assignDriverToOwner = async (req, res) => {
  try {
    // const ownerId = req.user.id;
    // const { driverId } = req.params; // check for assiging driver
    const { orderId } = req.params;
const { driverId } = req.body;

    // ✅ FIX: find by driverId (NOT _id)
    const driver = await Driver.findOne({ driverId });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.owner = ownerId;
    await driver.save();

    res.json({
      success: true,
      message: "Driver assigned to owner successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
