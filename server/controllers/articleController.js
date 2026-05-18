import Article from '../models/Article.js';

const parseTags = (raw) => {
  if (Array.isArray(raw)) return raw.map((t) => t.trim()).filter(Boolean);
  if (typeof raw === 'string') return raw.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

const bufferToDataUrl = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

// Create article (any logged-in user)
export const createArticle = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { userId, email } = req.auth;

    const article = await Article.create({
      title,
      content,
      tags: parseTags(tags),
      author: email,
      authorId: userId,
      imageUrl: req.file ? bufferToDataUrl(req.file) : '',
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create article' });
  }
};

// Get all articles (public or user-specific)
export const getAllArticles = async (req, res) => {
  try {
    const { authorId } = req.query;
    const filter = authorId ? { authorId } : {};
    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Search articles by tag or query
export const searchArticles = async (req, res) => {
  try {
    const { tag, q } = req.query;
    const query = {};
    if (tag) query.tags = tag;
    if (q) query.title = { $regex: q, $options: 'i' };
    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Failed to search articles' });
  }
};

// Get single article
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Update article (only owner)
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (article.authorId !== req.auth.userId) {
      return res.status(403).json({ error: 'Not authorized to update this article' });
    }

    const { title, content, tags, author, removeImage } = req.body;

    let imageUrl = article.imageUrl; // keep existing by default
    if (req.file) {
      imageUrl = bufferToDataUrl(req.file);
    } else if (removeImage === 'true') {
      imageUrl = '';
    }

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        author,
        tags: parseTags(tags),
        imageUrl,
      },
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// Delete article (only owner)
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (article.authorId !== req.auth.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this article' });
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};
