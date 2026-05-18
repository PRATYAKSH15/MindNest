import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['phq9', 'gad7'], required: true },
    score: { type: Number, required: true },
    level: { type: String, required: true },
  },
  { timestamps: true }
);

const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);
export default AssessmentResult;
