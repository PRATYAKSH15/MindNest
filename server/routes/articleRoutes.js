import express from 'express';
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
} from '../controllers/articleController.js';
import { requireAuth } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);

// Protected routes — upload.single('image') parses multipart/form-data
router.post('/', requireAuth, upload.single('image'), createArticle);
router.put('/:id', requireAuth, upload.single('image'), updateArticle);
router.delete('/:id', requireAuth, deleteArticle);

export default router;
