import express from "express";
import { subscribe, unsubscribe, getStatus, toggleSubscription } from "../controllers/subscriberController.js";

const router = express.Router();

router.post("/", subscribe);
router.post("/toggle", toggleSubscription);
router.get("/status/:email", getStatus);
router.get("/unsubscribe/:email", unsubscribe);

export default router;
