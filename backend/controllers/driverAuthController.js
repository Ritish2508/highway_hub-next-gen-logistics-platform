// import Driver from "../models/Driver.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const driverLoginController = async (req, res) => {
//   try {
//     const { driverId, password } = req.body;

//     const driver = await Driver.findOne({ driverId });
//     if (!driver) {
//       return res.status(404).json({ message: "Driver not found" });
//     }

//     const match = await bcrypt.compare(password, driver.password);
//     if (!match) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { id: driver._id, role: "driver" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       message: "Driver login successful",
//       token,
//       driver,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Driver login error",
//       error,
//     });
//   }
// };



// // export const driverLoginController = (req, res) => {
// //   res.send("Driver login route working ✅");
// // };




import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const driverLoginController = async (req, res) => {
  try {
    const { driverId, password } = req.body;

    // Check if driver exists
    const driver = await Driver.findOne({ driverId });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
 console.log("Input password:", password);
console.log("Trimmed password:", password.trim());
console.log("Stored hashed password:", driver.password);

    // Compare password
    const match = await bcrypt.compare(password.trim(), driver.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: driver._id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Driver login successful",
      token,
      driver: {
        driverId: driver.driverId,
        id: driver._id,
        owner: driver.owner,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Driver login error", error });
  }
};
