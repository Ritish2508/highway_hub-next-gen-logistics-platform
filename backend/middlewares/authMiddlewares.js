import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Driver from "../models/Driver.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id);

    if (!user) {
      user = await Driver.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

export const isOwner = (req, res, next) => {
  if (req.user?.role !== "owner") {
    return res.status(403).json({
      success: false,
      message: "Owner access required",
    });
  }
  next();
};

export const isDriver = (req, res, next) => {
  if (req.user?.role !== "driver") {
    return res.status(403).json({
      success: false,
      message: "Driver access required",
    });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "User access required",
    });
  }
  next();
};