import { Star, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { Difficulty, Operator } from "../utils/questionGenerator";

interface LeaderboardEntry {
  name: string;
  score: number;
  operator: string;
  difficulty: string;
  date: string;
}

interface HomeScreenProps {
  playerName: string;
  selectedOperator: Operator;
  selectedDifficulty: Difficulty;
  onSelectOperator: (op: Operator) => void;
  onSelectDifficulty: (d: Difficulty) => void;
  onStartQuiz: () => void;
  onChangeName: () => void;
  leaderboard: LeaderboardEntry[];
}

const TOPICS: {
  op: Operator;
  label: string;
  emoji: string;
  subtitle: string;
  cardClass: string;
}[] = [
  {
    op: "addition",
    label: "Addition Fun",
    emoji: "🐙",
    subtitle: "Add numbers together!",
    cardClass: "card-addition",
  },
  {
    op: "subtraction",
    label: "Subtraction Safari",
    emoji: "🦁",
    subtitle: "Take numbers away!",
    cardClass: "card-subtraction",
  },
  {
    op: "multiplication",
    label: "Multiplication Magic",
    emoji: "🦉",
    subtitle: "Multiply the fun!",
    cardClass: "card-multiplication",
  },
  {
    op: "division",
    label: "Division Quest",
    emoji: "🦊",
    subtitle: "Divide and conquer!",
    cardClass: "card-division",
  },
];

const DIFFICULTIES: {
  key: Difficulty;
  label: string;
  emoji: string;
  bg: string;
  border: string;
  textColor: string;
}[] = [
  {
    key: "easy",
    label: "Easy",
    emoji: "🌱",
    bg: "#e8f8e8",
    border: "#6cb64a",
    textColor: "#3a7a28",
  },
  {
    key: "medium",
    label: "Medium",
    emoji: "⚡",
    bg: "#fff3e0",
    border: "#f3a12a",
    textColor: "#9a5a00",
  },
  {
    key: "hard",
    label: "Hard",
    emoji: "🔥",
    bg: "#f8e8f8",
    border: "#7b4bc6",
    textColor: "#4a1a84",
  },
];

export default function HomeScreen({
  playerName,
  selectedOperator,
  selectedDifficulty,
  onSelectOperator,
  onSelectDifficulty,
  onStartQuiz,
  onChangeName,
  leaderboard,
}: HomeScreenProps) {
  return (
    <div className="math-bg relative z-10">
      <section
        className="hero-gradient pt-16 pb-20 px-4 relative overflow-hidden"
        aria-label="Hero"
      >
        <div
          className="absolute top-8 left-8 w-20 h-20 rounded-full opacity-20"
          style={{ background: "white" }}
        />
        <div
          className="absolute top-24 right-12 w-12 h-12 rounded-full opacity-15"
          style={{ background: "white" }}
        />
        <div
          className="absolute bottom-8 left-1/4 w-16 h-16 rounded-full opacity-10"
          style={{ background: "white" }}
        />

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            {playerName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-fredoka text-xl mb-2"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                👋 Hey, {playerName}!
              </motion.p>
            )}
            <h1
              className="font-fredoka text-5xl md:text-6xl leading-tight mb-4"
              style={{
                color: "white",
                textShadow:
                  "2px 3px 0 rgba(15,42,74,0.3), 0 0 20px rgba(15,42,74,0.15)",
              }}
            >
              Learn Math
              <br />
              While Having Fun! 🎉
            </h1>
            <p
              className="text-lg mb-8 font-nunito font-semibold"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Master addition, subtraction, multiplication &amp; division with
              exciting quizzes!
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                type="button"
                data-ocid="home.primary_button"
                className="btn-cta text-lg px-8 py-3"
                onClick={onStartQuiz}
              >
                <Zap className="w-5 h-5" />
                Play Now!
              </button>
              {playerName && (
                <button
                  type="button"
                  data-ocid="home.secondary_button"
                  onClick={onChangeName}
                  className="btn-pill-white text-base px-6 py-3"
                >
                  ✏️ Change Name
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="animate-mascot-sway">
              <img
                src="/assets/generated/math-mascot-transparent.dim_300x300.png"
                alt="Math Whiz Mascot"
                className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2
            className="font-fredoka text-3xl mb-6 text-center"
            style={{ color: "#0f2a4a" }}
          >
            Choose Your Topic 🎯
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {TOPICS.map((topic, idx) => (
              <motion.button
                key={topic.op}
                type="button"
                data-ocid={`home.topic.item.${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
                onClick={() => onSelectOperator(topic.op)}
                className={`quiz-card ${topic.cardClass} p-5 text-center cursor-pointer border-none ${
                  selectedOperator === topic.op
                    ? "ring-4 ring-white ring-offset-2 ring-offset-transparent scale-105"
                    : ""
                }`}
                style={{ outline: "none" }}
              >
                <div className="text-4xl mb-2">{topic.emoji}</div>
                <div
                  className="font-fredoka text-base leading-tight mb-2"
                  style={{ color: "white" }}
                >
                  {topic.label}
                </div>
                <p
                  className="text-xs mb-3"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {topic.subtitle}
                </p>
                <span className="btn-pill-white text-xs px-3 py-1">
                  {selectedOperator === topic.op ? "✓ Selected" : "Play Now"}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mb-10"
        >
          <h2
            className="font-fredoka text-2xl mb-4"
            style={{ color: "#0f2a4a" }}
          >
            Pick Your Level 🎮
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                type="button"
                data-ocid="home.difficulty.tab"
                onClick={() => onSelectDifficulty(d.key)}
                className="diff-pill"
                style={{
                  background: selectedDifficulty === d.key ? d.border : d.bg,
                  color: selectedDifficulty === d.key ? "white" : d.textColor,
                  borderColor: d.border,
                  transform: selectedDifficulty === d.key ? "scale(1.08)" : "",
                  boxShadow:
                    selectedDifficulty === d.key
                      ? `0 4px 14px ${d.border}55`
                      : undefined,
                }}
              >
                {d.emoji} {d.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2
            className="font-fredoka text-2xl mb-4 text-center"
            style={{ color: "#0f2a4a" }}
          >
            <Trophy
              className="inline w-6 h-6 mr-2"
              style={{ color: "#f7c948" }}
            />
            Hall of Fame 🏆
          </h2>
          <div
            className="quiz-card bg-white p-4"
            data-ocid="home.leaderboard.table"
          >
            {leaderboard.length === 0 ? (
              <div
                className="text-center py-8"
                data-ocid="home.leaderboard.empty_state"
              >
                <div className="text-4xl mb-2">🌟</div>
                <p
                  className="font-fredoka text-lg"
                  style={{ color: "#25425c" }}
                >
                  No scores yet — be the first champion!
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div
                  className="grid grid-cols-4 px-4 py-2 font-fredoka text-sm"
                  style={{ color: "#25425c" }}
                >
                  <span>Rank</span>
                  <span>Player</span>
                  <span>Score</span>
                  <span>Mode</span>
                </div>
                {leaderboard.slice(0, 8).map((entry, i) => (
                  <div
                    key={entry.name + entry.date + String(i)}
                    data-ocid={`home.leaderboard.item.${i + 1}`}
                    className="leaderboard-row grid grid-cols-4 px-4 py-3 rounded-xl items-center transition-colors"
                    style={{
                      borderBottom:
                        i < leaderboard.length - 1
                          ? "1px solid #e8f4fb"
                          : undefined,
                    }}
                  >
                    <span className="font-fredoka text-lg">
                      {i === 0
                        ? "🥇"
                        : i === 1
                          ? "🥈"
                          : i === 2
                            ? "🥉"
                            : `#${i + 1}`}
                    </span>
                    <span
                      className="font-nunito font-bold"
                      style={{ color: "#0f2a4a" }}
                    >
                      {entry.name}
                    </span>
                    <span
                      className="font-fredoka text-lg"
                      style={{ color: "#1e95d6" }}
                    >
                      {entry.score}/10
                    </span>
                    <span
                      className="text-xs font-nunito font-semibold px-2 py-1 rounded-full"
                      style={{ background: "#f3fbff", color: "#25425c" }}
                    >
                      {entry.operator} • {entry.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
