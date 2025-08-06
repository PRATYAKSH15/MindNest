import Article from '../models/Article.js';

// Create article (admin only)
export const createArticle = async (req, res) => {
  try {
    const { title, content, tags, author } = req.body;
    const article = await Article.create({ title, content, tags, author });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create article' });
  }
};

// Get all articles (public)
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get articles by tag or search query
export const searchArticles = async (req, res) => {
  try {
    const { tag, q } = req.query;

    const query = {};
    if (tag) query.tags = tag;
    if (q) query.title = { $regex: q, $options: 'i' };

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search articles' });
  }
};

// Get single article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Update article (admin only)
export const updateArticle = async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// Delete article (admin only)
export const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};
