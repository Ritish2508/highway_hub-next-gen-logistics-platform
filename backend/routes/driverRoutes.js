
// import express from "express";
// import {
//   createDriver,
//   driverLogin,
//   getMyOrders,
//   updateOrderStatus
// } from "../controllers/driverController.js";
// import {driverLoginController} from "../controllers/driverAuthController.js"
// import {
//   requireSignIn,
//   isOwner,
//   isDriver
// } from "../middlewares/authMiddlewares.js";

// const router = express.Router();

// router.post("/create", requireSignIn, isOwner, createDriver);
// // router.post("/login", driverLogin);
// router.post("/login", driverLoginController);
// router.get("/my-orders", requireSignIn, isDriver, getMyOrders);
// router.put("/order/status/:orderId", requireSignIn, isDriver, updateOrderStatus);

// export default router;

import express from "express";
import { createDriver, getMyOrders, updateOrderStatus ,getMyCompletedOrders} from "../controllers/driverController.js";
import { driverLoginController } from "../controllers/driverAuthController.js";
import { requireSignIn, isOwner, isDriver } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Owner creates driver
router.post("/create", requireSignIn, isOwner, createDriver);

// Driver login
router.post("/login", driverLoginController);

// Driver fetches own orders
router.get("/my-orders", requireSignIn, isDriver, getMyOrders);

// Driver updates order status
router.put("/order/status/:orderId", requireSignIn, isDriver, updateOrderStatus);


// driver all completed orders
router.get("/completed-orders", requireSignIn, isDriver, getMyCompletedOrders);

export default router;
