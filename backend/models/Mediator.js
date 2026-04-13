import mongoose from "mongoose";

const mediatorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    costPerHour: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    completedBookings: {
      type: Number,
      default: 0,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    certifications: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
    },
    reviews: [
      {
        userId: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Mediator", mediatorSchema);
