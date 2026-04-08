// mediatorController.js

import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Get all bookings assigned to a mediator
const getMediatorBookings = async (req, res) => {
  try {
    const mediatorId = req.params.id;
    const bookings = await Booking.find({ mediatorId }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update cost per hour for a booking
const updateBookingCost = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { costPerHour, hours } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { costPerHour, hours },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Assign mediator to booking (admin function)
const assignMediator = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { mediatorId } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { mediatorId },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all mediators
const getAllMediators = async (req, res) => {
  try {
    const mediators = await User.find({ role: "mediator" });
    res.status(200).json({ success: true, data: mediators });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getMediatorBookings, updateBookingCost, assignMediator, getAllMediators };