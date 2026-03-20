import express from 'express';
import { generatePlan } from '../controllers/tripPlannerController.js';

const router = express.Router();

router.post('/plan-trip', generatePlan);

export default router;