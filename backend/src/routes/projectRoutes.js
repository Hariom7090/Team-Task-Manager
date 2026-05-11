import express from "express";
import { PrismaClient } from "@prisma/client";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();


// GET ALL PROJECTS
router.get("/", protect, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: true,
        tasks: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects,
    });

  } catch (error) {
    console.error("GET PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// CREATE PROJECT
router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        createdBy: req.user.id, // IMPORTANT FIX
      },
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });

  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;