// mediatorController.js

import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Mediator from "../models/Mediator.js";

// Get all mediator profiles (populated with user info) — admin
const getAllMediators = async (req, res) => {
  try {
    const mediators = await Mediator.find()
      .populate("userId", "username email photo role")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: mediators });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all users with role = 'mediator' (for promoting / reference)
const getMediatorUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "mediator" }).select("username email photo role createdAt");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single mediator by Mediator _id (populated)
const getMediatorById = async (req, res) => {
  try {
    const mediator = await Mediator.findById(req.params.id).populate("userId", "username email photo role");
    if (!mediator) return res.status(404).json({ message: "Mediator not found" });
    res.status(200).json({ success: true, data: mediator });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: promote a user to mediator role and create Mediator profile
const promoteToMediator = async (req, res) => {
  try {
    const { userId, languages, bio, costPerHour, phone, experience } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Promote role
    user.role = "mediator";
    await user.save();

    // Create profile if not exists
    let profile = await Mediator.findOne({ userId });
    if (!profile) {
      profile = new Mediator({ userId, languages: languages || [], bio: bio || "", costPerHour: costPerHour || 0, phone: phone || "", experience: experience || "" });
      await profile.save();
    }

    const populated = await Mediator.findById(profile._id).populate("userId", "username email photo role");
    res.status(201).json({ success: true, message: "User promoted to mediator", data: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: update mediator profile details
const adminUpdateMediator = async (req, res) => {
  try {
    const mediatorId = req.params.id; // Mediator _id
    const { languages, bio, costPerHour, isAvailable, phone, certifications, experience } = req.body;

    const updated = await Mediator.findByIdAndUpdate(
      mediatorId,
      { languages, bio, costPerHour, isAvailable, phone, certifications, experience },
      { new: true }
    ).populate("userId", "username email photo role");

    if (!updated) return res.status(404).json({ message: "Mediator not found" });

    res.status(200).json({ success: true, message: "Mediator updated", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: demote mediator back to user (and optionally keep profile)
const demoteMediator = async (req, res) => {
  try {
    const mediatorId = req.params.id; // Mediator _id
    const profile = await Mediator.findById(mediatorId);
    if (!profile) return res.status(404).json({ message: "Mediator not found" });

    // Update availability to false
    profile.isAvailable = false;
    await profile.save();

    // Demote user role
    await User.findByIdAndUpdate(profile.userId, { role: "user" });

    res.status(200).json({ success: true, message: "Mediator demoted to user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: toggle mediator availability
const toggleMediatorAvailability = async (req, res) => {
  try {
    const mediatorId = req.params.id;
    const mediator = await Mediator.findById(mediatorId).populate("userId", "username email");
    if (!mediator) return res.status(404).json({ message: "Mediator not found" });

    mediator.isAvailable = !mediator.isAvailable;
    await mediator.save();

    res.status(200).json({ success: true, data: mediator, message: `Mediator is now ${mediator.isAvailable ? "available" : "unavailable"}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all bookings assigned to a mediator
const getMediatorBookings = async (req, res) => {
  try {
    const mediatorId = req.params.id;
    const bookings = await Booking.find({ mediatorId, status: "confirmed" }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: update cost per hour and hours for a booking
const updateBookingCost = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { costPerHour, hours } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { costPerHour, hours },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: assign mediator to booking (using Mediator _id)
const assignMediator = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { mediatorId } = req.body; // expects Mediator._id
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { mediatorId: mediatorId || null },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: unassign mediator from booking
const unassignMediator = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { mediatorId: null, costPerHour: 0, hours: 0 },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ success: true, data: updatedBooking, message: "Mediator unassigned" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: get all non-mediator users (for promotion)
const getAllNonMediatorUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("username email photo role createdAt");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
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
};