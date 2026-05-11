import express from "express";
import { PrismaClient } from "@prisma/client";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", protect, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error("USER FETCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;