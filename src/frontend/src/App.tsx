import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import NameScreen from "./components/NameScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import { generateQuiz } from "./utils/questionGenerator";
import type { Difficulty, Operator, Question } from "./utils/questionGenerator";

type Screen = "home" | "name" | "quiz" | "result";

interface LeaderboardEntry {
  name: string;
  score: number;
  operator: string;
  difficulty: string;
  date: string;
}

const STORAGE_KEY = "math-whiz-leaderboard";
const NAME_KEY = "math-whiz-player-name";

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    name: "Zara",
    score: 10,
    operator: "addition",
    difficulty: "hard",
    date: "2026-04-01",
  },
  {
    name: "Liam",
    score: 9,
    operator: "multiplication",
    difficulty: "medium",
    date: "2026-04-02",
  },
  {
    name: "Priya",
    score: 8,
    operator: "subtraction",
    difficulty: "hard",
    date: "2026-04-03",
  },
  {
    name: "Ethan",
    score: 7,
    operator: "division",
    difficulty: "easy",
    date: "2026-04-04",
  },
  {
    name: "Sofia",
    score: 6,
    operator: "addition",
    difficulty: "medium",
    date: "2026-04-05",
  },
];

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveLeaderboard(SAMPLE_LEADERBOARD);
      return SAMPLE_LEADERBOARD;
    }
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return SAMPLE_LEADERBOARD;
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem(NAME_KEY) ?? "";
  });
  const [selectedOperator, setSelectedOperator] =
    useState<Operator>("addition");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("easy");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(loadLeaderboard);

  const handleStartQuiz = () => {
    if (!playerName) {
      setScreen("name");
      return;
    }
    const qs = generateQuiz(selectedOperator, selectedDifficulty, 10);
    setQuestions(qs);
    setAnswers([]);
    setScreen("quiz");
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    localStorage.setItem(NAME_KEY, name);
    const qs = generateQuiz(selectedOperator, selectedDifficulty, 10);
    setQuestions(qs);
    setAnswers([]);
    setScreen("quiz");
  };

  const handleQuizComplete = (results: boolean[]) => {
    setAnswers(results);
    const score = results.filter(Boolean).length;

    const entry: LeaderboardEntry = {
      name: playerName || "Anonymous",
      score,
      operator: selectedOperator,
      difficulty: selectedDifficulty,
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [entry, ...leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    setLeaderboard(updated);
    saveLeaderboard(updated);
    setScreen("result");
  };

  const handlePlayAgain = () => {
    const qs = generateQuiz(selectedOperator, selectedDifficulty, 10);
    setQuestions(qs);
    setAnswers([]);
    setScreen("quiz");
  };

  const handleHome = () => {
    setAnswers([]);
    setScreen("home");
  };

  const handleChangeName = () => {
    setScreen("name");
  };

  return (
    <div className="min-h-screen relative">
      {screen === "home" && (
        <nav className="navbar px-4 py-3" aria-label="Main navigation">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "#f7c948", color: "#0f2a4a" }}
              >
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span
                className="font-fredoka text-xl"
                style={{ color: "#0f2a4a" }}
              >
                MATH WHIZ KIDS
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                type="button"
                data-ocid="nav.home.link"
                className="font-fredoka text-base transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer"
                style={{ color: "#25425c" }}
                onClick={() => setScreen("home")}
              >
                🏠 Home
              </button>
              <button
                type="button"
                data-ocid="nav.play.link"
                className="font-fredoka text-base transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer"
                style={{ color: "#25425c" }}
                onClick={handleStartQuiz}
              >
                🎮 Play
              </button>
              <button
                type="button"
                data-ocid="nav.leaderboard.link"
                className="font-fredoka text-base transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer"
                style={{ color: "#25425c" }}
              >
                🏆 Leaderboard
              </button>
            </div>

            <button
              type="button"
              data-ocid="nav.play_now.button"
              className="btn-cta"
              onClick={handleStartQuiz}
            >
              ▶ Play Now
            </button>
          </div>
        </nav>
      )}

      {screen === "home" && (
        <HomeScreen
          playerName={playerName}
          selectedOperator={selectedOperator}
          selectedDifficulty={selectedDifficulty}
          onSelectOperator={setSelectedOperator}
          onSelectDifficulty={setSelectedDifficulty}
          onStartQuiz={handleStartQuiz}
          onChangeName={handleChangeName}
          leaderboard={leaderboard}
        />
      )}

      {screen === "name" && <NameScreen onSubmit={handleNameSubmit} />}

      {screen === "quiz" && questions.length > 0 && (
        <QuizScreen
          questions={questions}
          playerName={playerName}
          onComplete={handleQuizComplete}
          onBack={handleHome}
        />
      )}

      {screen === "result" && questions.length > 0 && (
        <ResultScreen
          score={answers.filter(Boolean).length}
          total={questions.length}
          answers={answers}
          questions={questions}
          playerName={playerName}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      )}

      <footer
        className="py-6 px-4 text-center font-nunito text-sm"
        style={{ background: "#0c2740", color: "rgba(255,255,255,0.7)" }}
        aria-label="Footer"
      >
        <p>
          © {new Date().getFullYear()} Math Whiz Kids. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
            style={{ color: "#3aafd3" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
