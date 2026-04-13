import express from 'express';
import {
  getMediatorBookings,
  updateBookingCost,
  assignMediator,
  unassignMediator,
  getAllMediators,
  getMediatorUsers,
  getMediatorById,
  promoteToMediator,
  adminUpdateMediator,
  demoteMediator,
  toggleMediatorAvailability,
  getAllNonMediatorUsers,
} from '../controllers/mediatorController.js';

import { verifyAdmin, verifyToken, verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Admin: Mediator CRUD ──────────────────────────────────────────────
// Get all mediator profiles (populated with user info)
router.get('/mediators', verifyToken, verifyAdmin, getAllMediators);

// Get all users with role=mediator
router.get('/mediator-users', verifyToken, verifyAdmin, getMediatorUsers);

// Get all non-mediator users (for promotion)
router.get('/non-mediator-users', verifyToken, verifyAdmin, getAllNonMediatorUsers);

// Get single mediator by Mediator _id
router.get('/mediator/:id', verifyToken, verifyAdmin, getMediatorById);

// Promote a user to mediator (creates Mediator profile + sets role)
router.post('/promote', verifyToken, verifyAdmin, promoteToMediator);

// Admin update mediator profile (by Mediator _id)
router.put('/mediator/:id', verifyToken, verifyAdmin, adminUpdateMediator);

// Toggle mediator availability
router.put('/mediator/:id/toggle-availability', verifyToken, verifyAdmin, toggleMediatorAvailability);

// Demote mediator back to user
router.put('/mediator/:id/demote', verifyToken, verifyAdmin, demoteMediator);

// ── Admin: Booking ↔ Mediator Assignment ────────────────────────────
// Get bookings for a mediator
router.get('/mediator-bookings/:id', verifyToken, verifyAdmin, getMediatorBookings);

// Assign mediator to booking
router.put('/assign-mediator/:id', verifyToken, verifyAdmin, assignMediator);

// Unassign mediator from booking
router.put('/unassign-mediator/:id', verifyToken, verifyAdmin, unassignMediator);

// Update cost/hours for a booking
router.put('/booking-cost/:id', verifyToken, verifyAdmin, updateBookingCost);

export default router;