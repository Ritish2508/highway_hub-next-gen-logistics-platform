import express from "express";

const router = express.Router();

// temporary basic test route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Owner routes working",
  });
});

export default router;