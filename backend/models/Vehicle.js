import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true, // e.g., Truck, Lorry
    },
    capacity: {
      type: Number,
      required: true, // in tons or kg
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
