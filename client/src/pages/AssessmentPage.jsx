import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, BookOpen, Brain } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useApi } from "../providers/ApiProvider.jsx";

const PHQ9 = {
  id: "phq9",
  name: "PHQ-9",
  title: "Depression Screening",
  icon: "😔",
  description:
    "The Patient Health Questionnaire-9 screens for depression symptoms over the past 2 weeks. It takes about 2 minutes.",
  questions: [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading or watching television",
    "Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless",
    "Thoughts that you would be better off dead, or of hurting yourself in some way",
  ],
  getResult: (score) => {
    if (score <= 4)
      return {
        level: "Minimal",
        color: "green",
        message:
          "Your results suggest minimal depression symptoms. Continue maintaining healthy habits like regular sleep, exercise, and social connection.",
      };
    if (score <= 9)
      return {
        level: "Mild",
        color: "yellow",
        message:
          "You may be experiencing mild depression symptoms. Consider talking to someone you trust, or try journaling and light physical activity.",
      };
    if (score <= 14)
      return {
        level: "Moderate",
        color: "orange",
        message:
          "Moderate depression symptoms detected. Speaking with a mental health professional is recommended to explore supportive therapies.",
      };
    if (score <= 19)
      return {
        level: "Moderately Severe",
        color: "red",
        message:
          "These results suggest moderately severe depression. Please reach out to a mental health professional or a trusted person in your life.",
      };
    return {
      level: "Severe",
      color: "red",
      message:
        "Severe depression symptoms detected. Please seek professional help as soon as possible. You don't have to face this alone.",
    };
  },
};

const GAD7 = {
  id: "gad7",
  name: "GAD-7",
  title: "Anxiety Screening",
  icon: "😰",
  description:
    "The Generalized Anxiety Disorder-7 measures anxiety symptoms over the past 2 weeks. It takes about 2 minutes.",
  questions: [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ],
  getResult: (score) => {
    if (score <= 4)
      return {
        level: "Minimal",
        color: "green",
        message:
          "Your results suggest minimal anxiety. Keep up your self-care practices and healthy coping habits.",
      };
    if (score <= 9)
      return {
        level: "Mild",
        color: "yellow",
        message:
          "You may be experiencing mild anxiety. Relaxation techniques such as deep breathing or mindfulness can be very helpful.",
      };
    if (score <= 14)
      return {
        level: "Moderate",
        color: "orange",
        message:
          "Moderate anxiety symptoms detected. Consider speaking with a mental health professional who can offer structured support.",
      };
    return {
      level: "Severe",
      color: "red",
      message:
        "Severe anxiety symptoms detected. Please reach out to a mental health professional soon. Effective treatments are available.",
    };
  },
};

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const RESULT_STYLES = {
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    badge: "bg-green-100 text-green-700",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    badge: "bg-yellow-100 text-yellow-700",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-800",
    badge: "bg-orange-100 text-orange-700",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    badge: "bg-red-100 text-red-700",
  },
};

export default function AssessmentPage() {
  const { isSignedIn } = useUser();
  const api = useApi();

  const [quiz, setQuiz] = useState(null);
  const [step, setStep] = useState("select");
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);

  const startQuiz = (q) => {
    setQuiz(q);
    setAnswers(new Array(q.questions.length).fill(null));
    setCurrentQ(0);
    setStep("quiz");
    setResult(null);
  };

  const selectAnswer = (value) => {
    const updated = [...answers];
    updated[currentQ] = value;
    setAnswers(updated);
  };

  const goNext = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const score = answers.reduce((sum, v) => sum + (v ?? 0), 0);
      const resultData = quiz.getResult(score);
      setResult({ score, ...resultData });
      setStep("result");
      if (isSignedIn) {
        api.post("/api/assessment", { type: quiz.id, score, level: resultData.level }).catch(() => {});
      }
    }
  };

  const goPrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const reset = () => {
    setStep("select");
    setQuiz(null);
    setAnswers([]);
    setCurrentQ(0);
    setResult(null);
  };

  const progress = quiz
    ? Math.round(((currentQ + 1) / quiz.questions.length) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <AnimatePresence mode="wait">
        {/* ── Select Screen ── */}
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                Self-Assessment Tools
              </h1>
              <p className="text-gray-500 text-base">
                These standardized screenings help you reflect on your mental
                well-being. Results are not a diagnosis — always consult a
                professional for clinical advice.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[PHQ9, GAD7].map((q) => (
                <motion.div
                  key={q.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer"
                  onClick={() => startQuiz(q)}
                >
                  <div className="text-4xl mb-3">{q.icon}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {q.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {q.questions.length} questions
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {q.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">{q.description}</p>
                  <Button className="w-full" onClick={() => startQuiz(q)}>
                    Start Assessment
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>Disclaimer:</strong> These tools are for educational
              purposes only and are not a substitute for professional medical
              advice, diagnosis, or treatment. If you're in distress, please
              contact a mental health professional.
            </div>
          </motion.div>
        )}

        {/* ── Quiz Screen ── */}
        {step === "quiz" && quiz && (
          <motion.div
            key={`quiz-${currentQ}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={reset}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <p className="text-sm text-gray-500">{quiz.name} · {quiz.title}</p>
                <p className="text-xs text-gray-400">
                  Question {currentQ + 1} of {quiz.questions.length}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: `${(currentQ / quiz.questions.length) * 100}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Instruction */}
            <p className="text-sm text-gray-400 mb-2 italic">
              Over the past 2 weeks, how often have you been bothered by:
            </p>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {quiz.questions[currentQ]}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-8">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${
                    answers[currentQ] === opt.value
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-gray-700"
                  }`}
                >
                  <span className="text-sm text-gray-400 mr-2">{opt.value}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentQ === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Previous
              </Button>
              <Button
                onClick={goNext}
                disabled={answers[currentQ] === null}
                className="flex items-center gap-2"
              >
                {currentQ < quiz.questions.length - 1 ? (
                  <>Next <ArrowRight size={16} /></>
                ) : (
                  "See Results"
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Result Screen ── */}
        {step === "result" && result && quiz && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                Your Results
              </h1>
              <p className="text-gray-500">{quiz.name} · {quiz.title}</p>
            </div>

            {/* Score card */}
            <div
              className={`rounded-2xl border-2 p-8 text-center mb-6 ${RESULT_STYLES[result.color].bg} ${RESULT_STYLES[result.color].border}`}
            >
              <div
                className={`inline-block text-5xl font-extrabold mb-3 ${RESULT_STYLES[result.color].text}`}
              >
                {result.score}
                <span className="text-2xl font-normal">
                  /{quiz.questions.length * 3}
                </span>
              </div>
              <div
                className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${RESULT_STYLES[result.color].badge}`}
              >
                {result.level}
              </div>
              <p className={`text-base ${RESULT_STYLES[result.color].text}`}>
                {result.message}
              </p>
            </div>

            {/* Resources */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen size={18} /> Helpful Resources
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  📞 iCall helpline:{" "}
                  <a href="tel:9152987821" className="text-blue-600 underline">
                    9152987821
                  </a>
                </li>
                <li>
                  🌐{" "}
                  <a
                    href="https://www.nimhans.ac.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    NIMHANS Resources
                  </a>
                </li>
                <li>📚 Explore our <Link to="/articles" className="text-blue-600 underline">mental health articles</Link></li>
                <li>🧘 Try our <Link to="/mood" className="text-blue-600 underline">daily mood tracker</Link></li>
              </ul>
            </div>

            <p className="text-xs text-gray-400 text-center mb-6">
              This screening is not a clinical diagnosis. Please consult a
              licensed mental health professional for a proper evaluation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => startQuiz(quiz)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Retake Assessment
              </Button>
              <Button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Brain size={16} /> Try Other Assessment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
