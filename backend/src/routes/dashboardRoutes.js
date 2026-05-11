import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// GET /api/dashboard - Get all dashboard statistics
router.get('/', getDashboardData);

export default router;