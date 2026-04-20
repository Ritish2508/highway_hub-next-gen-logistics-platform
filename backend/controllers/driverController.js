// import Driver from "../models/Driver.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // ----------------------
// // DRIVER LOGIN
// // ----------------------
// export const driverLogin = async (req, res) => {
//   try {
//     const { driverId, password } = req.body;

//     if (!driverId || !password) {
//       return res.status(400).json({ message: "Driver ID and password required" });
//     }

//     const driver = await Driver.findOne({ driverId });
//     if (!driver)
//       return res.status(404).json({ message: "Driver not found" });

//     const match = await bcrypt.compare(password, driver.password);
//     if (!match)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: driver._id, role: "driver" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       success: true,
//       token,
//       driver: {
//         id: driver._id,
//         driverId: driver.driverId,
//         name: driver.name,
//       },
//     });
//   } catch (error) {
//     console.error("Driver login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import { io } from "../server.js";


// random driverId generator
const generateDriverId = () => {
  return "DRV" + Math.floor(100000 + Math.random() * 900000);
};


// export const createDriver = async (req, res) => {
//   try {
//     const driverId = generateDriverId();
//     const plainPassword =
//       "driver@" + Math.floor(1000 + Math.random() * 9000);

//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     const driver = await Driver.create({
//       driverId,
//       password: hashedPassword,
//       owner: req.user.id, // ✅ IMPORTANT FIX
//     });
//     console.log("Driver ID:", driverId, "Plain Password:", plainPassword);


//     res.status(201).json({
//       success: true,
//       message: "Driver created successfully",
//       credentials: {
//         driverId,
//         password: plainPassword,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const createDriver = async (req, res) => {
  try {
    const driverId = generateDriverId();
    const plainPassword = "driver@" + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const driver = await Driver.create({
      driverId,
      password: hashedPassword,
      plainPassword, // ❗ save plain password for dashboard
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      driver, // includes plainPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





// export const driverLogin = async (req, res) => {
//   try {
//     const { driverId, password } = req.body;

//     if (!driverId || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     const driver = await Driver.findOne({ driverId });
//     if (!driver) {
//       return res.status(404).json({ message: "Driver not found" });
//     }

//     const match = await bcrypt.compare(password, driver.password);
//     if (!match) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: driver._id, role: "driver" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       token,
//       driver: {
//         id: driver._id,
//         driverId: driver.driverId,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };



// export const getMyOrders = async (req, res) => {
//   try {
//     const driverId = req.user._id; // from JWT

//     const orders = await Order.find({ driver: driverId })
//       .populate("user", "name email")
//       .populate("owner", "name email");

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch driver orders",
//     });
//   }
// };


export const getMyOrders = async (req, res) => {
  try {
    const driverId = req.user.id;

    const orders = await Order.find({
      driver: driverId,
      status: { $in: ["Assigned", "PickedUp", "InTransit"] },
    })
      .populate("user", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver orders",
    });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    // console.log("req.user =", req.user); // check points

    const driverId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;

    // allowed flow
    const validFlow = {
      Assigned: ["PickedUp"],
      PickedUp: ["InTransit"],
      InTransit: ["Delivered"],
    };

    const order = await Order.findById(orderId);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // 🔒 Only assigned driver can update
    if (!order.driver || order.driver.toString() !== driverId.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    // delivery complete -> driver free
     if (status === "Delivered") {
      await Driver.findByIdAndUpdate(driverId, {
        isAvailable: true,
      });
    }

    // 🔒 Status flow validation
    const allowedNext = validFlow[order.status];
    if (!allowedNext || !allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Invalid status change from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    io.emit("orderUpdated", order);// for real time update

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating order status",
      error: error.message,
    });
  }
};



// controllers/driverController.js

export const getMyCompletedOrders = async (req, res) => {
  try {
    const driverId = req.user.id;

    const orders = await Order.find({
      driver: driverId,
      status: "Delivered",
    })
      .populate("user", "name email")
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed orders",
    });
  }
};
