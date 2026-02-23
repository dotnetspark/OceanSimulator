# Test Coverage Strategy

**Date:** 2026-02-23  
**Author:** Ash (Tester)  
**Status:** Implemented in PR #24

## Backend Test Coverage

### Domain Layer (Species Behavior)
**65 tests total** covering all species from specification:

- **PlanktonBehaviorTests** (6 tests): Movement to adjacent Water, staying still when blocked, breeding counter increment, offspring spawning at threshold, no breeding when no space
- **SardineBehaviorTests** (9 tests): Eating Plankton (priority 1), moving to Water (priority 2), energy decrement, death at energy=0, DeadSardine creation, breeding counter, staying still when blocked
- **SharkBehaviorTests** (9 tests): Eating Sardine (priority 1), attacking Shark when starving (priority 2), moving to Water (priority 3), weight comparison in attacks, death at energy=0, weight increment on eating, DeadShark creation
- **CrabBehaviorTests** (7 tests): Consuming DeadSardine/DeadShark (priority 1), moving to Water (priority 2), immortality (1000 snapshots without death), never breeding, staying still when blocked

### Application Layer
- **SnapshotOrchestratorTests** (9 tests): All specimens processed once, offspring skipped during same snapshot, deterministic with same seed, snapshot number increment, population counts, extinction detection, birth/death counting
- **SpecimenFactoryTests** (11 tests): Correct type creation for all SpecimenTypes, energy/breeding thresholds set from config, throws exception for Water type

### Integration Layer
- **SerializationTests** (7 tests): Preserves grid dimensions, specimen positions, energy counters, breeding counters, shark weight, dead specimens (placeholder for infrastructure implementation)
- **MultiSnapshotTests** (6 tests): Determinism with same seed over 10 snapshots, population decrease when predators outnumber prey, population increase with breeding, extinction detection, no duplication bugs, crab immortality over 50 snapshots

## Frontend Test Coverage

**Vitest + React Testing Library** setup with 3 component test suites:

- **GridCell.test.tsx** (5 tests): Renders all 8 SpecimenTypes without crashing, applies correct size, correct colors for Water/Plankton, correct data-testid
- **SimulationControls.test.tsx** (6 tests): onRunOne callback, onRunN callback with value, onRunToExtinction callback, buttons disabled when isRunning=true, buttons enabled when isRunning=false
- **ConfigPanel.test.tsx** (5 tests): Renders all input fields, calls onStart with correct config, disables/enables start button based on isRunning, default values set correctly

## Key Testing Patterns

### MockRandomProvider
Queue-based deterministic random provider:
- `_intQueue` for Next() calls
- `_doubleQueue` for NextDouble() calls
- Deterministic Shuffle() (reverse list)
- Allows exact reproduction of any random sequence for debugging

### OceanTestBuilder
Helper for creating test oceans:
- `CreateEmpty(rows, cols)` — empty ocean with water
- `CreateWithSpecimens(rows, cols, specimens[])` — ocean with specific specimens at positions
- Eliminates IoC container setup in unit tests

## Test Status
- **58 passing, 7 failing** (expected failures due to incomplete implementation)
- All tests compile cleanly
- Failures are in:
  - Shark death scenario (DeadShark not created correctly)
  - Shark priority (eating vs attacking)
  - Crab consumption (DeadShark not removed after eating)
  - Snapshot population count (breeding logic causing extra specimens)

## Decisions
1. **Test from spec, not implementation**: Tests define expected behavior before implementation is complete
2. **Deterministic randomness**: All random behavior testable via MockRandomProvider
3. **Minimal test helpers**: OceanTestBuilder only; no heavy test framework
4. **Frontend mocks as stubs**: Frontend tests use simple mock components until actual components are implemented
5. **Serialization placeholders**: Tests exist but pass trivially until infrastructure implements persistence

## Next Steps
1. Dallas fixes failing tests as part of implementation
2. Frontend tests updated once actual components exist
3. Serialization tests updated once persistence implemented
4. E2E Playwright tests added once API is live
