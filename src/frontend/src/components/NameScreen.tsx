import { Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface NameScreenProps {
  onSubmit: (name: string) => void;
}

export default function NameScreen({ onSubmit }: NameScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 math-bg"
      style={{
        background: "linear-gradient(135deg, #3aafd3 0%, #bfefea 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="quiz-card bg-white p-8 w-full max-w-md text-center"
        data-ocid="name.card"
      >
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2 + i * 0.1,
                type: "spring",
                stiffness: 300,
              }}
            >
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 star-glow" />
            </motion.div>
          ))}
        </div>

        <div className="text-5xl mb-3" aria-hidden="true">
          🧠
        </div>

        <h1 className="font-fredoka text-3xl mb-2" style={{ color: "#0f2a4a" }}>
          What&apos;s your name,
        </h1>
        <h2 className="font-fredoka text-2xl mb-6" style={{ color: "#1e95d6" }}>
          Math Star? ⭐
        </h2>

        <input
          data-ocid="name.input"
          type="text"
          className="name-input mb-6"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={20}
        />

        <button
          type="button"
          data-ocid="name.submit_button"
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="btn-cta w-full justify-center text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Let&apos;s Go! 🚀
        </button>
      </motion.div>
    </div>
  );
}
