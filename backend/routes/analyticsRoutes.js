import express from 'express';
import { getAdminAnalytics, getMediatorAnalytics } from '../controllers/analyticsController.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', verifyToken, verifyAdmin, getAdminAnalytics);
router.get('/mediator', verifyToken, getMediatorAnalytics);

export default router;
