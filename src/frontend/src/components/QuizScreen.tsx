import { ArrowLeft, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSoundEffects } from "../hooks/useSoundEffects";
import type { Question } from "../utils/questionGenerator";

interface QuizScreenProps {
  questions: Question[];
  playerName: string;
  onComplete: (answers: boolean[]) => void;
  onBack: () => void;
}

const ANSWER_COLORS = [
  { base: "answer-pink" },
  { base: "answer-green" },
  { base: "answer-blue" },
  { base: "answer-orange" },
];

const TIMER_DURATION = 15;
const CIRCUMFERENCE = 2 * Math.PI * 45;

export default function QuizScreen({
  questions,
  playerName,
  onComplete,
  onBack,
}: QuizScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playCorrect, playWrong, playTick, playTimeout } = useSoundEffects();

  // Keep sound refs stable so they don't retrigger the timer effect
  const playTickRef = useRef(playTick);
  const playTimeoutRef = useRef(playTimeout);
  useEffect(() => {
    playTickRef.current = playTick;
  }, [playTick]);
  useEffect(() => {
    playTimeoutRef.current = playTimeout;
  }, [playTimeout]);

  const score = answers.filter(Boolean).length;
  const currentQ = questions[currentIdx];

  const advance = useCallback(
    (wasCorrect: boolean | null) => {
      const result = wasCorrect ?? false;
      const newAnswers = [...answers, result];
      setAnswers(newAnswers);
      setSelected(null);
      setShakeIdx(null);
      setTimeLeft(TIMER_DURATION);
      if (currentIdx + 1 >= questions.length) {
        onComplete(newAnswers);
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    },
    [answers, currentIdx, questions.length, onComplete],
  );

  // Reset timer when question changes or answer is given
  useEffect(() => {
    if (selected !== null) return undefined;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          playTimeoutRef.current();
          advanceRef.current = setTimeout(() => advance(false), 300);
          return 0;
        }
        const next = prev - 1;
        if (next <= 5 && next > 0) {
          playTickRef.current();
        }
        return next;
      });
    }, 1000);
    return () => {
      clearInterval(timerRef.current!);
    };
    // currentIdx is intentionally included to reset timer on question change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, advance]);

  const handleAnswer = (choice: number, choiceIdx: number) => {
    if (selected !== null) return;
    clearInterval(timerRef.current!);
    clearTimeout(advanceRef.current!);
    const isCorrect = choice === currentQ.correctAnswer;
    setSelected(choiceIdx);
    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
      setShakeIdx(choiceIdx);
    }
    advanceRef.current = setTimeout(() => advance(isCorrect), 1000);
  };

  const progressPct = (currentIdx / questions.length) * 100;
  const timerPct = timeLeft / TIMER_DURATION;
  const timerStrokeDash = CIRCUMFERENCE * (1 - timerPct);
  const timerColor =
    timeLeft > 8 ? "#59b24b" : timeLeft > 4 ? "#f3a12a" : "#e84a8a";

  const getChoiceClass = (choice: number, idx: number): string => {
    const base = `answer-tile ${ANSWER_COLORS[idx % 4].base}`;
    if (selected === null) return base;
    if (choice === currentQ.correctAnswer) return `${base} answer-correct`;
    if (selected === idx)
      return `${base} answer-wrong${shakeIdx === idx ? " animate-shake" : ""}`;
    return `${base} opacity-50`;
  };

  return (
    <div
      className="min-h-screen flex flex-col math-bg relative z-10"
      style={{ background: "oklch(var(--quiz-pagebg))" }}
    >
      <header className="navbar px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          data-ocid="quiz.back_button"
          onClick={onBack}
          className="flex items-center gap-2 font-fredoka text-base rounded-full px-4 py-2 transition-all hover:scale-105"
          style={{ background: "#f3fbff", color: "#0f2a4a" }}
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="font-fredoka text-xl" style={{ color: "#0f2a4a" }}>
          Hi, {playerName}! 👋
        </div>

        <div
          className="flex items-center gap-2 font-fredoka text-xl"
          style={{ color: "#f3a12a" }}
          data-ocid="quiz.score.panel"
        >
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          {score} pts
        </div>
      </header>

      <div className="px-4 pt-4 pb-0 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="font-fredoka text-base" style={{ color: "#25425c" }}>
            <Star className="inline w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="font-fredoka text-base" style={{ color: "#25425c" }}>
            Score: {score}/{currentIdx}
          </span>
        </div>
        {/* Progress bar — decorative, aria info on track wrapper */}
        <div
          className="progress-track"
          data-ocid="quiz.progress.panel"
          role="progressbar"
          aria-valuenow={currentIdx + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label={`Question ${currentIdx + 1} of ${questions.length}`}
          tabIndex={0}
        >
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="quiz-card bg-white p-6 md:p-8 w-full max-w-2xl"
            data-ocid="quiz.question.card"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div
                className="flex-shrink-0 relative"
                data-ocid="quiz.timer.panel"
              >
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  className="block"
                  aria-label={`${timeLeft} seconds remaining`}
                  role="img"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="6"
                    stroke="#e8f4fb"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="6"
                    stroke={timerColor}
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={timerStrokeDash}
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                      transition:
                        "stroke-dashoffset 1s linear, stroke 0.5s ease",
                    }}
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="26"
                    fontFamily="Fredoka One, cursive"
                    fill={timerColor}
                    style={{ transition: "fill 0.5s ease" }}
                  >
                    {timeLeft}
                  </text>
                </svg>
                <p
                  className="text-center font-nunito text-xs font-semibold mt-1"
                  style={{ color: "#25425c" }}
                >
                  seconds
                </p>
              </div>

              <div className="flex-1 text-center md:text-left">
                <p
                  className="font-nunito font-semibold text-sm mb-2"
                  style={{ color: "#25425c" }}
                >
                  Solve this! 🤔
                </p>
                <div
                  className="font-fredoka leading-none"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4rem)",
                    color: "#0f2a4a",
                  }}
                >
                  {currentQ.expression}
                </div>
              </div>
            </div>

            <div
              className="grid grid-cols-2 gap-3"
              data-ocid="quiz.answers.panel"
            >
              {currentQ.choices.map((choice, idx) => (
                <button
                  key={`q${currentIdx}-opt${choice}`}
                  type="button"
                  data-ocid={`quiz.answer.item.${idx + 1}`}
                  className={getChoiceClass(choice, idx)}
                  onClick={() => handleAnswer(choice, idx)}
                  disabled={selected !== null}
                  aria-label={`Answer: ${choice}`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
