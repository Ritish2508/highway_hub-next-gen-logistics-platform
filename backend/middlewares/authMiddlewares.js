// import jwt from "jsonwebtoken";

// export const requireSignIn = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Token required" });

//   req.user = jwt.verify(token, process.env.JWT_SECRET);
//   next();
// };



import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
export const isOwner = async (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access only" });
  }

  // extra check: only approved owners
  const owner = await User.findById(req.user.id);
  if (!owner.isApproved) {
    return res.status(403).json({ message: "Owner not approved by admin" });
  }

  next();
};
export const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      message: "Only users can place orders",
    });
  }
  next();
};
export const isDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({
      success: false,
      message: "Driver access denied",
    });
  }
  next();
};

