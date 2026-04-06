import { useEffect, useState } from "react";

interface Piece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  shape: string;
}

const COLORS = [
  "#f7c948",
  "#e84a8a",
  "#59b24b",
  "#2f8fe6",
  "#f3a12a",
  "#7b4bc6",
  "#3aafd3",
  "#ff6b6b",
];

const SHAPES = ["2px", "50%", "0"];

export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const generated: Piece[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 8 + Math.random() * 8,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }));
    setPieces(generated);

    const timer = setTimeout(() => setPieces([]), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[999] overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: p.shape,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
