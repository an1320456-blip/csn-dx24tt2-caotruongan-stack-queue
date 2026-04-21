# Stack/Queue Puzzle Track Design

## Goal
Add a new puzzle-focused learning track that improves problem solving for Stack/Queue through three progressive game stages:
1. Target State Puzzle
2. Buggy Sequence Repair
3. Minimal Moves Challenge

This track should be highly replayable using seeded random generation while staying deterministic for debugging and review.

## Scope
- In scope:
  - New puzzle generation and judging pipeline for Stack/Queue.
  - Stage progression S1 -> S2 -> S3.
  - Seed-based reproducible puzzles.
  - Replay frames + explanation feedback.
  - Local persistence for puzzle track progress.
- Out of scope (later phases):
  - Global leaderboard/multiplayer.
  - Server-side analytics.
  - Mission-map narrative content.

## Product Design
### Stage S1: Target State Puzzle
- Input: initial state + target state + allowed operations.
- User task: submit operation sequence to reach target state.
- Success: final state equals target state.

### Stage S2: Buggy Sequence Repair
- Input: near-correct sequence with 1-2 injected mistakes.
- User task: repair sequence with minimal edits.
- Success:
  - Repaired sequence reaches target state.
  - Edit count is within tolerance from minimal fixes.

### Stage S3: Minimal Moves Challenge
- Input: target state + strict step budget.
- User task: reach target state within max steps.
- Success:
  - Final state correct.
  - Used steps <= max steps.

## Architecture
### Core modules
- `puzzleGenerator`
  - Generates stage-specific puzzle payloads.
  - Uses `(seed, topic, difficulty, stage)` to produce deterministic output.
- `puzzleJudge`
  - Simulates operations.
  - Evaluates correctness, invalid operations, efficiency, and constraints.
  - Returns replay frames and feedback code.
- `practiceSessionEngine`
  - Manages score/combo/streak/difficulty progression.
  - Advances stage and round based on judge results.

### UI modules
- Reuse `PracticePage` shell.
- Add:
  - `StageBadge`
  - `ConstraintPanel`
  - `ReplayPanel` (user path vs canonical path with divergence point)
  - `FeedbackPanel` (error reason + explanation)

## Data Model
```ts
type PuzzleStage = 'S1_TARGET' | 'S2_REPAIR' | 'S3_MIN_MOVES';
type Topic = 'stack' | 'queue';

interface PuzzleChallenge {
  id: string;
  seed: number;
  stage: PuzzleStage;
  topic: Topic;
  difficulty: number;
  initialState: string[];
  targetState: string[];
  allowedOps: string[];
  canonicalSolution: string[];
  maxSteps?: number;
  buggySequence?: string[];
  minFixCount?: number; // required when stage is S2_REPAIR
  hint: string;
  explanation: string;
}

interface JudgeResult {
  isCorrect: boolean;
  efficiencyScore: number;
  feedbackCode: string;
  invalidStepIndex?: number;
  usedSteps: number;
  replayFrames: string[][];
  divergenceIndex?: number;
}
```

## Operation Contract
- Stack ops:
  - `PUSH:<value>`
  - `POP`
- Queue ops:
  - `ENQUEUE:<value>`
  - `DEQUEUE`
- Allowed values come from challenge payload only (no new values by user).
- `peek/front/swap` are not part of judged operation sequences in puzzle track v1.

## State Semantics
- Canonical serialization for equality/replay:
  - Stack: array index `0` is `TOP`.
  - Queue: array index `0` is `FRONT`.
- Replay, judge, and UI must all use this same orientation.

## Generation Strategy
- Use deterministic PRNG from seed.
- PRNG algorithm: `mulberry32`.
- Seed derivation:
  - `derivedSeed = hash32("${seed}|${topic}|${difficulty}|${stage}")`
  - All random branching in generator uses only this derived seed stream.
- Validate generated puzzle solvability before returning.
- If unsolvable:
  - Retry with next seed up to 3 times.
  - Fallback to curated puzzle template.
- Canonical solution determinism:
  - Use fixed search order by operation type.
  - If multiple optimal solutions exist, tie-break lexicographically by op string.

## Judging Strategy
- Simulate operation sequence step by step.
- Detect invalid operation early (`pop/dequeue` on empty state).
- Compare final state with target.
- Stage-specific rules:
  - S1: state match only.
  - S2: state match + edit rule `editCount <= minFixCount + 1`.
  - S3: state match + step budget enforcement.
- `efficiencyScore`:
  - S1/S2: informational bonus only.
  - S3: does not override pass/fail; pass/fail is strictly based on `usedSteps <= maxSteps`.

## Deterministic Edit Distance (S2)
- `editCount` uses operation-level Levenshtein distance.
- Unit operations and costs:
  - insert operation: cost 1
  - delete operation: cost 1
  - replace operation: cost 1
- `minFixCount` is computed as:
  - minimal operation-level Levenshtein distance from `buggySequence` to any valid solution sequence that reaches target state.
  - if multiple valid targets exist, use the minimal distance among canonical-tie-broken candidates.

## Difficulty Scaling
- Low difficulty:
  - 2-3 elements, short solution path, fewer distractors.
- Mid difficulty:
  - 4-5 elements, mixed distractors, moderate branching.
- High difficulty:
  - 6+ elements, tighter constraints, minimal-step pressure.

## Search Bounds and Performance Safety
- Generator/judge search constraints:
  - max depth: 24 operations
  - max visited states per puzzle: 10,000
  - max search time budget per puzzle generation: 50ms (soft cap)
- On bound/time exhaustion:
  - mark attempt invalid
  - continue retry flow (up to 3 seeds)
  - fallback to curated puzzle if still unresolved

## S3 Solvability Contract
- Any generated S3 puzzle must satisfy:
  - exists at least one valid solution where `steps <= maxSteps`.
- `maxSteps` is set from known optimal path length:
  - `maxSteps = optimalSteps` for strict levels
  - `maxSteps = optimalSteps + 1` for lower onboarding levels
- If no solvable puzzle can be generated with this contract after 3 retries:
  - fallback to curated S3 puzzle that satisfies the contract.

## Persistence
- Store puzzle track separately in localStorage key:
  - `practice_puzzle_track_v1_<topic>`
- Persist:
  - stage progress
  - difficulty
  - latest seed
  - rolling performance summary
- On schema version mismatch:
  - attempt lightweight migration if supported
  - else reset puzzle track payload only (do not touch other practice data)

## Error Handling
- Corrupted storage: reset puzzle track only.
- Invalid operations: fail gracefully with targeted feedback.
- Replay mismatch: fallback to textual replay.
- Generation failure after retries: use curated fallback challenge.

## Testing Plan
- Unit tests for `puzzleGenerator`:
  - deterministic by seed
  - solvable output
  - difficulty progression behavior
- Unit tests for `puzzleJudge`:
  - correct/incorrect state outcomes
  - invalid operation detection
  - minimal moves enforcement
  - bug repair edit threshold
- Integration tests:
  - S1 -> S2 -> S3 progression
  - feedback correctness for each fail type
  - skip/reset/retry transition behavior
- UI smoke:
  - render stage panels
  - submit/skip/reset flow
  - replay rendering
- Additional regression tests:
  - fallback path after 3 failed generation attempts
  - storage corruption + version mismatch handling
  - determinism snapshot: same `(seed, topic, difficulty, stage)` => same puzzle
  - S2 edit-distance boundaries (insert/delete/replace combinations)
  - replay integrity (`invalidStepIndex`, `divergenceIndex`, frame count consistency)

## Implementation Plan
### Phase 1 (start now)
- Implement S1 end-to-end:
  - seeded challenge generation
  - judge simulation
  - replay and feedback panels
- Keep S2/S3 interfaces scaffolded.

### Phase 2
- Implement S2 repair logic (bug injection + min fixes).

### Phase 3
- Implement S3 minimal-moves constraints and strict scoring.

## Success Criteria
- Users can finish S1 rounds with clear understanding of LIFO/FIFO transitions.
- Generated puzzles are reproducible and debuggable by seed.
- Replay clearly shows divergence from canonical path.
- Lint/tests/build remain green after each phase.
