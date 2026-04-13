import express from "express";
import {
  getUserConversation,
  sendMessageUser,
  getAllConversations,
  getAdminConversation,
  sendMessageAdmin,
  updateConversationStatus,
  blockSupportUser,
} from "../controllers/supportController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import supportUpload from "../middleware/supportUploadMiddleware.js";

const router = express.Router();

/* USER ROUTES */
// Must be logged in to access customer support
router.get("/conversation", verifyToken, getUserConversation);
router.post("/message", verifyToken, supportUpload.single("attachment"), sendMessageUser);

/* ADMIN ROUTES */
router.get("/admin/conversations", verifyToken, verifyAdmin, getAllConversations);
router.get("/admin/conversation/:conversationId", verifyToken, verifyAdmin, getAdminConversation);
router.post("/admin/reply", verifyToken, verifyAdmin, supportUpload.single("attachment"), sendMessageAdmin);
router.patch("/admin/status", verifyToken, verifyAdmin, updateConversationStatus);
router.patch("/admin/block", verifyToken, verifyAdmin, blockSupportUser);

export default router;
