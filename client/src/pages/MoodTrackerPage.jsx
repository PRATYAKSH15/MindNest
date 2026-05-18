import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApi } from "../providers/ApiProvider.jsx";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MOOD_EMOJIS = { 1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😊" };
const MOOD_LABELS = { 1: "Very Low", 2: "Low", 3: "Okay", 4: "Good", 5: "Great" };
const MOOD_BAR_COLORS = {
  1: "bg-red-400",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-blue-400",
  5: "bg-green-400",
};
const MOOD_RING_COLORS = {
  1: "ring-red-300 bg-red-50",
  2: "ring-orange-300 bg-orange-50",
  3: "ring-yellow-300 bg-yellow-50",
  4: "ring-blue-300 bg-blue-50",
  5: "ring-green-300 bg-green-50",
};

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

function getEntryForDay(entries, date) {
  const dateStr = date.toDateString();
  const dayEntries = entries.filter(
    (e) => new Date(e.createdAt).toDateString() === dateStr
  );
  return dayEntries[dayEntries.length - 1] || null;
}

export default function MoodTrackerPage() {
  const { isSignedIn } = useUser();
  const api = useApi();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const last7Days = getLast7Days();
  const todayEntry = getEntryForDay(entries, last7Days[6]);

  const fetchEntries = useCallback(async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const res = await api.get("/api/mood");
      setEntries(res.data);
    } catch {
      toast.error("Failed to load mood history");
    } finally {
      setLoading(false);
    }
  }, [api, isSignedIn]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleCheckIn = async () => {
    if (!selectedMood) return;
    setSubmitting(true);
    try {
      await api.post("/api/mood", { mood: selectedMood, note });
      toast.success("Mood logged!");
      setSelectedMood(null);
      setNote("");
      setSuggestion(null);
      await fetchEntries();
    } catch {
      toast.error("Failed to save mood");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestion(true);
    setSuggestion(null);
    try {
      const res = await api.get("/api/mood/suggest");
      setSuggestion(res.data.suggestion);
    } catch {
      toast.error("Failed to get AI suggestions");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="text-6xl mb-4">🧘</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mood Tracker</h1>
        <p className="text-gray-500 mb-6">
          Sign in to track your daily mood and receive AI-powered wellness
          suggestions.
        </p>
        <SignInButton mode="modal">
          <Button size="lg">Sign In to Start Tracking</Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Mood Tracker
        </h1>
        <p className="text-gray-500 mb-8">
          Check in daily to track your emotional well-being and get personalized
          suggestions.
        </p>

        {/* Weekly Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
            This Week
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : (
            <div className="flex justify-between items-end gap-2">
              {last7Days.map((day) => {
                const entry = getEntryForDay(entries, day);
                const isToday = day.toDateString() === new Date().toDateString();
                const barHeightPct = entry ? `${(entry.mood / 5) * 100}%` : "0%";

                return (
                  <div
                    key={day.toISOString()}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <span className="text-lg min-h-[28px] flex items-center">
                      {entry ? MOOD_EMOJIS[entry.mood] : "·"}
                    </span>
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex flex-col justify-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: barHeightPct }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`w-full rounded-lg ${
                          entry ? MOOD_BAR_COLORS[entry.mood] : ""
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        isToday ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    {isToday && (
                      <span className="text-[10px] text-blue-500 font-bold">
                        Today
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Check-In Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-1">
            {todayEntry ? "Update Today's Mood" : "How are you feeling today?"}
          </h2>
          {todayEntry && (
            <p className="text-sm text-gray-400 mb-4">
              Last logged: {MOOD_EMOJIS[todayEntry.mood]} {MOOD_LABELS[todayEntry.mood]}
            </p>
          )}
          {!todayEntry && <div className="mb-4" />}

          {/* Mood selector */}
          <div className="flex justify-between gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMood(m)}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl border-2 transition-all ${
                  selectedMood === m
                    ? `ring-2 ${MOOD_RING_COLORS[m]} border-transparent`
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-2xl">{MOOD_EMOJIS[m]}</span>
                <span className="text-[10px] text-gray-500 mt-1 font-medium">
                  {MOOD_LABELS[m]}
                </span>
              </button>
            ))}
          </div>

          {/* Note */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional) — what's on your mind?"
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
          />

          <Button
            onClick={handleCheckIn}
            disabled={!selectedMood || submitting}
            className="w-full"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Saving...
              </span>
            ) : (
              "Log My Mood"
            )}
          </Button>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-500" />
                AI Wellness Suggestions
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Powered by Gemini · Based on your recent mood
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetSuggestions}
              disabled={loadingSuggestion || entries.length === 0}
              className="border-purple-300 hover:bg-purple-50 text-purple-700"
            >
              {loadingSuggestion ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Get Suggestions"
              )}
            </Button>
          </div>

          {entries.length === 0 && !loadingSuggestion && (
            <p className="text-sm text-gray-400 italic">
              Log your mood for a few days to unlock AI-powered wellness tips.
            </p>
          )}

          {loadingSuggestion && (
            <div className="flex items-center gap-2 text-purple-600 text-sm py-2">
              <Loader2 size={16} className="animate-spin" />
              Analyzing your mood patterns...
            </div>
          )}

          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mt-2"
            >
              {suggestion}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
