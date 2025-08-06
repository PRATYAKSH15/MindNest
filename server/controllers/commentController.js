import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  try {
    const { articleId, content } = req.body;
    const userId = req.auth.userId;

    const comment = await Comment.create({ articleId, userId, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const getCommentsByArticle = async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
