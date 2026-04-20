// import Order from "../models/Order.js";
// import Driver from "../models/Driver.js";


// export const getPendingOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ status: "Pending" })
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const acceptOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.status !== "Pending") {
//       return res
//         .status(400)
//         .json({ message: "Order already processed" });
//     }

//     order.status = "Accepted";
//     order.owner = req.user.id;

//     await order.save();

//     res.json({
//       success: true,
//       message: "Order accepted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// // assign driver for order

// export const assignDriverToOrder = async (req, res) => {
//   try {
//     // const { orderId, driverId } = req.params;
//     const { orderId } = req.params;   // URL se
//     const { driverId } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     console.log("order.owner:", order.owner);
// console.log("req.user:", req.user);
//     // ✅ OWNER CHECK (IMPORTANT FIX)
//    if (order.owner.toString() !== req.user.id.toString()) {
//   return res.status(403).json({ message: "Not your order" });
// }

//     // ✅ STATUS CHECK
//     if (order.status !== "Accepted") {
//       return res.status(400).json({
//         message: "Order must be accepted before assigning driver",
//       });
//     }
//     // for checking
// const driver = await Driver.findOne({ driverId });
// if (!driver) {
//   return res.status(404).json({ message: "Driver not found" });
// }

// // availability check
// if (!driver.isAvailable) {
//       return res.status(400).json({
//         message: "Driver is already assigned to another order",
//       });
//     }
//     // order.driver = driverId;
//     order.driver = driver.id;
//     order.status = "Assigned";

//     await order.save();

//     res.json({
//       success: true,
//       message: "Driver assigned successfully",
//       order,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error assigning driver",
//       error: error.message,
//     });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       owner: req.user.id, // only this owner's orders
//     })
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };







import Order from "../models/Order.js";
import Driver from "../models/Driver.js";
import { io } from "../server.js";


// Pending orders 
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Pending" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept order
export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending")
      return res.status(400).json({ message: "Order already processed" });

    order.status = "Accepted";
    order.owner = req.user.id;
    await order.save();

    io.emit("orderUpdated", order); // for realtime update


    res.json({ success: true, message: "Order accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign driver (manual)
export const assignDriverToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.owner.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not your order" });

    if (order.status !== "Accepted")
      return res.status(400).json({ message: "Order must be accepted before assigning driver" });

    const driver = await Driver.findOne({ driverId, owner: req.user.id });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (!driver.isAvailable) return res.status(400).json({ message: "Driver is already assigned" });

    order.driver = driver._id;
    order.status = "Assigned";
    await order.save();

    driver.isAvailable = false;
    await driver.save();

    res.json({ success: true, message: "Driver assigned successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error assigning driver", error: error.message });
  }
};

// My Orders (accepted/assigned) for owner
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.user.id })
      .populate("user", "name email phone") // ✅ phone bhi populate karo frontend ke liye
      .populate("driver", "driverId")       // ✅ driver info for dropdown/details
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





// Get all drivers created by logged-in owner
// export const getDriversForOwner = async (req, res) => {
//   try {
//     const ownerId = req.user.id;

//     // find drivers belonging to this owner
//     const drivers = await Driver.find({ owner: ownerId }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       drivers, // ye frontend me dropdown me populate hoga
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getDriversForOwner = async (req, res) => {
  try {
    const drivers = await Driver.find({ owner: req.user.id }).select(
      "_id driverId isAvailable plainPassword"
    );
    res.json({ success: true, drivers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




// details controller



export const getOwnerOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("owner", "name email")
      .populate("driver", "driverId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔒 only that owner can view
    if (!order.owner || order.owner._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getOwnerTrackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("owner", "name email")
      .populate("driver", "driverId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // only same owner can track
    if (!order.owner || order.owner._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getOwnerTrackOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tracking order",
    });
  }
};