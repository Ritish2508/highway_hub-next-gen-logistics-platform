


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import driverRoutes from "./routes/driverRoutes.js";
// import vehicleRoutes from "./routes/vehicleRoutes.js";
// // import ownerRoutes from "./routes/ownerRoutes.js"
// import orderRoutes from "./routes/orderRoutes.js";
// import ownerOrderRoutes from "./routes/ownerOrderRoutes.js";








// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // app.use("/api/v1/auth", authRoutes);
// // app.use("/api/v1/admin", adminRoutes);
// // app.use("/api/v1/driver", driverRoutes);
// // app.use("/api/v1/vehicle", vehicleRoutes);
// // app.use("/api/v1/owner", ownerRoutes,ownerOrderRoutes);
// // app.use("/api/v1/order", orderRoutes);

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/driver", driverRoutes);
// app.use("/api/v1/vehicle", vehicleRoutes);
// app.use("/api/v1/owner", ownerOrderRoutes);          // owner routes
// // app.use("/api/v1/owner/order", ownerOrderRoutes); // owner order routes
// app.use("/api/v1/user", orderRoutes);



// app.get("/", (req, res) => {
//   res.send("Highway Hub Backend is running 🚀");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import ownerOrderRoutes from "./routes/ownerOrderRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/driver", driverRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);
app.use("/api/v1/owner", ownerOrderRoutes);
app.use("/api/v1/user", orderRoutes);

// ✅ Health
app.get("/", (req, res) => {
  res.send("Highway Hub Backend is running 🚀");
});

// 🔥 Socket setup
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // ✅ Join a room by orderId
  socket.on("joinOrderRoom", (orderId) => {
    if (!orderId) return;
    socket.join(orderId);
    // console.log("joined room:", orderId);
  });

  // ✅ Leave a room by orderId
  socket.on("leaveOrderRoom", (orderId) => {
    if (!orderId) return;
    socket.leave(orderId);
    // console.log("left room:", orderId);
  });

  // ✅ Driver live location updates
  // payload: { orderId, lat, lng }
  socket.on("driverLocationUpdate", ({ orderId, lat, lng }) => {
    if (!orderId || lat == null || lng == null) return;

    io.to(orderId).emit("driverLocation", {
      orderId,
      lat,
      lng,
      ts: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});