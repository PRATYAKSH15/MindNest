import express from 'express';
import { saveAssessmentResult } from '../controllers/assessmentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, saveAssessmentResult);

export default router;
