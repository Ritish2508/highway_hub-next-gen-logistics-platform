import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddlewares.js";
import { getPendingOwners, approveOwner } from "../controllers/adminController.js";

const router = express.Router();

router.get("/pending-owners", requireSignIn, isAdmin, getPendingOwners);
router.put("/approve-owner/:ownerId", requireSignIn, isAdmin, approveOwner);

export default router;
