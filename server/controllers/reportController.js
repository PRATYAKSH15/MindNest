import MoodEntry from '../models/MoodEntry.js';
import AssessmentResult from '../models/AssessmentResult.js';
import Bookmark from '../models/Bookmark.js';
import Comment from '../models/Comment.js';
import Article from '../models/Article.js';

const getWeekBounds = (offsetWeeks = 0) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) - offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
};

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const buildDailyMood = (entries, weekStart) => {
  return DAY_NAMES.map((day, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateStr = date.toDateString();
    const dayEntries = entries.filter(
      (e) => new Date(e.createdAt).toDateString() === dateStr
    );
    const lastEntry = dayEntries[dayEntries.length - 1] || null;
    return { day, date: date.toISOString(), mood: lastEntry?.mood ?? null, note: lastEntry?.note ?? null };
  });
};

const avg = (nums) => {
  const valid = nums.filter((n) => n !== null);
  return valid.length ? parseFloat((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1)) : null;
};

const calculateStreak = (entries) => {
  if (!entries.length) return 0;
  const daysSet = new Set(entries.map((e) => new Date(e.createdAt).toDateString()));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let checkDay = new Date(today);
  let streak = 0;
  if (!daysSet.has(checkDay.toDateString())) checkDay.setDate(checkDay.getDate() - 1);
  while (daysSet.has(checkDay.toDateString())) {
    streak++;
    checkDay.setDate(checkDay.getDate() - 1);
  }
  return streak;
};

const buildGeminiPrompt = ({ dailyMood, avgThis, avgLast, streak, assessments, bookmarksCount, commentsCount, articlesCount, period }) => {
  const MOOD_LABELS = { 1: 'very low', 2: 'low', 3: 'neutral', 4: 'good', 5: 'excellent' };
  const moodLines = dailyMood
    .map((d) => `${d.day}: ${d.mood !== null ? `${MOOD_LABELS[d.mood]} (${d.mood}/5)${d.note ? ` — "${d.note}"` : ''}` : 'no entry'}`)
    .join('\n');

  const change = avgThis !== null && avgLast !== null ? (avgThis - avgLast).toFixed(1) : null;
  const trendLine = change !== null ? `Change vs last week: ${change > 0 ? '+' : ''}${change}` : 'No last-week data for comparison';

  const assessmentLines = assessments.length
    ? assessments.map((a) => `${a.type === 'phq9' ? 'PHQ-9 (Depression)' : 'GAD-7 (Anxiety)'}: score ${a.score} — ${a.level}`).join('\n')
    : 'No assessments taken this week';

  return `You are a compassionate mental wellness analyst for MindNest. Generate a warm, personalized weekly mental health report in valid JSON only (no markdown, no extra text).

WEEK: ${period.start} to ${period.end}

MOOD DATA:
${moodLines}
Average mood: ${avgThis ?? 'N/A'}/5
${trendLine}
Current streak: ${streak} days

ASSESSMENTS THIS WEEK:
${assessmentLines}

ACTIVITY:
Articles bookmarked: ${bookmarksCount}
Comments made: ${commentsCount}
Articles written: ${articlesCount}

Respond with ONLY this JSON structure:
{
  "summary": "2-3 sentence warm summary of this person's week",
  "insights": ["insight about mood patterns", "insight about activity or assessments", "insight about a positive or growth area"],
  "recommendations": ["specific actionable recommendation 1", "specific actionable recommendation 2", "specific actionable recommendation 3"],
  "affirmation": "one short encouraging closing affirmation"
}`;
};

export const getWeeklyReport = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const thisWeek = getWeekBounds(0);
    const lastWeek = getWeekBounds(1);

    const dateFilter = (bounds) => ({ $gte: bounds.start, $lte: bounds.end });

    const [
      thisMoodEntries,
      lastMoodEntries,
      allMoodEntries,
      assessments,
      bookmarks,
      comments,
      articles,
    ] = await Promise.all([
      MoodEntry.find({ userId, createdAt: dateFilter(thisWeek) }).sort({ createdAt: 1 }),
      MoodEntry.find({ userId, createdAt: dateFilter(lastWeek) }),
      MoodEntry.find({ userId }).sort({ createdAt: -1 }),
      AssessmentResult.find({ userId, createdAt: dateFilter(thisWeek) }).sort({ createdAt: -1 }),
      Bookmark.find({ userId, createdAt: dateFilter(thisWeek) }),
      Comment.find({ userId, createdAt: dateFilter(thisWeek) }),
      Article.find({ authorId: userId, createdAt: dateFilter(thisWeek) }),
    ]);

    const dailyMood = buildDailyMood(thisMoodEntries, thisWeek.start);
    const avgThis = avg(dailyMood.map((d) => d.mood));
    const avgLast = avg(lastMoodEntries.map((e) => e.mood));
    const streak = calculateStreak(allMoodEntries);

    const bestDay = dailyMood.reduce((best, d) => (!best || (d.mood !== null && d.mood > best.mood) ? d : best), null);
    const worstDay = dailyMood.reduce((worst, d) => (!worst || (d.mood !== null && d.mood < worst.mood) ? d : worst), null);

    // Call Gemini for AI insights
    let aiInsights = null;
    const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();

    if (GEMINI_API_KEY) {
      try {
        const prompt = buildGeminiPrompt({
          dailyMood,
          avgThis,
          avgLast,
          streak,
          assessments,
          bookmarksCount: bookmarks.length,
          commentsCount: comments.length,
          articlesCount: articles.length,
          period: {
            start: thisWeek.start.toDateString(),
            end: thisWeek.end.toDateString(),
          },
        });

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );

        const geminiData = await geminiRes.json();

        if (!geminiRes.ok) {
          console.error('Gemini API error:', geminiRes.status, JSON.stringify(geminiData));
        } else {
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          // Try structured JSON first
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              aiInsights = JSON.parse(jsonMatch[0]);
            } catch {
              // JSON malformed — fall back to raw text as summary
              aiInsights = { summary: rawText, insights: [], recommendations: [], affirmation: '' };
            }
          } else if (rawText) {
            aiInsights = { summary: rawText, insights: [], recommendations: [], affirmation: '' };
          }
        }
      } catch (err) {
        console.error('Gemini report error:', err.message);
      }
    } else {
      console.warn('GEMINI_API_KEY not set — skipping AI insights');
    }

    res.json({
      period: {
        start: thisWeek.start.toISOString(),
        end: thisWeek.end.toISOString(),
      },
      mood: {
        daily: dailyMood,
        avgThis,
        avgLast,
        streak,
        bestDay: bestDay?.mood !== null ? bestDay : null,
        worstDay: worstDay?.mood !== null ? worstDay : null,
        totalEntries: thisMoodEntries.length,
      },
      assessments,
      activity: {
        bookmarks: bookmarks.length,
        comments: comments.length,
        articles: articles.length,
      },
      aiInsights,
    });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
