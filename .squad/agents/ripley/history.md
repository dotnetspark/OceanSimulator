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

<!-- Append new learnings below. Each entry is something lasting about the project. -->
