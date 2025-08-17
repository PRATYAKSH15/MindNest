import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], // Example: ["anxiety", "self-care"]
      default: [],
    },
    author: {
      type: String, // Display name
      default: "Anonymous",
    },
    authorId: {
      type: String, // Clerk userId
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);
export default Article;
