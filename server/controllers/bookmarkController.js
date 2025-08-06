import Bookmark from '../models/Bookmark.js';

export const toggleBookmark = async (req, res) => {
  try {
    const { articleId } = req.body;
    const userId = req.auth.userId;

    const existing = await Bookmark.findOne({ userId, articleId });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.json({ message: 'Bookmark removed' });
    }

    const bookmark = await Bookmark.create({ userId, articleId });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
};

export const getBookmarksByUser = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const bookmarks = await Bookmark.find({ userId }).populate('articleId');
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
};
