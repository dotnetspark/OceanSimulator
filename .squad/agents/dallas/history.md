# Project Context

- **Owner:** Yadel Lopez
- **Project:** Ocean Simulator — full-stack marine ecosystem simulator
- **Stack:** C# (.NET 8), Clean Architecture (Domain/Application/Infrastructure/API), xUnit, React 18, TypeScript, Vite, Recharts, Playwright, Jest
- **Created:** 2026-02-23T05:49:07.623Z

## Overview

The Ocean Simulator models a marine ecosystem as a 2D grid. Species include Plankton, Sardine, Shark, Crab, and Reef. Dead specimens (DeadSardine, DeadShark) are distinct entities. The simulation evolves through Snapshots — each specimen moves once per Snapshot in randomized order. Offspring created during a Snapshot don't move until the next.

**Backend responsibilities (Dallas owns):**
- Domain: Specimen entities, ocean grid, cell state, interfaces, value objects
- Application: Snapshot orchestrator, use cases, SpecimenFactory, OceanBuilder
- Infrastructure: IRandomProvider implementation, JSON serialization, file-based Repository
- API: REST controllers for simulation control, WebSocket/SignalR for real-time events, DTOs

**Required patterns:** Strategy (behavior), Factory (creation), Template Method (Snapshot flow), Repository (persistence), Observer (real-time events), State (energy/breeding counters).

**IRandomProvider:** Must be injectable. All randomness (movement direction, attack outcome, specimen ordering) goes through this interface for determinism when seeded.

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-02-23: Backend Implementation Complete (Issues #1-7)

**What was built:**
- Domain layer: Complete specimen hierarchy (Specimen → LivingSpecimen → EnergeticSpecimen)
  - Entities: Plankton, Sardine, Shark, Crab, Reef, DeadSardine, DeadShark
  - Ocean grid implementation with 8-directional adjacency
  - All behavior embedded in specimen ExecuteMove methods
  
- Application layer:
  - SpecimenFactory (creates specimens with configured thresholds)
  - OceanBuilder (random ocean initialization with seeded shuffle)
  - SnapshotOrchestrator (Template Method: get specimens → shuffle → process → reset flags → collect counts → publish)
  
- Infrastructure layer:
  - SeededRandomProvider (Fisher-Yates shuffle, deterministic when seeded)
  - JsonOceanRepository (full state serialization preserving all counters)
  
- API layer:
  - SimulationController (initialize, snapshot, snapshots/{n}, state, save, load, run/extinction, run/event)
  - SimulationHub (SignalR for real-time events)
  - SignalREventPublisher (implements IOceanEventPublisher)
  - SimulationService (holds current ocean state as singleton)
  - Program.cs (CORS for http://localhost:5173, DI registration)

**Key decisions:**
- Species behavior is self-contained in ExecuteMove methods (no separate strategy classes yet)
- Breeding logic integrated into SnapshotOrchestrator (checks breeding counter after move)
- Offspring are marked HasMovedThisSnapshot=true so they don't move in current snapshot
- Death creates corpse entities (DeadSardine, DeadShark) that Crabs consume
- Shark attack: weight comparison, higher weight wins, tie → attacker wins
- Ocean uses internal ISpecimen?[,] grid + List<ISpecimen> for fast queries

**File paths:**
- Domain: `backend/OceanSimulator.Domain/Entities/{Specimen,LivingSpecimen,EnergeticSpecimen,Plankton,Sardine,Shark,Crab,Reef,DeadSardine,DeadShark,Ocean}.cs`
- Application: `backend/OceanSimulator.Application/{Factories/SpecimenFactory,Factories/OceanBuilder,Orchestrators/SnapshotOrchestrator,DTOs/SimulationConfig}.cs`
- Infrastructure: `backend/OceanSimulator.Infrastructure/{Random/SeededRandomProvider,Serialization/JsonOceanRepository}.cs`
- API: `backend/OceanSimulator.Api/{Controllers/SimulationController,Hubs/SimulationHub,Services/SimulationService,Program}.cs`

**PR:** https://github.com/dotnetspark/OceanSimulator/pull/23

### 2026-02-23: Replaced ISpecimen?[,] grid with Dictionary<Position, ISpecimen>

**What changed:**
- `Ocean._grid` is now `Dictionary<Position, ISpecimen>` instead of `ISpecimen?[rows, cols]`
- `GetSpecimenAt` uses `TryGetValue`; absent key = Water (null)
- `SetSpecimenAt` calls `_grid.Remove` on null, `_grid[pos] = specimen` otherwise
- Constructor no longer allocates the 2D array; field initializer handles it
- `_specimens` list unchanged — still used for O(n) iteration over living specimens

**Key insight:**
- `Position` is a C# `record` → auto-generates correct `Equals` + `GetHashCode` based on (Row, Col) values. No manual override needed.
- Water is implicit: a cell not in the dictionary is Water. Zero memory overhead for empty cells.
- All public methods (`GetCellType`, `GetEmptyCells`, `GetAdjacentCellsOfType`, etc.) delegate to `GetSpecimenAt` — no changes needed there.
- Build: 0 errors, 0 warnings.

### 2026-02-23: Fixed API response shapes for frontend grid rendering

**Problem:**
- Frontend couldn't render grid because API returned wrong shapes
- `initialize` returned `{ message, rows, cols }` but frontend expected full `OceanGrid` with `cells[][]`
- `snapshot` returned `SnapshotResult` with PascalCase enum keys in populationCounts but frontend expected camelCase flat object
- `snapshot` had no `grid` field
- `run/extinction` returned `{ iterations, results[] }` but frontend expected single final `SnapshotResult`

**Solution:**
- Added `BuildGridResponse(IOcean ocean)` helper that iterates rows × cols and builds:
  ```csharp
  { rows, cols, cells: [[{ position: { row, col }, specimenType: "Water", specimenId: "..." }]] }
  ```
- Fixed `initialize` to return full grid response after `_simulationService.Initialize(config)`
- Fixed `snapshot` to include `grid` field and transform populationCounts from `Dictionary<SpecimenType, int>` to camelCase flat object
- Fixed `run/extinction` to return only the last snapshot result with grid (not array of results)
- Fixed `save` to return JSON blob as file download (no body parameter)
- Marked `load` as TODO — needs stream-based repository support for IFormFile uploads

**Key files modified:**
- `backend/OceanSimulator.Api/Controllers/SimulationController.cs`

**Commit:** c861150

