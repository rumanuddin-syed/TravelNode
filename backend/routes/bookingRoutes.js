import express from 'express';
import { createBooking, getBooking, getUserBookings, getAllBookings, deleteBooking } from '../controllers/bookingController.js';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new booking
router.post('/', verifyToken, createBooking);

// Get a specific booking by ID (single object)
router.get('/single/:id', verifyToken, getBooking);

// Get all bookings — named admin route (MUST be before /:id to avoid route conflict)
router.get('/all-bookings', verifyToken, verifyAdmin, getAllBookings);

// Get all bookings (root)
router.get('/', getAllBookings);

// Get all bookings for a user (array)
router.get('/:id', verifyToken, getUserBookings);

router.delete('/:id', verifyToken, deleteBooking);

export default router;
