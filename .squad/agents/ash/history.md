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

<!-- Append new learnings below. Each entry is something lasting about the project. -->
