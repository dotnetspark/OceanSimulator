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
