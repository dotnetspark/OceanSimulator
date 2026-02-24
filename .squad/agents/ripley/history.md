# Project Context

- **Owner:** Yadel Lopez
- **Project:** Ocean Simulator — full-stack marine ecosystem simulator
- **Stack:** C# (.NET 8), Clean Architecture (Domain/Application/Infrastructure/API), xUnit, React 18, TypeScript, Vite, Recharts, Playwright, Jest
- **Created:** 2026-02-23T05:49:07.623Z

## Overview

The Ocean Simulator models a marine ecosystem as a 2D grid. Species include Plankton, Sardine, Shark, Crab, and Reef. Dead specimens (DeadSardine, DeadShark) are distinct entities. The simulation evolves through Snapshots — each specimen moves once per Snapshot in randomized order. Offspring created during a Snapshot don't move until the next.

**Key behaviors:**
- Plankton: moves to random Water cell, breeds on movement
- Sardine: eats Plankton, moves to Water, breeds, starves (energy counter)
- Shark: eats Sardine, attacks adjacent Sharks when starving, breeds, starves (energy counter)
- Crab: eats dead specimens, moves to Water, does not breed or die
- Reef: static obstacle

**Architecture pattern mandates:** Strategy Pattern for behavior, Factory for creation, Template Method for Snapshot execution, Repository for persistence, Observer for real-time UI events. All randomness via IRandomProvider.

## Learnings

### 2026-02-23: Project scaffolding complete
- Created .NET solution with 5 projects: Domain, Application, Infrastructure, Api, Tests
- Project references: Application → Domain, Infrastructure → Application+Domain, Api → Application+Infrastructure, Tests → all three
- Domain interfaces define all contracts: ISpecimen, IOcean, IRandomProvider, IMovementStrategy, IFeedingStrategy, IBreedingStrategy, IStarvationStrategy, IAttackStrategy, ISpecimenFactory, ISnapshotOrchestrator, IOceanRepository, IOceanEventPublisher
- Domain value objects: Position (with GetAdjacentPositions), SpecimenType enum
- Domain events: SpecimenMovedEvent, SpecimenBornEvent, SpecimenDiedEvent, SpecimenAteEvent, SnapshotCompletedEvent
- Frontend: Vite + React + TypeScript with folder structure for components (grid/controls/stats/species), hooks, types, services
- TypeScript types defined in simulation.types.ts: SpecimenType, Position, Cell, OceanGrid, PopulationCounts, SnapshotResult, SimulationConfig, SimulationState, OceanEvent
- NuGet packages: Microsoft.AspNetCore.SignalR (Api), Moq, coverlet.collector (Tests)
- npm packages: recharts, @types/recharts
- Key file paths:
  - Backend: C:\Users\ylrre\source\repos\OceanSimulator\backend\OceanSimulator.sln
  - Domain interfaces: backend\OceanSimulator.Domain\Interfaces\
  - Frontend types: frontend\src\types\simulation.types.ts

### 2026-02-23: PR review, SOLID audit, and documentation complete
- Reviewed PRs #21 (visual), #22 (frontend), #23 (backend), #24 (tests) — all approved
- All four PRs merged to main in order: visual → frontend → backend → tests
- Domain layer has ZERO external dependencies — Clean Architecture boundary verified
- Behavior is embedded in entities via polymorphic ExecuteMove, not via separate Strategy classes — conscious tradeoff documented in decisions.md
- IRandomProvider properly injected everywhere; no direct System.Random in Domain
- SnapshotOrchestrator implements Template Method correctly
- Dead specimens (DeadSardine, DeadShark) are real entities — not null/flag patterns
- SpecimenFactory creates all types from config
- **Tech debt identified:** SnapshotOrchestrator.CreateOffspring duplicates SpecimenFactory switch logic — should inject ISpecimenFactory
- **Tech debt identified:** colorTheme prop on SVG components declared but unused
- Frontend: zero `any` types, proper component/hook separation, typed API layer
- Tests: MockRandomProvider is queue-based deterministic; 65+ backend tests spec-driven; some weak assertions in orchestrator tests
- Created docs/ARCHITECTURE.md (SOLID audit, pattern inventory, species matrix, entity hierarchy)
- Created README.md (getting started, testing, species reference)
- Closed issues #1-17, #19, #20

### 2026-02-23: Documentation enhanced with Mermaid diagrams
- Updated README.md and docs/ARCHITECTURE.md with GitHub-compatible Mermaid diagrams
- Clean Architecture layers: replaced ASCII boxes with `graph TB` showing dependency direction (API→Infra→App→Domain)
- Design patterns: replaced table with `graph LR` for visual pattern relationships (6 patterns: Polymorphism, Factory, Template Method, Observer, Repository, Builder)
- Entity hierarchy: replaced text tree with `classDiagram` showing inheritance (Specimen base → LivingSpecimen/Crab/Reef → EnergeticSpecimen → concrete species)
- Species behavior: preserved behavior matrix table, added `stateDiagram-v2` for individual specimen movement/breeding/starvation state machine
- Snapshot execution: added `flowchart TD` showing 6-step template method (Get→Shuffle→Iterate→Reset→Count→Publish) with key insight about offspring deferral
- Food chain: added `graph LR` showing Plankton→Sardine→Shark→Dead→Crab predator-prey relationships
- Frontend component tree: added `graph TD` showing SimulationView as hub connecting Controls, OceanGrid, StatsPanel
- Tech stack: added `graph TB` showing React/TypeScript/Vite at frontend, SignalR/API layer, C#/.NET 8 backend, testing validation loops
- **Pattern:** Mermaid diagrams are focused (one concept per diagram), use emoji for visual cues, include inline styling for color-coding by layer/concern. All prose preserved; diagrams are additive.

<!-- Append new learnings below. Each entry is something lasting about the project. -->

📌 Team update (2026-02-23T21-30-00Z): Parker moved controls to footer, increased header height; Lambert redesigned StatsPanel as floating glass overlay; Bishop replaced charts with derived metrics (Ecosystem Balance, Population Pulse, Current Distribution) — documented all decisions in architecture diagrams, added 3 to README, 5 to docs/ARCHITECTURE.md. — decided by Parker, Lambert, Bishop
