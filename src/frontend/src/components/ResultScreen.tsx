import { Home, RotateCcw, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSoundEffects } from "../hooks/useSoundEffects";
import type { Question } from "../utils/questionGenerator";
import Confetti from "./Confetti";

interface ResultScreenProps {
  score: number;
  total: number;
  answers: boolean[];
  questions: Question[];
  playerName: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

function getStarCount(score: number): number {
  if (score >= 8) return 3;
  if (score >= 4) return 2;
  return 1;
}

function getResultMessage(
  score: number,
  total: number,
): { title: string; subtitle: string; emoji: string } {
  const pct = score / total;
  if (pct >= 0.9)
    return {
      title: "PERFECT!",
      subtitle: "You're a Math Genius!",
      emoji: "🏆",
    };
  if (pct >= 0.7)
    return {
      title: "AWESOME!",
      subtitle: "Great job, keep it up!",
      emoji: "🌟",
    };
  if (pct >= 0.5)
    return {
      title: "GOOD JOB!",
      subtitle: "You're getting better!",
      emoji: "👍",
    };
  return {
    title: "KEEP TRYING!",
    subtitle: "Practice makes perfect!",
    emoji: "💪",
  };
}

export default function ResultScreen({
  score,
  total,
  answers,
  questions,
  playerName,
  onPlayAgain,
  onHome,
}: ResultScreenProps) {
  const stars = getStarCount(score);
  const result = getResultMessage(score, total);
  const [starsVisible, setStarsVisible] = useState([false, false, false]);
  const { playComplete } = useSoundEffects();
  const playCompleteRef = useRef(playComplete);
  useEffect(() => {
    playCompleteRef.current = playComplete;
  }, [playComplete]);

  useEffect(() => {
    const timers = [0, 1, 2].map((i) =>
      setTimeout(
        () => {
          setStarsVisible((prev) => {
            const next = [...prev];
            next[i] = i < stars;
            return next;
          });
        },
        400 + i * 300,
      ),
    );
    // Play completion fanfare once on mount
    const fanfareTimer = setTimeout(() => playCompleteRef.current(), 300);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fanfareTimer);
    };
  }, [stars]);

  return (
    <>
      <Confetti />
      <div
        className="min-h-screen flex flex-col items-center justify-start math-bg relative z-10 p-4 pt-8"
        style={{ background: "oklch(var(--quiz-pagebg))" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="quiz-card bg-white p-8 w-full max-w-xl text-center mb-6"
          data-ocid="result.card"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="text-6xl mb-3"
          >
            {result.emoji}
          </motion.div>

          <h1
            className="font-fredoka text-4xl mb-1"
            style={{ color: "#0f2a4a" }}
            data-ocid="result.title.panel"
          >
            {result.title}
          </h1>
          <p
            className="font-nunito font-semibold text-lg mb-4"
            style={{ color: "#25425c" }}
          >
            {playerName ? `${playerName}, ` : ""}
            {result.subtitle}
          </p>

          <div
            className="flex justify-center gap-3 mb-5"
            data-ocid="result.stars.panel"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={starsVisible[i] ? "animate-star-pop" : ""}
                style={{ opacity: starsVisible[i] ? 1 : 0.2 }}
              >
                <Star
                  className="w-14 h-14"
                  style={{
                    fill: starsVisible[i] ? "#f7c948" : "#e0e0e0",
                    color: starsVisible[i] ? "#f7c948" : "#e0e0e0",
                    filter: starsVisible[i]
                      ? "drop-shadow(0 0 10px rgba(247,201,72,0.8))"
                      : "none",
                  }}
                />
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-quiz-lg p-5 mb-6"
            style={{
              background: "linear-gradient(135deg, #3aafd3 0%, #bfefea 100%)",
            }}
            data-ocid="result.score.panel"
          >
            <p
              className="font-fredoka text-white text-lg"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
            >
              You got
            </p>
            <p
              className="font-fredoka text-5xl text-white leading-tight"
              style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
            >
              {score}/{total}!
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              data-ocid="result.play_again_button"
              onClick={onPlayAgain}
              className="btn-cta text-lg px-8 py-3"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again!
            </button>
            <button
              type="button"
              data-ocid="result.home_button"
              onClick={onHome}
              className="btn-pill-white text-base px-8 py-3"
              style={{ border: "2px solid #3aafd3" }}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="quiz-card bg-white p-6 w-full max-w-xl"
          data-ocid="result.review.panel"
        >
          <h2
            className="font-fredoka text-2xl mb-4"
            style={{ color: "#0f2a4a" }}
          >
            📋 Question Review
          </h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div
                key={q.id}
                data-ocid={`result.review.item.${i + 1}`}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{
                  background: answers[i] ? "#f0fdf0" : "#fff5f5",
                  border: `2px solid ${answers[i] ? "#59b24b" : "#e84a8a"}30`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden="true">
                    {answers[i] ? "✅" : "❌"}
                  </span>
                  <span
                    className="font-fredoka text-base"
                    style={{ color: "#0f2a4a" }}
                  >
                    {q.expression.replace("= ?", "").trim()}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className="font-fredoka text-lg"
                    style={{ color: answers[i] ? "#59b24b" : "#e84a8a" }}
                  >
                    = {q.correctAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
