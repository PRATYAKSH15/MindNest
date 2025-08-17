import express from 'express';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles
} from '../controllers/articleController.js';

import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);

// Protected Routes
router.post('/', requireAuth, createArticle);
router.put('/:id', requireAuth, updateArticle);
router.delete('/:id', requireAuth, deleteArticle);

export default router;
