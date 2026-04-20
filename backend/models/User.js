


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "owner", "driver", "user"],
      default: "user",
    },

    // ✅ NEW: Phone number
    phone: {
      type: String,
      required: true,
      unique: true,
    },

    // ✅ NEW: OTP system fields
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },

    // owner approval system (optional)
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
