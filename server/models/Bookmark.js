import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    userId: {
      type: String, // Clerk user ID
      required: true,
    },
  },
  { timestamps: true }
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
