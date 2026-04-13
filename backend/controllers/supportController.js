import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/* =======================================================
                        USER APIs 
   ======================================================= */

// Get or Create user's single support thread
export const getUserConversation = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Ensure conversation exists
    let conversation = await Conversation.findOne({ userId });
    
    if (!conversation) {
      conversation = new Conversation({ userId, status: "open" });
      await conversation.save();
    }

    // Fetch messages (oldest to newest)
    const messages = await Message.find({ conversationId: conversation._id })
                                  .sort({ createdAt: 1 })
                                  .populate("senderId", "username photo role");

    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages,
        userStatus: user.status // return so frontend blocks if "blocked"
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error fetching conversation" });
  }
};

// Send a message (User side)
export const sendMessageUser = async (req, res) => {
  try {
    const userId = req.id;
    const { messageText } = req.body;
    let fileUrl = null;

    // Check if user is blocked
    const user = await User.findById(userId);
    if (!user || user.status === "blocked") {
      return res.status(403).json({ success: false, message: "You are blocked from contacting support.", blocked: true });
    }

    if (req.file) {
      fileUrl = `/public/uploads/support/${req.file.filename}`;
    }

    if (!messageText && !fileUrl) {
      return res.status(400).json({ success: false, message: "Message cannot be completely empty." });
    }

    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, status: "open" });
      await conversation.save();
    }

    // You can't reply to a closed ticket
    if (conversation.status === "closed") {
      return res.status(400).json({ success: false, message: "Ticket is closed. Please ask an admin to reopen." });
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: userId,
      senderRole: "user",
      messageText: messageText || "",
      fileUrl
    });

    await newMessage.save();

    res.status(201).json({ success: true, data: newMessage });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};


/* =======================================================
                        ADMIN APIs 
   ======================================================= */

// Get all conversations with latest message overview
export const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate("userId", "username email photo status")
      .sort({ updatedAt: -1 });

    // Could aggregate latest message per converstaion but mapping is simpler for now
    const structuredData = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversationId: conv._id })
                                     .sort({ createdAt: -1 });
        return {
          _id: conv._id,
          user: conv.userId, // includes status etc
          status: conv.status,
          updatedAt: conv.updatedAt,
          lastMessage: lastMsg ? (lastMsg.messageText || "Attachment") : "No messages yet",
        };
      })
    );

    res.status(200).json({ success: true, data: structuredData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load conversations" });
  }
};

// Get specific conversation messages
export const getAdminConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId).populate("userId", "username email photo status");
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });

    const messages = await Message.find({ conversationId })
                                  .sort({ createdAt: 1 })
                                  .populate("senderId", "username photo role");

    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch conversation" });
  }
};

// Admin replies to a conversation
export const sendMessageAdmin = async (req, res) => {
  try {
    const adminId = req.id;
    const { conversationId, messageText } = req.body;
    let fileUrl = null;

    if (req.file) {
      fileUrl = `/public/uploads/support/${req.file.filename}`;
    }

    if (!messageText && !fileUrl) {
      return res.status(400).json({ success: false, message: "Message cannot be empty." });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: "Thread not found" });

    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: adminId,
      senderRole: "admin",
      messageText: messageText || "",
      fileUrl
    });
    await newMessage.save();

    // Update conversation timestamp implicitly
    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(201).json({ success: true, data: newMessage });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send reply" });
  }
};

// Admin toggles Conversation Status (Open <-> Closed)
export const updateConversationStatus = async (req, res) => {
  try {
    const { conversationId, status } = req.body;

    const conv = await Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ success: false, message: "Conversation not found" });

    conv.status = status;
    await conv.save();

    res.status(200).json({ success: true, data: conv, message: `Ticket marked as ${status}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// Admin blocks / unblocks user entirely
export const blockSupportUser = async (req, res) => {
  try {
    const { targetUserId, blockStatus } = req.body; // "active" or "blocked"

    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ success: false, message: "User not found" });
    
    // Safety check - cant block admins
    if (target.role === "admin") return res.status(403).json({ success: false, message: "Cannot block other admins" });

    target.status = blockStatus;
    await target.save();

    res.status(200).json({ success: true, message: `User is now ${blockStatus}`, status: target.status });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update block status" });
  }
};
