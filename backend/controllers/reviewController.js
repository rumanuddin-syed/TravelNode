import Review from '../models/Review.js';
import Tour from '../models/Tour.js'

const createReview = async (req, res) => {
  try {
    const { username, rating, reviewText } = req.body;
    const tourId = req.params.tourId;

    // Validate required fields
    if (!tourId || !rating) {
      return res.status(400).json({ message: 'Tour ID and rating are required' });
    }

    // Find the corresponding tour
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Create a new review (fix schema mapping to productId)
    const newReview = new Review({ 
      productId: tourId, 
      reviewText, 
      rating, 
      username 
    });
    
    await newReview.save();

    // Update the tour with the new review
    tour.reviews.push(newReview._id);
    await tour.save();

    res.status(201).json({ success: true, message: 'Review created successfully', newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all reviews (with optional starred filter)
const getAllReviews = async (req, res) => {
  try {
    const isStarred = req.query.starred === 'true';
    
    // Build query
    const query = isStarred ? { isStarred: true } : {};
    
    const reviews = await Review.find(query)
      .populate('productId', 'title city')
      .populate('tourId', 'title city') // Legacy support
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      message: 'Successful',
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a review (Admin action)
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { username, rating, reviewText, isStarred } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          username,
          rating,
          reviewText,
          isStarred
        }
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Toggle star status on a review
const toggleStarReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!reviewId) {
      return res.status(400).json({ message: 'Review ID is required' });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isStarred = !review.isStarred;
    const updatedReview = await review.save();

    res.status(200).json({ 
      success: true, 
      message: review.isStarred ? 'Review starred' : 'Review unstarred',
      data: updatedReview
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Validate review ID
    if (!reviewId) {
      return res.status(400).json({ message: 'Review ID is required' });
    }

    // Find and delete the review
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Also remove reference from Tour if we want to be fully clean, but ok for now.

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { createReview, getAllReviews, updateReview, toggleStarReview, deleteReview };
