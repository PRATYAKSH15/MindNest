import express from 'express';
import { toggleBookmark, getBookmarksByUser } from '../controllers/bookmarkController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/toggle', requireAuth, toggleBookmark);
router.get('/', requireAuth, getBookmarksByUser);

export default router;
 