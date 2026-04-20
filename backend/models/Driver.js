
// // import mongoose from "mongoose";

// // const driverSchema = new mongoose.Schema(
// //   {
// //     driverId: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //     },
// //     password: {
// //       type: String,
// //       required: true,
// //     },
// //     owner: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       default: null, // later owner assign karega
// //     },
// //     isActive: {
// //       type: Boolean,
// //       default: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // export default mongoose.model("Driver", driverSchema);


// import mongoose from "mongoose";

// const driverSchema = new mongoose.Schema(
//   {
//     driverId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     // 🔒 DRIVER ACCOUNT STATUS
//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     // 🚚 DRIVER AVAILABILITY (IMPORTANT)
//     isAvailable: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Driver", driverSchema);




import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    plainPassword: { type: String }, // ❗ new field for dashboard
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
