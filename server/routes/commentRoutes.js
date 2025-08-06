import express from 'express';
import { addComment, getCommentsByArticle } from '../controllers/commentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:articleId', getCommentsByArticle);
router.post('/', requireAuth, addComment);

export default router;
