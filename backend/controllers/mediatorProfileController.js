// mediatorProfileController.js

import Mediator from "../models/Mediator.js";
import Booking from "../models/Booking.js";

// Get mediator profile
const getMediatorProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const mediatorProfile = await Mediator.findOne({ userId });

    if (!mediatorProfile) {
      return res.status(404).json({ message: "Mediator profile not found" });
    }

    res.status(200).json({ success: true, data: mediatorProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create mediator profile
const createMediatorProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if mediator profile already exists
    const existingProfile = await Mediator.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Mediator profile already exists" });
    }

    const newProfile = new Mediator({
      userId,
    });

    await newProfile.save();
    res.status(201).json({
      success: true,
      message: "Mediator profile created successfully",
      data: newProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update mediator profile
const updateMediatorProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      languages,
      bio,
      costPerHour,
      isAvailable,
      profilePhoto,
      phone,
      certifications,
      experience,
    } = req.body;

    const updatedProfile = await Mediator.findOneAndUpdate(
      { userId },
      {
        languages,
        bio,
        costPerHour,
        isAvailable,
        profilePhoto,
        phone,
        certifications,
        experience,
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Mediator profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Mediator profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get mediator statistics
const getMediatorStats = async (req, res) => {
  try {
    const userId = req.params.id;
    // Deep fix: Find ALL mediator profiles associated with this user ID
    // (This handles duplicate profiles created during account setup)
    const mediatorProfiles = await Mediator.find({ userId });
    if (mediatorProfiles.length === 0) {
      // Create a default if none exist
      const newProfile = new Mediator({ userId });
      await newProfile.save();
      mediatorProfiles.push(newProfile);
    }
    
    // Pick the primary profile for generic info (rating, cost, etc.)
    const mediatorProfile = mediatorProfiles[0];
    const mediatorIds = mediatorProfiles.map(m => m._id.toString());

    // Get ALL bookings for the mediator using a robust search across ALL associated profiles
    const allBookings = await Booking.find({});
    
    const bookings = allBookings.filter(b => {
      const bMedId = b.mediatorId ? b.mediatorId.toString() : null;
      // Greedy match: Check if the booking belongs to ANY profile found for this user
      return (bMedId && mediatorIds.includes(bMedId)) || (bMedId && bMedId === userId);
    });

    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const completedSessions = bookings.filter((b) => b.completed).length;

    // Calculate total earnings from bookings
    const totalEarnings = confirmedBookings.reduce((sum, booking) => {
      return sum + (booking.costPerHour * booking.hours || 0);
    }, 0);

    const totalHours = confirmedBookings.reduce((sum, booking) => {
      return sum + (booking.hours || 0);
    }, 0);

    const stats = {
      totalEarnings: totalEarnings,
      pendingBookings: pendingBookings.length,
      completedSessions: completedSessions,
      totalHours: totalHours,
      // Include profile info for completeness
      costPerHour: mediatorProfile.costPerHour || 0,
      rating: mediatorProfile.rating || 0,
      isAvailable: mediatorProfile.isAvailable !== undefined ? mediatorProfile.isAvailable : true,
    };

    // Sort recent bookings by date and calculate earnings for each
    const recentBookings = [...bookings]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(booking => {
        const bObj = booking.toObject();
        bObj.mediatorEarnings = (booking.costPerHour || 0) * (booking.hours || 0);
        return bObj;
      });

    res.status(200).json({ 
      success: true, 
      data: {
        stats,
        recentBookings
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add review to mediator
const addReview = async (req, res) => {
  try {
    const mediatorUserId = req.params.id;
    const { userId, rating, comment } = req.body;

    const mediatorProfile = await Mediator.findOne({ userId: mediatorUserId });

    if (!mediatorProfile) {
      return res.status(404).json({ message: "Mediator profile not found" });
    }

    mediatorProfile.reviews.push({
      userId,
      rating,
      comment,
    });

    // Update average rating
    const totalRating = mediatorProfile.reviews.reduce((sum, review) => sum + review.rating, 0);
    mediatorProfile.rating = totalRating / mediatorProfile.reviews.length;

    await mediatorProfile.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: mediatorProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all mediators for browsing
const getAllMediators = async (req, res) => {
  try {
    const mediators = await Mediator.find({ isAvailable: true }).populate('userId', 'username');
    res.status(200).json({ success: true, data: mediators });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update mediator earnings when booking is created
const updateMediatorEarnings = async (mediatorId, costPerHour, hours) => {
  try {
    if (!mediatorId) return;

    // Try finding by Mediator _id first (modern approach), then fallback to userId
    let mediatorProfile = await Mediator.findById(mediatorId);
    if (!mediatorProfile) {
      mediatorProfile = await Mediator.findOne({ userId: mediatorId });
    }
    
    if (!mediatorProfile) return;

    const bookingCost = costPerHour * hours;
    mediatorProfile.totalEarnings = (mediatorProfile.totalEarnings || 0) + bookingCost;
    mediatorProfile.totalBookings = (mediatorProfile.totalBookings || 0) + 1;
    
    await mediatorProfile.save();
  } catch (error) {
    console.error('Error updating mediator earnings:', error);
  }
};

// Update booking status by mediator
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status === 'completed') {
      booking.completed = true;
      booking.status = 'completed';
    } else if (status === 'confirmed' || status === 'pending' || status === 'cancelled') {
        booking.status = status;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getMediatorProfile,
  createMediatorProfile,
  updateMediatorProfile,
  getMediatorStats,
  addReview,
  getAllMediators,
  updateMediatorEarnings,
  updateBookingStatus,
};
