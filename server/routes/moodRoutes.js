import express from 'express';
import {
  getMoodEntries,
  createMoodEntry,
  getMoodSuggestions,
} from '../controllers/moodController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/suggest', requireAuth, getMoodSuggestions);
router.get('/', requireAuth, getMoodEntries);
router.post('/', requireAuth, createMoodEntry);

export default router;
