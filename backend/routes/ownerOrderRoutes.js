
// import express from "express";
// import {
//   getPendingOrders,
//   acceptOrder,
//   assignDriverToOrder,
// } from "../controllers/ownerOrderController.js";

// import { requireSignIn, isOwner } from "../middlewares/authMiddlewares.js";
// import { assignDriverToOwner } from "../controllers/ownerController.js";

// import { getMyOrders } from "../controllers/ownerOrderController.js";

// const router = express.Router();

// router.get("/pending-orders", requireSignIn, isOwner, getPendingOrders);
// router.put("/accept/:orderId", requireSignIn, isOwner, acceptOrder);
// router.get("/my-orders", requireSignIn, isOwner, getMyOrders);
// // router.put("/assign-driver/:orderId/:driverId", requireSignIn, isOwner, assignDriverToOrder);
// router.put(
//   "/assign-driver/:orderId",
//   requireSignIn,
//   isOwner,
//   assignDriverToOrder
// );


// export default router;
// // router.put("/assign-driver/:orderId/:driverId", requireSignIn, isOwner, assignDriverToOrder);


import express from "express";
import {
  getPendingOrders,
  acceptOrder,
  assignDriverToOrder,
  getMyOrders,
  getDriversForOwner, // ✅ new function
  getOwnerOrderDetails,
  getOwnerTrackOrder,
} from "../controllers/ownerOrderController.js";

import { requireSignIn, isOwner } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Orders
router.get("/pending-orders", requireSignIn, isOwner, getPendingOrders);
router.put("/accept/:orderId", requireSignIn, isOwner, acceptOrder);
router.get("/my-orders", requireSignIn, isOwner, getMyOrders);

// Assign Driver manually
router.put("/assign-driver/:orderId", requireSignIn, isOwner, assignDriverToOrder);

// 🔹 NEW ROUTE: Get all drivers for owner (dropdown)
router.get("/drivers", requireSignIn, isOwner, getDriversForOwner);
router.get("/order/:orderId", requireSignIn, isOwner, getOwnerOrderDetails);
router.get("/track/:orderId", requireSignIn, isOwner, getOwnerTrackOrder);

export default router;

