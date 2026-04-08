import express from 'express';
import {
  getMediatorBookings,
  updateBookingCost,
  assignMediator,
  getAllMediators,
} from '../controllers/mediatorController.js';

import { verifyAdmin, verifyToken, verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all mediators
router.get('/mediators', verifyToken, verifyAdmin, getAllMediators);

// Get bookings for a mediator
router.get('/mediator-bookings/:id', verifyToken, verifyUser, getMediatorBookings);

// Update cost for a booking
router.put('/booking-cost/:id', verifyToken, verifyUser, updateBookingCost);

// Assign mediator to booking
router.put('/assign-mediator/:id', verifyToken, verifyAdmin, assignMediator);

export default router;