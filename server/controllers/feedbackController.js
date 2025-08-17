import Feedback from "../models/Feedback.js";

// Create new feedback
export const createFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const feedback = await Feedback.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

// Get all feedback (optional: admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};
