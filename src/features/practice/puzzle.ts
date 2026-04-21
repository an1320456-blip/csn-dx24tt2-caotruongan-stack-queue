export type PuzzleTopic = 'stack' | 'queue';

export interface TargetPuzzle {
  id: string;
  seed: number;
  topic: PuzzleTopic;
  difficulty: number;
  initialState: string[];
  targetState: string[];
  allowedOps: string[];
  canonicalSolution: string[];
  hint: string;
  explanation: string;
}

export interface TargetJudgeResult {
  isCorrect: boolean;
  usedSteps: number;
  invalidStepIndex?: number;
  replayFrames: string[];
  divergenceIndex?: number;
}

export interface RepairPuzzle extends TargetPuzzle {
  buggySequence: string[];
  minFixCount: number;
}

export interface RepairJudgeResult extends TargetJudgeResult {
  editCount: number;
}

export interface MinimalMovesPuzzle extends TargetPuzzle {
  maxSteps: number;
}

export interface MinimalMovesJudgeResult extends TargetJudgeResult {
  hitStepBudget: boolean;
}

interface GenerateInput {
  seed: number;
  topic: PuzzleTopic;
  difficulty: number;
}

interface ApplyResult {
  finalState: string[];
  invalidStepIndex?: number;
  frames: string[][];
}

function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomPick<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

function normalizeOperation(rawOp: string): { op: 'PUSH' | 'POP' | 'ENQUEUE' | 'DEQUEUE'; value?: string } {
  const [opRaw, value] = rawOp.split(':');
  const op = opRaw.trim().toUpperCase();

  if (op === 'PUSH' || op === 'POP' || op === 'ENQUEUE' || op === 'DEQUEUE') {
    return { op, value: value?.trim() };
  }
  throw new Error(`Unsupported operation: ${rawOp}`);
}

function applyOne(state: string[], rawOp: string, topic: PuzzleTopic): { next: string[]; valid: boolean } {
  const { op, value } = normalizeOperation(rawOp);
  const next = [...state];

  if (topic === 'stack') {
    if (op === 'PUSH') {
      if (!value) return { next: state, valid: false };
      next.unshift(value);
      return { next, valid: true };
    }
    if (op === 'POP') {
      if (next.length === 0) return { next: state, valid: false };
      next.shift();
      return { next, valid: true };
    }
    return { next: state, valid: false };
  }

  if (op === 'ENQUEUE') {
    if (!value) return { next: state, valid: false };
    next.push(value);
    return { next, valid: true };
  }
  if (op === 'DEQUEUE') {
    if (next.length === 0) return { next: state, valid: false };
    next.shift();
    return { next, valid: true };
  }
  return { next: state, valid: false };
}

export function serializeState(state: string[], topic: PuzzleTopic): string {
  if (state.length === 0) {
    return topic === 'stack' ? '[TOP:empty]' : '[FRONT:empty]';
  }
  return topic === 'stack'
    ? `[TOP:${state.join(' | ')}]`
    : `[FRONT:${state.join(' | ')}]`;
}

export function applyOperations(initialState: string[], ops: string[], topic: PuzzleTopic): ApplyResult {
  let state = [...initialState];
  const frames: string[][] = [state];

  for (let i = 0; i < ops.length; i += 1) {
    const { next, valid } = applyOne(state, ops[i], topic);
    if (!valid) {
      return { finalState: state, invalidStepIndex: i, frames };
    }
    state = next;
    frames.push(state);
  }
  return { finalState: state, frames };
}

function buildCanonicalSolution(
  initialState: string[],
  topic: PuzzleTopic,
  rng: () => number,
  difficulty: number
): string[] {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const steps = Math.min(3 + difficulty, 8);
  const ops: string[] = [];
  const snapshot = [...initialState];

  for (let i = 0; i < steps; i += 1) {
    const canRemove = snapshot.length > 0;
    const shouldRemove = canRemove && rng() < 0.35;

    if (topic === 'stack') {
      if (shouldRemove) {
        ops.push('POP');
        snapshot.shift();
      } else {
        const value = randomPick(values, rng);
        ops.push(`PUSH:${value}`);
        snapshot.unshift(value);
      }
    } else if (shouldRemove) {
      ops.push('DEQUEUE');
      snapshot.shift();
    } else {
      const value = randomPick(values, rng);
      ops.push(`ENQUEUE:${value}`);
      snapshot.push(value);
    }
  }

  return ops;
}

function levenshteinOps(a: string[], b: string[]): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function mutateOperation(op: string): string {
  if (op.startsWith('PUSH:')) return 'POP';
  if (op.startsWith('ENQUEUE:')) return 'DEQUEUE';
  if (op === 'POP') return 'PUSH:Z';
  if (op === 'DEQUEUE') return 'ENQUEUE:Z';
  return op;
}

export function generateTargetPuzzle(input: GenerateInput): TargetPuzzle {
  const derivedSeed = hash32(`${input.seed}|${input.topic}|${input.difficulty}|S1_TARGET`);
  const rng = mulberry32(derivedSeed);
  const values = ['A', 'B', 'C', 'D', 'E'];
  const initialCount = Math.min(1 + input.difficulty, 4);

  const initialState = Array.from({ length: initialCount }, () => randomPick(values, rng));
  const canonicalSolution = buildCanonicalSolution(initialState, input.topic, rng, input.difficulty);
  const solved = applyOperations(initialState, canonicalSolution, input.topic);

  return {
    id: `${derivedSeed}`,
    seed: input.seed,
    topic: input.topic,
    difficulty: input.difficulty,
    initialState,
    targetState: solved.finalState,
    allowedOps: input.topic === 'stack' ? ['PUSH:<value>', 'POP'] : ['ENQUEUE:<value>', 'DEQUEUE'],
    canonicalSolution,
    hint:
      input.topic === 'stack'
        ? 'Ngăn xếp: index 0 là TOP. PUSH vào đầu, POP lấy ở đầu.'
        : 'Hàng đợi: index 0 là FRONT. ENQUEUE vào cuối, DEQUEUE lấy ở đầu.',
    explanation: 'Mục tiêu là đưa trạng thái về đúng trạng thái đích bằng chuỗi thao tác hợp lệ.',
  };
}

export function generateRepairPuzzle(input: GenerateInput): RepairPuzzle {
  const base = generateTargetPuzzle(input);
  const derivedSeed = hash32(`${input.seed}|${input.topic}|${input.difficulty}|S2_REPAIR`);
  const rng = mulberry32(derivedSeed);
  const buggy = [...base.canonicalSolution];
  const idx = Math.floor(rng() * buggy.length);
  buggy[idx] = mutateOperation(buggy[idx]);

  return {
    ...base,
    id: `${base.id}-repair`,
    buggySequence: buggy,
    minFixCount: 1,
    hint: 'Có 1-2 thao tác bị sai, hãy sửa lại chuỗi để đạt trạng thái đích.',
    explanation: 'S2 yêu cầu sửa chuỗi thao tác bị lỗi với số thay đổi tối thiểu.',
  };
}

export function evaluateTargetPuzzle(puzzle: TargetPuzzle, userOps: string[]): TargetJudgeResult {
  const user = applyOperations(puzzle.initialState, userOps, puzzle.topic);
  const canonical = applyOperations(puzzle.initialState, puzzle.canonicalSolution, puzzle.topic);

  let divergenceIndex: number | undefined;
  const minLen = Math.min(user.frames.length, canonical.frames.length);
  for (let i = 0; i < minLen; i += 1) {
    if (serializeState(user.frames[i], puzzle.topic) !== serializeState(canonical.frames[i], puzzle.topic)) {
      divergenceIndex = i;
      break;
    }
  }

  const isCorrect =
    user.invalidStepIndex === undefined &&
    serializeState(user.finalState, puzzle.topic) === serializeState(puzzle.targetState, puzzle.topic);

  return {
    isCorrect,
    usedSteps: userOps.length,
    invalidStepIndex: user.invalidStepIndex,
    divergenceIndex,
    replayFrames: user.frames.map((frame) => serializeState(frame, puzzle.topic)),
  };
}

export function evaluateRepairPuzzle(puzzle: RepairPuzzle, userOps: string[]): RepairJudgeResult {
  const target = evaluateTargetPuzzle(puzzle, userOps);
  const editCount = levenshteinOps(puzzle.buggySequence, userOps);
  const withinTolerance = editCount <= puzzle.minFixCount + 1;

  return {
    ...target,
    editCount,
    isCorrect: target.isCorrect && withinTolerance,
  };
}

export function generateMinimalMovesPuzzle(input: GenerateInput): MinimalMovesPuzzle {
  const base = generateTargetPuzzle(input);
  const onboarding = input.difficulty <= 2 ? 1 : 0;

  return {
    ...base,
    id: `${base.id}-min`,
    maxSteps: base.canonicalSolution.length + onboarding,
    hint: 'Đạt trạng thái đích với số bước tối đa. Ưu tiên thao tác cần thiết.',
    explanation: 'S3 yêu cầu đúng trạng thái đích và không vượt giới hạn bước.',
  };
}

export function evaluateMinimalMovesPuzzle(
  puzzle: MinimalMovesPuzzle,
  userOps: string[]
): MinimalMovesJudgeResult {
  const base = evaluateTargetPuzzle(puzzle, userOps);
  const hitStepBudget = userOps.length <= puzzle.maxSteps;

  return {
    ...base,
    hitStepBudget,
    isCorrect: base.isCorrect && hitStepBudget,
  };
}
