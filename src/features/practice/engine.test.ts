import { describe, expect, it } from 'vitest';
import {
  evaluateAnswer,
  getModeForRound,
  getNextDifficulty,
  computeRewards,
  type Challenge,
} from './engine';

describe('practice engine', () => {
  it('follows ladder A-A-B-A-B-C', () => {
    expect(getModeForRound(0)).toBe('A');
    expect(getModeForRound(1)).toBe('A');
    expect(getModeForRound(2)).toBe('B');
    expect(getModeForRound(3)).toBe('A');
    expect(getModeForRound(4)).toBe('B');
    expect(getModeForRound(5)).toBe('C');
    expect(getModeForRound(6)).toBe('A');
  });

  it('evaluates mode A answer correctly', () => {
    const challenge: Challenge = {
      id: 'a1',
      mode: 'A',
      topic: 'stack',
      prompt: 'Pick operation',
      expected: 'push',
      options: ['push', 'pop', 'peek', 'clear'],
      hint: 'hint',
      explanation: 'explanation',
      replaySteps: ['a', 'b'],
    };
    expect(evaluateAnswer(challenge, 'push')).toBe(true);
    expect(evaluateAnswer(challenge, 'pop')).toBe(false);
  });

  it('evaluates mode B/C list answers', () => {
    const challenge: Challenge = {
      id: 'b1',
      mode: 'B',
      topic: 'queue',
      prompt: 'Sort steps',
      expected: ['enqueue A', 'enqueue B', 'dequeue'],
      hint: 'hint',
      explanation: 'explanation',
      replaySteps: ['a', 'b'],
    };
    expect(evaluateAnswer(challenge, ['enqueue A', 'enqueue B', 'dequeue'])).toBe(true);
    expect(evaluateAnswer(challenge, ['enqueue B', 'enqueue A', 'dequeue'])).toBe(false);
  });

  it('computes rewards with combo and penalties', () => {
    expect(computeRewards(true, 0)).toBe(10);
    expect(computeRewards(true, 3)).toBe(16);
    expect(computeRewards(false, 5)).toBe(-5);
  });

  it('raises difficulty every 4 rounds', () => {
    expect(getNextDifficulty(1, 0)).toBe(1);
    expect(getNextDifficulty(1, 3)).toBe(1);
    expect(getNextDifficulty(1, 4)).toBe(2);
  });
});
