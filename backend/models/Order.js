


// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     pickup: {
//       address: { type: String, required: true },
//       lat: { type: Number, required: true },
//       lng: { type: Number, required: true },
//     },

//     drop: {
//       address: { type: String, required: true },
//       lat: { type: Number, required: true },
//       lng: { type: Number, required: true },
//     },

//     goodsType: { type: String, required: true },
//     weight: { type: Number, required: true },

//     // status: {
//     //   type: String,
//     //   enum: ["Pending", "Accepted", "Assigned", "PickedUp", "InTransit", "Delivered"],
//     //   default: "Pending",
//     // },

//     status: {
//   type: String,
//   enum: ["Pending", "Accepted", "Assigned", "PickedUp", "InTransit", "Delivered", "Cancelled"],
//   default: "Pending",
// },

//     owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    pickup: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    drop: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    goodsType: { type: String, required: true },
    weight: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Assigned",
        "PickedUp",
        "InTransit",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },

    distanceKm: {
      type: Number,
      default: 0,
    },

    estimatedDurationMin: {
      type: Number,
      default: 0,
    },

    fare: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);