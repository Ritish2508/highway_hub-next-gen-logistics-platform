import express from "express";
import { requireSignIn, isOwner } from "../middlewares/authMiddlewares.js";
import { addVehicle, getMyVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

// Add a new vehicle
router.post("/add", requireSignIn, isOwner, addVehicle);

// Get all vehicles of logged-in owner
router.get("/my-vehicles", requireSignIn, isOwner, getMyVehicles);

export default router;
