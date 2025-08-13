import express from 'express';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles
} from '../controllers/articleController.js';

// Clerk middleware (to be added later)
// import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);

// Admin Routes (protected)
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

export default router;
