import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import Order from "../models/Order.js";
import { getIo } from "../utils/socket.js";

// random driverId generator
const generateDriverId = () => {
  return "DRV" + Math.floor(100000 + Math.random() * 900000);
};

export const createDriver = async (req, res) => {
  try {
    const driverId = generateDriverId();
    const plainPassword = "driver@" + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const driver = await Driver.create({
      driverId,
      password: hashedPassword,
      plainPassword,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      driver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

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
    const driverId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;

    const validFlow = {
      Assigned: ["PickedUp"],
      PickedUp: ["InTransit"],
      InTransit: ["Delivered"],
    };

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!order.driver || order.driver.toString() !== driverId.toString()) {
      return res.status(403).json({
        message: "Not your order",
      });
    }

    if (status === "Delivered") {
      await Driver.findByIdAndUpdate(driverId, {
        isAvailable: true,
      });
    }

    const allowedNext = validFlow[order.status];

    if (!allowedNext || !allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Invalid status change from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    const io = getIo();
    if (io) {
      io.emit("orderUpdated", order);
    }

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