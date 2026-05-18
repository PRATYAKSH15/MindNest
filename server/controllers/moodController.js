import MoodEntry from '../models/MoodEntry.js';

export const getMoodEntries = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const entries = await MoodEntry.find({
      userId: req.auth.userId,
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: 1 });

    res.json(entries);
  } catch {
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
};

export const createMoodEntry = async (req, res) => {
  const { mood, note } = req.body;

  if (!mood || mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'Mood must be between 1 and 5' });
  }

  try {
    const entry = await MoodEntry.create({
      userId: req.auth.userId,
      mood: Number(mood),
      note: note || '',
    });
    res.status(201).json(entry);
  } catch {
    res.status(500).json({ error: 'Failed to save mood entry' });
  }
};

export const getMoodSuggestions = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await MoodEntry.find({
      userId: req.auth.userId,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: 1 });

    if (entries.length === 0) {
      return res.json({
        suggestion:
          'Start tracking your mood daily to receive personalized suggestions! Even a few days of data helps identify patterns.',
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.json({
        suggestion:
          'AI suggestions are not configured yet. Please add a GEMINI_API_KEY to the server environment.',
      });
    }

    const moodLabels = { 1: 'very low', 2: 'low', 3: 'neutral', 4: 'good', 5: 'excellent' };

    const moodSummary = entries
      .map((e) => {
        const day = new Date(e.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        const label = moodLabels[e.mood];
        const noteText = e.note ? ` (note: "${e.note}")` : '';
        return `${day}: ${label}${noteText}`;
      })
      .join('\n');

    const avgMood = (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1);

    const prompt = `You are a compassionate mental wellness coach. A user shared their mood tracking data from the past week. Based on this data, provide exactly 3 specific, actionable, and gentle wellness suggestions. Be warm, encouraging, and non-clinical.

Mood data (1=very low, 5=excellent):
${moodSummary}
Average mood this week: ${avgMood}/5

Respond with exactly 3 suggestions. Start each one with a relevant emoji followed by a bold title, then 1-2 sentences of advice. Do not diagnose or replace professional help.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const suggestion =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Unable to generate suggestions at this time. Please try again later.';

    res.json({ suggestion });
  } catch (err) {
    console.error('Gemini suggestion error:', err.message);
    res.status(500).json({ error: 'Failed to get AI suggestions' });
  }
};
