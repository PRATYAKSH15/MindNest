import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useApi } from "../providers/ApiProvider.jsx";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Loader2, Download, RefreshCw, TrendingUp, TrendingDown,
  Minus, Flame, Bookmark, MessageSquare, FileText, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MOOD_EMOJI  = { 1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😊" };
const MOOD_LABEL  = { 1: "Very Low", 2: "Low", 3: "Okay", 4: "Good", 5: "Great" };
const MOOD_COLOR  = { 1: "#f87171", 2: "#fb923c", 3: "#facc15", 4: "#60a5fa", 5: "#4ade80" };
const LEVEL_COLOR = {
  Minimal: "bg-green-100 text-green-700",
  Mild: "bg-yellow-100 text-yellow-700",
  Moderate: "bg-orange-100 text-orange-700",
  "Moderately Severe": "bg-red-100 text-red-700",
  Severe: "bg-red-200 text-red-800",
};

// ─────────────────────────────────────────────
// SVG Mood Trend Chart
// ─────────────────────────────────────────────
function MoodChart({ daily }) {
  const W = 560, H = 120, PAD = 28;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;

  const xPos = (i) => PAD + (i / 6) * innerW;
  const yPos = (mood) => PAD + innerH - ((mood - 1) / 4) * innerH;

  const points = daily
    .map((d, i) => (d.mood !== null ? { x: xPos(i), y: yPos(d.mood), d } : null))
    .filter(Boolean);

  // Smooth bezier path
  const linePath = points.length > 1
    ? points.map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1];
        const cpx = (prev.x + p.x) / 2;
        return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
      }).join(" ")
    : "";

  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${H - PAD + 8} L ${points[0].x} ${H - PAD + 8} Z`
    : "";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Mood trend chart">
      <defs>
        <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[1, 2, 3, 4, 5].map((m) => (
        <line
          key={m}
          x1={PAD} y1={yPos(m)} x2={W - PAD} y2={yPos(m)}
          stroke="#e5e7eb" strokeWidth="1"
        />
      ))}

      {/* Day labels */}
      {daily.map((d, i) => (
        <text key={d.day} x={xPos(i)} y={H - 4} textAnchor="middle"
          fontSize="10" fill="#9ca3af">
          {d.day}
        </text>
      ))}

      {/* Area fill */}
      {areaPath && <path d={areaPath} fill="url(#moodGrad)" />}

      {/* Line */}
      {linePath && (
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* No-entry markers */}
      {daily.map((d, i) =>
        d.mood === null ? (
          <text key={d.day + "-empty"} x={xPos(i)} y={H / 2}
            textAnchor="middle" fontSize="14" fill="#d1d5db">·</text>
        ) : null
      )}

      {/* Dots */}
      {points.map((p) => (
        <g key={p.d.day}>
          <circle cx={p.x} cy={p.y} r="5" fill={MOOD_COLOR[p.d.mood]}
            stroke="white" strokeWidth="2" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="13">
            {MOOD_EMOJI[p.d.mood]}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`flex flex-col gap-1 p-4 rounded-2xl border ${color}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold opacity-70 uppercase tracking-wide">
        {icon}{label}
      </div>
      <div className="text-2xl font-extrabold">{value ?? "—"}</div>
      {sub && <div className="text-xs opacity-60">{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function WeeklyReportPage() {
  const { isSignedIn, user } = useUser();
  const api = useApi();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setReport(null);
    try {
      const res = await api.get("/api/report/weekly");
      setReport(res.data);
    } catch {
      toast.error("Failed to generate report. Try again.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Weekly Report</h1>
        <p className="text-gray-500 mb-6">Sign in to generate your personalized AI-powered weekly mental health report.</p>
        <SignInButton mode="modal"><Button size="lg">Sign In</Button></SignInButton>
      </div>
    );
  }

  const displayName = user?.firstName || user?.fullName || "there";

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Controls — hidden on print */}
      <div className="print:hidden flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Weekly Report</h1>
          <p className="text-gray-400 text-sm mt-0.5">AI-powered mental health summary, generated by Gemini</p>
        </div>
        <div className="flex gap-2">
          {report && (
            <Button variant="outline" onClick={() => window.print()}
              className="flex items-center gap-2">
              <Download size={16} /> Save as PDF
            </Button>
          )}
          <Button onClick={fetchReport} disabled={loading}
            className="flex items-center gap-2">
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Generating...</>
              : <><RefreshCw size={16} /> {report ? "Regenerate" : "Generate Report"}</>}
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!report && !loading && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="font-semibold text-gray-600 mb-1">Your report is ready to generate</p>
          <p className="text-sm mb-6">We'll analyse your mood, assessments, and activity for this week.</p>
          <Button onClick={fetchReport} size="lg" className="flex items-center gap-2 mx-auto">
            <Sparkles size={18} /> Generate My Report
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-24 text-gray-400 gap-4">
          <Loader2 size={36} className="animate-spin text-blue-500" />
          <p className="text-sm">Analysing your week and crafting insights with Gemini...</p>
        </div>
      )}

      {/* Report */}
      {report && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden print:shadow-none print:border-gray-300"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">🧠 MindNest · Weekly Report</p>
                <h2 className="text-2xl font-extrabold">Hi {displayName} 👋</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {new Date(report.period.start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  {" – "}
                  {new Date(report.period.end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-right text-blue-100 text-sm">
                <p>Generated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Mood Trend */}
            <section>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                Mood This Week
              </h3>
              <MoodChart daily={report.mood.daily} />

              {/* Mood stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <StatCard
                  icon={<span className="text-base">{report.mood.avgThis ? MOOD_EMOJI[Math.round(report.mood.avgThis)] : "—"}</span>}
                  label="Avg Mood"
                  value={report.mood.avgThis ? `${report.mood.avgThis}/5` : "No data"}
                  sub={report.mood.avgThis ? MOOD_LABEL[Math.round(report.mood.avgThis)] : null}
                  color="bg-blue-50 border-blue-200 text-blue-900"
                />
                <StatCard
                  icon={<Flame size={14} />}
                  label="Streak"
                  value={`${report.mood.streak}d`}
                  sub="consecutive days"
                  color="bg-orange-50 border-orange-200 text-orange-900"
                />
                <StatCard
                  icon={
                    report.mood.avgThis && report.mood.avgLast
                      ? report.mood.avgThis >= report.mood.avgLast
                        ? <TrendingUp size={14} className="text-green-600" />
                        : <TrendingDown size={14} className="text-red-500" />
                      : <Minus size={14} />
                  }
                  label="vs Last Week"
                  value={
                    report.mood.avgThis && report.mood.avgLast
                      ? `${report.mood.avgThis >= report.mood.avgLast ? "+" : ""}${(report.mood.avgThis - report.mood.avgLast).toFixed(1)}`
                      : "N/A"
                  }
                  sub={report.mood.avgLast ? `Last week: ${report.mood.avgLast}/5` : "No prior data"}
                  color="bg-gray-50 border-gray-200 text-gray-900"
                />
                <StatCard
                  icon={<span className="text-base">{report.mood.bestDay ? MOOD_EMOJI[report.mood.bestDay.mood] : "—"}</span>}
                  label="Best Day"
                  value={report.mood.bestDay?.day ?? "—"}
                  sub={report.mood.bestDay ? `${MOOD_LABEL[report.mood.bestDay.mood]} (${report.mood.bestDay.mood}/5)` : null}
                  color="bg-green-50 border-green-200 text-green-900"
                />
              </div>

              {report.mood.totalEntries === 0 && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-3">
                  No mood entries this week.{" "}
                  <Link to="/mood" className="underline font-semibold">Start tracking</Link> to see your trend here.
                </p>
              )}
            </section>

            {/* Assessments + Activity */}
            <section className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Assessments This Week
                </h3>
                {report.assessments.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No assessments taken this week.{" "}
                    <Link to="/assessment" className="text-blue-600 underline">Take one</Link>.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {report.assessments.map((a) => (
                      <div key={a._id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {a.type === "phq9" ? "PHQ-9 — Depression" : "GAD-7 — Anxiety"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-extrabold text-gray-900">{a.score}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${LEVEL_COLOR[a.level] || "bg-gray-100 text-gray-700"}`}>
                            {a.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Activity This Week
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: <Bookmark size={15} className="text-purple-500" />, label: "Articles Bookmarked", value: report.activity.bookmarks, color: "bg-purple-50 border-purple-200" },
                    { icon: <MessageSquare size={15} className="text-green-500" />, label: "Comments Made", value: report.activity.comments, color: "bg-green-50 border-green-200" },
                    { icon: <FileText size={15} className="text-blue-500" />, label: "Articles Written", value: report.activity.articles, color: "bg-blue-50 border-blue-200" },
                  ].map(({ icon, label, value, color }) => (
                    <div key={label} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${color}`}>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        {icon}{label}
                      </div>
                      <span className="text-xl font-extrabold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* AI Insights */}
            <section className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                <Sparkles size={14} /> AI Insights
                <span className="text-[10px] font-normal text-purple-400 normal-case">Powered by Gemini</span>
              </h3>

              {!report.aiInsights ? (
                <p className="text-sm text-gray-500 italic mt-2">
                  AI insights unavailable — add a{" "}
                  <code className="bg-gray-100 px-1 rounded">GEMINI_API_KEY</code> to enable them.
                </p>
              ) : (
                <div className="space-y-5 mt-3">
                  {/* Summary */}
                  <p className="text-gray-800 text-sm leading-relaxed">{report.aiInsights.summary}</p>

                  {/* Insights */}
                  {report.aiInsights.insights?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Patterns Observed</p>
                      <ul className="space-y-1.5">
                        {report.aiInsights.insights.map((ins, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="text-blue-400 font-bold flex-shrink-0">→</span>
                            {ins}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {report.aiInsights.recommendations?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">This Week, Try</p>
                      <ul className="space-y-1.5">
                        {report.aiInsights.recommendations.map((rec, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Affirmation */}
                  {report.aiInsights.affirmation && (
                    <div className="border-t border-purple-200 pt-4">
                      <p className="text-sm font-medium text-purple-700 italic text-center">
                        "{report.aiInsights.affirmation}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 print:block">
              This report is generated for personal reflection only. It is not a clinical assessment.
              If you're struggling, please speak to a mental health professional.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
