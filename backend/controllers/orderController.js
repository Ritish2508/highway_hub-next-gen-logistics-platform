



// import Order from "../models/Order.js";

// // ✅ Place Order
// export const placeOrder = async (req, res) => {
//   try {
//     const { pickup, drop, goodsType, weight } = req.body;

//     if (!pickup?.address || pickup?.lat == null || pickup?.lng == null) {
//       return res.status(400).json({
//         message: "Pickup (address, lat, lng) required",
//       });
//     }

//     if (!drop?.address || drop?.lat == null || drop?.lng == null) {
//       return res.status(400).json({
//         message: "Drop (address, lat, lng) required",
//       });
//     }

//     if (!goodsType || !weight) {
//       return res.status(400).json({
//         message: "goodsType and weight required",
//       });
//     }

//     const order = await Order.create({
//       user: req.user.id,
//       pickup,
//       drop,
//       goodsType,
//       weight,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("placeOrder error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


import Order from "../models/Order.js";
import { getRouteInfo, calculateFare } from "../utils/routeUtils.js";

export const placeOrder = async (req, res) => {
  try {
    const { pickup, drop, goodsType, weight } = req.body;

    if (!pickup?.address || pickup?.lat == null || pickup?.lng == null) {
      return res.status(400).json({
        success: false,
        message: "Pickup (address, lat, lng) required",
      });
    }

    if (!drop?.address || drop?.lat == null || drop?.lng == null) {
      return res.status(400).json({
        success: false,
        message: "Drop (address, lat, lng) required",
      });
    }

    if (!goodsType || !weight) {
      return res.status(400).json({
        success: false,
        message: "goodsType and weight required",
      });
    }

    const { distanceKm, durationMin } = await getRouteInfo(pickup, drop);
    const fare = calculateFare(distanceKm, Number(weight));

    const order = await Order.create({
      user: req.user.id,
      pickup,
      drop,
      goodsType,
      weight: Number(weight),
      distanceKm,
      estimatedDurationMin: durationMin,
      fare,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





// ✅ User My Orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("driver", "driverId")
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

// ✅ Single Order Details for User / Track Page / View Details
export const getOrderByIdForUser = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("driver", "driverId")
      .populate("owner", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔒 Only same user can access
    if (order.user.toString() !== req.user.id.toString()) {
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
    console.error("getOrderByIdForUser error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};

// ✅ Cancel Order
export const cancelMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔒 Only same user can cancel
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // ✅ Cancel allowed only:
    // 1. Pending
    // 2. Accepted but driver not assigned
    const status = (order.status || "").toLowerCase();
    const driverAssigned = !!order.driver;

    const canCancel =
      status === "pending" || (status === "accepted" && !driverAssigned);

    if (!canCancel) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled after driver is assigned or delivery started",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("cancelMyOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};





// import { getRouteInfo, calculateFare } from "../utils/routeUtils.js";

export const estimateFare = async (req, res) => {
  try {
    const { pickup, drop, weight } = req.body;

    if (!pickup?.address || pickup?.lat == null || pickup?.lng == null) {
      return res.status(400).json({ success: false, message: "Pickup required" });
    }

    if (!drop?.address || drop?.lat == null || drop?.lng == null) {
      return res.status(400).json({ success: false, message: "Drop required" });
    }

    if (!weight || Number(weight) <= 0) {
      return res.status(400).json({ success: false, message: "Valid weight required" });
    }

    const { distanceKm, durationMin } = await getRouteInfo(pickup, drop);
    const fare = calculateFare(distanceKm, Number(weight));

    res.status(200).json({
      success: true,
      distanceKm,
      durationMin,
      fare,
    });
  } catch (error) {
    console.error("estimateFare error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to estimate fare",
    });
  }
};