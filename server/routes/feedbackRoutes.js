import express from "express";
import { createFeedback, getAllFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// Public route: allow anyone to submit feedback
router.post("/", createFeedback);

// Optional: Admin route to view all feedback
router.get("/", getAllFeedback);

export default router;
