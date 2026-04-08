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
    let mediatorProfile = await Mediator.findOne({ userId });

    // If profile doesn't exist, create a default one
    if (!mediatorProfile) {
      mediatorProfile = new Mediator({
        userId,
      });
      await mediatorProfile.save();
    }

    // Get booking details
    const bookings = await Booking.find({ mediatorId: userId });
    const completedBookings = bookings.filter((b) => b.completed);

    // Calculate total earnings from bookings
    const totalEarnings = bookings.reduce((sum, booking) => {
      return sum + (booking.costPerHour * booking.hours || 0);
    }, 0);

    const stats = {
      costPerHour: mediatorProfile.costPerHour || 0,
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      totalEarnings: totalEarnings,
      rating: mediatorProfile.rating || 0,
      isAvailable: mediatorProfile.isAvailable !== undefined ? mediatorProfile.isAvailable : true,
      bio: mediatorProfile.bio || '',
      languages: mediatorProfile.languages || [],
      phone: mediatorProfile.phone || '',
      profilePhoto: mediatorProfile.profilePhoto || '',
      experience: mediatorProfile.experience || '',
      certifications: mediatorProfile.certifications || [],
      reviews: mediatorProfile.reviews || [],
    };

    res.status(200).json({ success: true, data: stats });
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
    const mediators = await Mediator.find({ isAvailable: true });
    res.status(200).json({ success: true, data: mediators });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update mediator earnings when booking is created
const updateMediatorEarnings = async (mediatorUserId, costPerHour, hours) => {
  try {
    if (!mediatorUserId) return;

    const mediatorProfile = await Mediator.findOne({ userId: mediatorUserId });
    if (!mediatorProfile) return;

    const bookingCost = costPerHour * hours;
    mediatorProfile.totalEarnings = (mediatorProfile.totalEarnings || 0) + bookingCost;
    mediatorProfile.totalBookings = (mediatorProfile.totalBookings || 0) + 1;
    
    await mediatorProfile.save();
  } catch (error) {
    console.error('Error updating mediator earnings:', error);
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
};
