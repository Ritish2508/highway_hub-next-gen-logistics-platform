

// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // REGISTER
// export const registerController = async (req, res) => {
//   const { name, email, password, role, phone } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: "User exists" });

//   const hashed = await bcrypt.hash(password, 10);

//   await User.create({
//     name,
//     email,
//     password: hashed,
//     role: role || "user",
//     phone,
//   });

//   res.json({ success: true, message: "Registered successfully" });
// };

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // ✅ Phone validation regex (+91XXXXXXXXXX)
    const phoneRegex = /^\+91[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be in +91XXXXXXXXXX format",
      });
    }

    // check email
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email already registered" });

    // check phone
    const phoneExists = await User.findOne({ phone });
    if (phoneExists)
      return res.status(400).json({ message: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
      phone,
    });

    res.json({ success: true, message: "Registered successfully" });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "owner" && !user.isApproved)
    return res.status(403).json({ message: "Owner not approved" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role });
};

// // LOGIN
// export const loginController = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ message: "User not found" });

//   if (user.role === "owner" && !user.isApproved)
//     return res.status(403).json({ message: "Owner not approved" });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(401).json({ message: "Invalid password" });

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   res.json({ token, role: user.role });
// };
