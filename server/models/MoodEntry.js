import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    mood: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
export default MoodEntry;
