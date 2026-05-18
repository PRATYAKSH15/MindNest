import AssessmentResult from '../models/AssessmentResult.js';

export const saveAssessmentResult = async (req, res) => {
  const { type, score, level } = req.body;

  if (!type || score == null || !level) {
    return res.status(400).json({ error: 'type, score, and level are required' });
  }

  try {
    const result = await AssessmentResult.create({
      userId: req.auth.userId,
      type,
      score: Number(score),
      level,
    });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: 'Failed to save assessment result' });
  }
};
