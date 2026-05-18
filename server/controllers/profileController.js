import Article from '../models/Article.js';
import Bookmark from '../models/Bookmark.js';
import Comment from '../models/Comment.js';
import MoodEntry from '../models/MoodEntry.js';

const calculateMoodStreak = (entries) => {
  if (!entries.length) return 0;

  const daysWithEntries = new Set(
    entries.map((e) => new Date(e.createdAt).toDateString())
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDay = new Date(today);
  let streak = 0;

  // If no entry today, start streak check from yesterday
  if (!daysWithEntries.has(checkDay.toDateString())) {
    checkDay.setDate(checkDay.getDate() - 1);
  }

  while (daysWithEntries.has(checkDay.toDateString())) {
    streak++;
    checkDay.setDate(checkDay.getDate() - 1);
  }

  return streak;
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const [articles, bookmarks, comments, moodEntries] = await Promise.all([
      Article.find({ authorId: userId }).sort({ createdAt: -1 }),
      Bookmark.find({ userId }).populate('articleId').sort({ createdAt: -1 }),
      Comment.find({ userId })
        .populate('articleId', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
      MoodEntry.find({ userId }).sort({ createdAt: -1 }),
    ]);

    res.json({
      stats: {
        articlesCount: articles.length,
        bookmarksCount: bookmarks.length,
        commentsCount: comments.length,
        moodStreak: calculateMoodStreak(moodEntries),
      },
      recentArticles: articles.slice(0, 6),
      bookmarks: bookmarks.slice(0, 9),
      recentComments: comments,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
