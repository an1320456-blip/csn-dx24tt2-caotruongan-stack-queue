export type PracticeMode = 'A' | 'B' | 'C';
export type PracticeTopic = 'stack' | 'queue';

export interface Challenge {
  id: string;
  mode: PracticeMode;
  topic: PracticeTopic;
  prompt: string;
  expected: string | string[];
  options?: string[];
  hint: string;
  explanation: string;
  replaySteps: string[];
}

export interface SessionState {
  round: number;
  score: number;
  combo: number;
  streak: number;
  difficulty: number;
}

const LADDER: PracticeMode[] = ['A', 'A', 'B', 'A', 'B', 'C'];

export function getModeForRound(round: number): PracticeMode {
  return LADDER[round % LADDER.length];
}

export function evaluateAnswer(challenge: Challenge, answer: string | string[]): boolean {
  if (typeof challenge.expected === 'string') {
    return challenge.expected === answer;
  }

  if (!Array.isArray(answer)) return false;
  if (answer.length !== challenge.expected.length) return false;
  return challenge.expected.every((step, idx) => step === answer[idx]);
}

export function computeRewards(isCorrect: boolean, combo: number): number {
  if (!isCorrect) return -5;
  return 10 + Math.min(combo, 5) * 2;
}

export function getNextDifficulty(currentDifficulty: number, round: number): number {
  if (round > 0 && round % 4 === 0) {
    return currentDifficulty + 1;
  }
  return currentDifficulty;
}

export function nextSessionState(prev: SessionState, isCorrect: boolean): SessionState {
  const nextCombo = isCorrect ? prev.combo + 1 : 0;
  const nextStreak = isCorrect ? prev.streak + 1 : 0;
  const nextRound = prev.round + 1;

  return {
    round: nextRound,
    combo: nextCombo,
    streak: nextStreak,
    score: Math.max(0, prev.score + computeRewards(isCorrect, prev.combo)),
    difficulty: getNextDifficulty(prev.difficulty, nextRound),
  };
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function buildModeA(topic: PracticeTopic): Challenge {
  if (topic === 'stack') {
    return {
      id: randomId(),
      mode: 'A',
      topic,
      prompt: 'Đưa phần tử X vào Stack, thao tác nào đúng?',
      expected: 'push',
      options: ['push', 'pop', 'peek', 'clear'],
      hint: 'Stack theo LIFO: muốn thêm phần tử thì cần thao tác đưa vào đỉnh.',
      explanation: 'Với Stack, thao tác thêm phần tử mới luôn là push(x).',
      replaySteps: ['stack = []', 'push(X)', 'stack = [X] (X ở TOP)'],
    };
  }
  return {
    id: randomId(),
    mode: 'A',
    topic,
    prompt: 'Thêm khách mới vào cuối hàng đợi, thao tác nào đúng?',
    expected: 'enqueue',
    options: ['enqueue', 'dequeue', 'front', 'clear'],
    hint: 'Queue theo FIFO: người mới phải vào cuối hàng.',
    explanation: 'Với Queue, thao tác thêm phần tử vào cuối hàng là enqueue(x).',
    replaySteps: ['queue = []', 'enqueue(X)', 'queue = [X] (X ở TAIL)'],
  };
}

function buildModeB(topic: PracticeTopic): Challenge {
  if (topic === 'stack') {
    return {
      id: randomId(),
      mode: 'B',
      topic,
      prompt: 'Sắp xếp thao tác để lấy ra A từ stack ban đầu rỗng.',
      expected: ['push A', 'peek', 'pop'],
      hint: 'Muốn lấy A ra thì trước hết A phải được đưa vào stack.',
      explanation: 'Chuỗi đúng là push A -> peek -> pop để quan sát rồi lấy A ra.',
      replaySteps: ['stack = []', 'push A => [A]', 'peek => A', 'pop => []'],
    };
  }
  return {
    id: randomId(),
    mode: 'B',
    topic,
    prompt: 'Sắp xếp thao tác theo FIFO để phục vụ khách đầu tiên.',
    expected: ['enqueue A', 'enqueue B', 'dequeue'],
    hint: 'FIFO: vào trước sẽ ra trước.',
    explanation: 'A vào trước nên dequeue đầu tiên sẽ lấy ra A.',
    replaySteps: ['queue = []', 'enqueue A => [A]', 'enqueue B => [A, B]', 'dequeue => [B]'],
  };
}

function buildModeC(topic: PracticeTopic): Challenge {
  if (topic === 'stack') {
    return {
      id: randomId(),
      mode: 'C',
      topic,
      prompt: 'Chuỗi nào sửa đúng để còn lại B ở top sau cùng?',
      expected: ['push A', 'push B', 'pop'],
      options: ['push A > pop > push B', 'push A > push B > pop', 'pop > push A > push B'],
      hint: 'Để có B ở top rồi pop, B phải được push sau A.',
      explanation: 'Chuỗi đúng là push A -> push B -> pop, khi pop sẽ lấy B ra trước.',
      replaySteps: ['stack = []', 'push A => [A]', 'push B => [B, A]', 'pop => [A]'],
    };
  }
  return {
    id: randomId(),
    mode: 'C',
    topic,
    prompt: 'Chuỗi nào đúng để phục vụ người đến trước?',
    expected: ['enqueue A', 'enqueue B', 'dequeue'],
    options: ['enqueue B > enqueue A > dequeue', 'enqueue A > enqueue B > dequeue', 'dequeue > enqueue A > enqueue B'],
    hint: 'A phải vào hàng trước B.',
    explanation: 'enqueue A -> enqueue B -> dequeue sẽ phục vụ đúng người vào trước.',
    replaySteps: ['queue = []', 'enqueue A => [A]', 'enqueue B => [A, B]', 'dequeue => [B]'],
  };
}

export function generateChallenge(round: number, topic: PracticeTopic): Challenge {
  const mode = getModeForRound(round);
  if (mode === 'A') return buildModeA(topic);
  if (mode === 'B') return buildModeB(topic);
  return buildModeC(topic);
}
