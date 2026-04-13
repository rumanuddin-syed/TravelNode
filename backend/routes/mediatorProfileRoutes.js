import express from 'express';
import {
  getMediatorProfile,
  createMediatorProfile,
  updateMediatorProfile,
  getMediatorStats,
  addReview,
  getAllMediators,
  updateBookingStatus,
} from '../controllers/mediatorProfileController.js';

import { verifyToken, verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all available mediators
router.get('/all-mediators', getAllMediators);

// Create mediator profile
router.post('/create-profile', verifyToken, createMediatorProfile);

// Get mediator profile
router.get('/profile/:id', verifyToken, getMediatorProfile);

// Update mediator profile
router.put('/profile/:id', verifyToken, verifyUser, updateMediatorProfile);

// Get mediator statistics and dashboard data
router.get('/stats/:id', verifyToken, getMediatorStats);

// Add review to mediator
router.post('/review/:id', verifyToken, addReview);

// Update booking status by mediator
router.put('/booking/:id/status', verifyToken, updateBookingStatus);

export default router;
