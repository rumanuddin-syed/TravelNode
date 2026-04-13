import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Can refer to either the user or the admin's user document
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    messageText: {
      type: String,
      required: false, // Could be just a file attached without text
    },
    fileUrl: {
      type: String, // Path to an attachment
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
