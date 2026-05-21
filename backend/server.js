const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const driverRoutes = require("./routes/driverRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const ownerOrderRoutes = require("./routes/ownerOrderRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HighwayHub backend is running"
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API health is OK"
  });
});

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/driver", driverRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/owner", ownerRoutes);
app.use("/api/v1/owner/orders", ownerOrderRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };