import express from 'express';
import { getWeeklyReport } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/weekly', requireAuth, getWeeklyReport);

export default router;
