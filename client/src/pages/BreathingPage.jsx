import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

const EXERCISES = {
  box: {
    name: "Box Breathing",
    pattern: "4 – 4 – 4 – 4",
    description: "Equal phases of inhale, hold, exhale, hold. Used by Navy SEALs to calm the nervous system and sharpen focus.",
    phases: [
      { label: "Inhale",  duration: 4, scale: 1.6, bg: "#3b82f6", ring: "#93c5fd" },
      { label: "Hold",    duration: 4, scale: 1.6, bg: "#f59e0b", ring: "#fcd34d" },
      { label: "Exhale",  duration: 4, scale: 1.0, bg: "#8b5cf6", ring: "#c4b5fd" },
      { label: "Hold",    duration: 4, scale: 1.0, bg: "#6b7280", ring: "#d1d5db" },
    ],
  },
  "478": {
    name: "4-7-8 Breathing",
    pattern: "4 – 7 – 8",
    description: "Inhale for 4, hold for 7, exhale for 8. Activates the parasympathetic nervous system — excellent before sleep or during anxiety.",
    phases: [
      { label: "Inhale",  duration: 4, scale: 1.6, bg: "#3b82f6", ring: "#93c5fd" },
      { label: "Hold",    duration: 7, scale: 1.6, bg: "#f59e0b", ring: "#fcd34d" },
      { label: "Exhale",  duration: 8, scale: 1.0, bg: "#8b5cf6", ring: "#c4b5fd" },
    ],
  },
};

export default function BreathingPage() {
  const [selectedKey, setSelectedKey] = useState("box");
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXERCISES.box.phases[0].duration);
  const [cycles, setCycles] = useState(0);

  const controls = useAnimation();
  const exercise = EXERCISES[selectedKey];
  const phase = exercise.phases[phaseIndex];

  // Animate circle when phase changes
  useEffect(() => {
    controls.start({
      scale: phase.scale,
      backgroundColor: phase.bg,
      boxShadow: `0 0 0 12px ${phase.ring}40, 0 0 0 24px ${phase.ring}20`,
      transition: {
        scale: {
          duration: phase.label === "Inhale" || phase.label === "Exhale" ? phase.duration : 0.4,
          ease: "easeInOut",
        },
        backgroundColor: { duration: 0.5 },
        boxShadow: { duration: 0.5 },
      },
    });
  }, [phaseIndex, phase, controls]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          const nextIndex = (phaseIndex + 1) % exercise.phases.length;
          setPhaseIndex(nextIndex);
          if (nextIndex === 0) setCycles((c) => c + 1);
          setSecondsLeft(exercise.phases[nextIndex].duration);
          return exercise.phases[nextIndex].duration;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft, phaseIndex, exercise]);

  const handleToggle = () => {
    if (!isRunning) {
      // Start fresh if at beginning
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(exercise.phases[0].duration);
    setCycles(0);
    controls.start({
      scale: 1.0,
      backgroundColor: "#e5e7eb",
      boxShadow: "0 0 0 12px #e5e7eb40, 0 0 0 24px #e5e7eb20",
      transition: { duration: 0.4 },
    });
  };

  const handleSelectExercise = (key) => {
    setSelectedKey(key);
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(EXERCISES[key].phases[0].duration);
    setCycles(0);
    controls.start({
      scale: 1.0,
      backgroundColor: "#e5e7eb",
      boxShadow: "0 0 0 12px #e5e7eb40, 0 0 0 24px #e5e7eb20",
      transition: { duration: 0.3 },
    });
  };

  const progressPct =
    ((exercise.phases[phaseIndex].duration - secondsLeft) /
      exercise.phases[phaseIndex].duration) *
    100;

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Breathing Exercises
        </h1>
        <p className="text-gray-500 mb-8">
          Controlled breathing activates your body's relaxation response. Use
          daily or whenever you feel stressed.
        </p>

        {/* Exercise Selector */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {Object.entries(EXERCISES).map(([key, ex]) => (
            <button
              key={key}
              onClick={() => handleSelectExercise(key)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedKey === key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <p className="font-bold text-gray-900 text-sm mb-0.5">{ex.name}</p>
              <p className="text-xs text-blue-600 font-mono font-semibold mb-1">{ex.pattern}</p>
              <p className="text-xs text-gray-400 line-clamp-2">{ex.description}</p>
            </button>
          ))}
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-64 h-64 mb-6">
            {/* Outer pulse ring */}
            {isRunning && (
              <motion.div
                className="absolute rounded-full border-2 border-blue-200"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 220, height: 220 }}
              />
            )}

            {/* Main breathing circle */}
            <motion.div
              animate={controls}
              initial={{ scale: 1.0, backgroundColor: "#e5e7eb" }}
              className="rounded-full flex flex-col items-center justify-center cursor-pointer select-none"
              style={{ width: 130, height: 130 }}
              onClick={handleToggle}
            >
              <span className="text-white font-extrabold text-3xl leading-none">
                {isRunning ? secondsLeft : "▶"}
              </span>
              {isRunning && (
                <span className="text-white text-xs font-semibold mt-1 opacity-90">
                  {phase.label}
                </span>
              )}
            </motion.div>
          </div>

          {/* Phase label */}
          <p className="text-xl font-bold text-gray-800 mb-1">
            {isRunning ? phase.label : "Tap to begin"}
          </p>
          {isRunning && (
            <p className="text-sm text-gray-400">
              {secondsLeft}s remaining · Cycle {cycles + 1}
            </p>
          )}

          {/* Phase progress bar */}
          {isRunning && (
            <div className="w-48 bg-gray-100 rounded-full h-1.5 mt-3">
              <motion.div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: phase.bg }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.9, ease: "linear" }}
              />
            </div>
          )}
        </div>

        {/* Phase Timeline */}
        <div className="flex justify-center gap-2 mb-8">
          {exercise.phases.map((p, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isRunning && i === phaseIndex
                  ? "bg-gray-100 ring-1 ring-gray-300"
                  : ""
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: p.bg }}
              />
              <span className="text-xs font-semibold text-gray-700">{p.label}</span>
              <span className="text-xs text-gray-400">{p.duration}s</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            onClick={handleToggle}
            className="flex items-center gap-2 px-8"
          >
            {isRunning ? (
              <><Pause size={18} /> Pause</>
            ) : (
              <><Play size={18} /> {cycles > 0 || phaseIndex > 0 ? "Resume" : "Start"}</>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
          </Button>
        </div>

        {cycles > 0 && !isRunning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-green-600 font-medium mt-4"
          >
            Great work! You completed {cycles} cycle{cycles > 1 ? "s" : ""}.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
