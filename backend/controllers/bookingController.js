// bookingController.js

import Booking from "../models/Booking.js";
import { updateMediatorEarnings } from "./mediatorProfileController.js";

const createBooking = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      date,
      totalPrice,
      tourName,
      maxGroupSize,
      mediatorId,
      costPerHour,
      hours,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !fullName ||
      !phone ||
      !date ||
      !totalPrice ||
      !maxGroupSize ||
      !tourName
    ) {
      return res
        .status(400)
        .json({ message: "All booking details are required" });
    }

    // Create a new booking
    const newBooking = new Booking({
      userId,
      fullName,
      phone,
      date,
      totalPrice,
      tourName,
      maxGroupSize,
      mediatorId: mediatorId || null,
      costPerHour: costPerHour || 0,
      hours: hours || 0,
    });
    await newBooking.save();

    // Update mediator earnings if mediator is assigned
    if (mediatorId && costPerHour && hours) {
      await updateMediatorEarnings(mediatorId, costPerHour, hours);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific booking by ID
const getBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.find({ userId: bookingId }).sort({
      timestamps: 1,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      updatedAt: -1,
    });
    res
      .status(200)
      .json({ success: true, data: bookings, count: bookings.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a booking by ID
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createBooking, getBooking, getAllBookings, deleteBooking };
