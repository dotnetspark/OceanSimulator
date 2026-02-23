# Project Context

- **Owner:** Yadel Lopez
- **Project:** Ocean Simulator — full-stack marine ecosystem simulator
- **Stack:** C# (.NET 8), Clean Architecture (Domain/Application/Infrastructure/API), xUnit, React 18, TypeScript, Vite, Recharts, Playwright, Jest
- **Created:** 2026-02-23T05:49:07.623Z

## Overview

The Ocean Simulator models a marine ecosystem as a 2D grid. Species include Plankton, Sardine, Shark, Crab, and Reef. Dead specimens (DeadSardine, DeadShark) are distinct entities. The simulation evolves through Snapshots — each specimen moves once per Snapshot in randomized order.

**Testing responsibilities (Ash owns):**

Backend (xUnit):
- All species movement strategy logic (8 directions, boundaries, blocked cells, no-valid-moves)
- Feeding (Sardine eats Plankton, Shark eats Sardine)
- Breeding (counter increment, threshold trigger, offspring placement, reset)
- Starvation (energy decrement, death at 0, dead specimen creation)
- Shark attack resolution (weight comparison, winner/loser, reset)
- Crab consumption (dead specimen removal)
- Snapshot execution (random ordering, offspring don't move same turn)
- IRandomProvider mock for deterministic sequences
- SpecimenFactory output correctness
- Serialization round-trip (save → deserialize → identical grid)

Frontend (Jest):
- UI component rendering
- State management transitions
- Graph data handling

End-to-End (Playwright):
- Full simulation flow from UI initialization through N Snapshots
- Save/restore state round-trip
- Extinction stopping conditions
- Live graph updates
- Layout/responsiveness

**Key test design:** Use mock IRandomProvider to make all randomized behavior deterministic in tests. Test the spec, not the implementation.

## Learnings

### 2026-02-23: Initial comprehensive test suite (PR #24)
- Created 65+ tests covering all species behavior from spec
- MockRandomProvider: Deterministic testing of all random behavior with queue-based int/double provision
- OceanTestBuilder: Simplified test ocean creation
- Backend tests: PlanktonBehaviorTests (6 tests), SardineBehaviorTests (9 tests), SharkBehaviorTests (9 tests), CrabBehaviorTests (7 tests)
- Application layer: SnapshotOrchestratorTests (9 tests), SpecimenFactoryTests (11 tests)
- Integration: SerializationTests (7 tests placeholder), MultiSnapshotTests (6 tests)
- Frontend: Vitest + React Testing Library setup, GridCell/SimulationControls/ConfigPanel mock tests
- 58 tests passing, 7 failures expected due to incomplete implementation by Dallas
- SimulationConfig is a record type requiring positional parameters, not object initializer
- Tests compile cleanly and define expected behavior for ongoing implementation

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-02-23: Playwright E2E test suite (PR #25)
- 10 comprehensive E2E test cases covering full user workflows
- TC1-10 validate: config form, grid initialization, snapshot execution, graph updates, save/load, extinction logic, layout panels
- Playwright config with auto-start dev server (webServer: npm run dev at localhost:5173)
- data-testid attributes surgically added to all interactive elements without breaking existing code
- ConfigPanel: input-rows, input-cols, input-plankton, input-sardines, input-sharks, input-crabs, input-reefs, btn-start
- SimulationControls: btn-run-one, btn-run-n, input-n, btn-run-extinction, btn-run-event, btn-save, input-load-file, snapshot-number
- OceanGrid: ocean-grid, cell-{row}-{col} for each cell (position-aware)
- StatsPanel: stats-panel, count-{species} for each species card, population-graph, birth-death-graph
- App.tsx: left-panel, right-panel
- GridCell updated to accept Cell object instead of just SpecimenType for position data
- npm scripts: test:e2e (headless), test:e2e:ui (interactive)
- Chromium browser installed via npx playwright install chromium
- Tests validate state persistence round-trip (save → reload → restore)
- Extinction test validates simulation stops when species extinct (small grid, high predator density)
- Graph tests validate Recharts SVG rendering after N snapshots
- Branch: squad/18-playwright-e2e based on squad/8-9-10-11-frontend
