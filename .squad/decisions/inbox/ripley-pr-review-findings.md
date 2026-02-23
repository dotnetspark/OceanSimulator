# PR Review Findings — Ripley (Lead)

**Date:** 2026-02-23

## Architecture Decisions Confirmed

1. **Behavior Embedding (not Strategy Pattern):** The team chose to embed species behavior directly in `ExecuteMove` rather than extracting into separate `IMovementStrategy`, `IFeedingStrategy`, etc. classes. This is a **conscious tradeoff** — simpler for first iteration, polymorphic via inheritance. The Strategy Pattern interfaces exist in Domain but are unused. Decision: acceptable for now; refactor when adding 3+ new species.

2. **Dead Specimens as Entities:** DeadSardine and DeadShark are real entities with their own `SpecimenType`, not null states or flags. This enables clean Crab consumption logic. Good decision.

3. **Template Method in SnapshotOrchestrator:** Fixed 6-step pipeline. Clean, testable, deterministic. Approved as-is.

## Tech Debt Logged

### HIGH: SnapshotOrchestrator.CreateOffspring duplicates SpecimenFactory
- `SnapshotOrchestrator` has its own `CreateOffspring` private method with a switch on `SpecimenType`
- `SpecimenFactory` does the exact same thing
- **Fix:** Inject `ISpecimenFactory` into `SnapshotOrchestrator` and call `factory.Create()` instead
- **Risk if not fixed:** Two places to update when adding species

### LOW: colorTheme prop unused in SVG components
- All 7 SVG components declare `colorTheme?: 'default' | 'high-contrast'` but hardcode default colors
- **Fix:** Wire up when accessibility/high-contrast theme is implemented
- **Risk:** None currently

### MEDIUM: Frontend tests test mocks, not components
- Frontend test suites inline mock implementations rather than importing actual components
- **Fix:** Import real components, mock only API/SignalR dependencies
- **Risk:** Tests pass trivially but don't catch real rendering bugs

### LOW: Weak orchestrator test assertions
- Some SnapshotOrchestrator tests assert `>= 0` for births/deaths instead of exact values
- **Fix:** Use deterministic MockRandomProvider to assert exact counts
