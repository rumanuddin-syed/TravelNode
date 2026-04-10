import express from 'express';
import { createReview, deleteReview, getAllReviews, toggleStarReview, updateReview } from '../controllers/reviewController.js';
import { verifyUser, verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Get all reviews
router.get('/', getAllReviews);

// Create a new review
router.post('/:tourId', verifyToken, verifyUser, createReview);

// Toggle Star review
router.patch('/:id/star', verifyToken, verifyAdmin, toggleStarReview);

// Update Review content (Admin)
router.put('/:id', verifyToken, verifyAdmin, updateReview);

// Delete a review by ID
router.delete('/:id', verifyToken, verifyAdmin, deleteReview);

export default router;
