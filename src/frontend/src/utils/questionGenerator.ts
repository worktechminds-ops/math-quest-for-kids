export type Operator =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  expression: string;
  correctAnswer: number;
  choices: number[];
  operator: Operator;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRanges(
  difficulty: Difficulty,
  operator: Operator,
): [number, number] {
  if (operator === "multiplication") {
    if (difficulty === "easy") return [1, 5];
    if (difficulty === "medium") return [1, 10];
    return [1, 12];
  }
  if (difficulty === "easy") return [1, 10];
  if (difficulty === "medium") return [1, 20];
  return [1, 50];
}

function generateWrongAnswers(correct: number, count = 3): number[] {
  const wrongs = new Set<number>();
  const spread = Math.max(5, Math.floor(correct * 0.4) + 2);
  let attempts = 0;
  while (wrongs.size < count && attempts < 100) {
    attempts++;
    const delta = randomInt(-spread, spread);
    if (delta === 0) continue;
    const candidate = correct + delta;
    if (candidate < 0) continue;
    if (candidate === correct) continue;
    wrongs.add(candidate);
  }
  // Fallback if not enough generated
  let fallback = correct + 1;
  while (wrongs.size < count) {
    if (!wrongs.has(fallback) && fallback !== correct) wrongs.add(fallback);
    fallback++;
  }
  return Array.from(wrongs).slice(0, count);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(
  id: number,
  operator: Operator,
  difficulty: Difficulty,
): Question {
  const [min, max] = getRanges(difficulty, operator);
  let expression = "";
  let correctAnswer = 0;

  if (operator === "addition") {
    const a = randomInt(min, max);
    const b = randomInt(min, max);
    expression = `${a} + ${b} = ?`;
    correctAnswer = a + b;
  } else if (operator === "subtraction") {
    const a = randomInt(min, max);
    const b = randomInt(min, a); // ensure b <= a so result >= 0
    expression = `${a} − ${b} = ?`;
    correctAnswer = a - b;
  } else if (operator === "multiplication") {
    const a = randomInt(min, max);
    const b = randomInt(min, max);
    expression = `${a} × ${b} = ?`;
    correctAnswer = a * b;
  } else {
    // division: pick divisor b and result c, question is (b*c) ÷ b
    const b = randomInt(1, max <= 10 ? max : 10);
    const c = randomInt(min, max <= 10 ? max : 10);
    const a = b * c;
    expression = `${a} ÷ ${b} = ?`;
    correctAnswer = c;
  }

  const wrongs = generateWrongAnswers(correctAnswer, 3);
  const choices = shuffleArray([correctAnswer, ...wrongs]);

  return { id, expression, correctAnswer, choices, operator };
}

export function generateQuiz(
  operator: Operator,
  difficulty: Difficulty,
  count = 10,
): Question[] {
  return Array.from({ length: count }, (_, i) =>
    generateQuestion(i + 1, operator, difficulty),
  );
}
