import { describe, expect, it } from 'vitest';
import {
  applyOperations,
  evaluateMinimalMovesPuzzle,
  evaluateRepairPuzzle,
  evaluateTargetPuzzle,
  generateMinimalMovesPuzzle,
  generateRepairPuzzle,
  generateTargetPuzzle,
  serializeState,
  type PuzzleTopic,
} from './puzzle';

describe('puzzle phase 1 - target state', () => {
  it('generates deterministic puzzle by seed/topic/difficulty', () => {
    const a = generateTargetPuzzle({ seed: 123, topic: 'stack', difficulty: 2 });
    const b = generateTargetPuzzle({ seed: 123, topic: 'stack', difficulty: 2 });

    expect(a.initialState).toEqual(b.initialState);
    expect(a.targetState).toEqual(b.targetState);
    expect(a.canonicalSolution).toEqual(b.canonicalSolution);
  });

  it('canonical solution always reaches target', () => {
    const puzzle = generateTargetPuzzle({ seed: 77, topic: 'queue', difficulty: 3 });
    const result = applyOperations(puzzle.initialState, puzzle.canonicalSolution, puzzle.topic);

    expect(result.invalidStepIndex).toBeUndefined();
    expect(result.finalState).toEqual(puzzle.targetState);
  });

  it('evaluates correct and incorrect answers', () => {
    const puzzle = generateTargetPuzzle({ seed: 1, topic: 'stack', difficulty: 1 });
    const ok = evaluateTargetPuzzle(puzzle, puzzle.canonicalSolution);
    const bad = evaluateTargetPuzzle(puzzle, [...puzzle.canonicalSolution].reverse());

    expect(ok.isCorrect).toBe(true);
    expect(bad.isCorrect).toBe(false);
  });

  it('marks invalid operations with index', () => {
    const topic: PuzzleTopic = 'queue';
    const result = applyOperations([], ['DEQUEUE'], topic);

    expect(result.invalidStepIndex).toBe(0);
    expect(result.finalState).toEqual([]);
  });

  it('serializes stack/queue with canonical orientation', () => {
    expect(serializeState(['A', 'B'], 'stack')).toBe('[TOP:A | B]');
    expect(serializeState(['A', 'B'], 'queue')).toBe('[FRONT:A | B]');
  });
});

describe('puzzle phase 2 - buggy sequence repair', () => {
  it('generates deterministic repair puzzle', () => {
    const a = generateRepairPuzzle({ seed: 44, topic: 'stack', difficulty: 2 });
    const b = generateRepairPuzzle({ seed: 44, topic: 'stack', difficulty: 2 });
    expect(a.buggySequence).toEqual(b.buggySequence);
    expect(a.minFixCount).toBe(b.minFixCount);
  });

  it('accepts canonical solution as repaired answer', () => {
    const puzzle = generateRepairPuzzle({ seed: 9, topic: 'queue', difficulty: 2 });
    const result = evaluateRepairPuzzle(puzzle, puzzle.canonicalSolution);
    expect(result.isCorrect).toBe(true);
    expect(result.editCount).toBeGreaterThanOrEqual(puzzle.minFixCount);
  });

  it('rejects invalid repair sequence', () => {
    const puzzle = generateRepairPuzzle({ seed: 9, topic: 'queue', difficulty: 2 });
    const result = evaluateRepairPuzzle(puzzle, ['DEQUEUE']);
    expect(result.isCorrect).toBe(false);
  });
});

describe('puzzle phase 3 - minimal moves', () => {
  it('generates deterministic minimal-moves puzzle', () => {
    const a = generateMinimalMovesPuzzle({ seed: 99, topic: 'stack', difficulty: 3 });
    const b = generateMinimalMovesPuzzle({ seed: 99, topic: 'stack', difficulty: 3 });
    expect(a.maxSteps).toBe(b.maxSteps);
    expect(a.targetState).toEqual(b.targetState);
  });

  it('passes when reaching target within max steps', () => {
    const puzzle = generateMinimalMovesPuzzle({ seed: 12, topic: 'queue', difficulty: 2 });
    const result = evaluateMinimalMovesPuzzle(puzzle, puzzle.canonicalSolution);
    expect(result.isCorrect).toBe(true);
  });

  it('fails when over max steps even if state is correct', () => {
    const puzzle = generateMinimalMovesPuzzle({ seed: 12, topic: 'queue', difficulty: 2 });
    const withExtra = [...puzzle.canonicalSolution, 'ENQUEUE:Z', 'DEQUEUE'];
    const result = evaluateMinimalMovesPuzzle(puzzle, withExtra);
    expect(result.hitStepBudget).toBe(false);
    expect(result.isCorrect).toBe(false);
  });
});
