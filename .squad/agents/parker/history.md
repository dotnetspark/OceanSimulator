# Project Context

- **Owner:** Yadel Lopez
- **Project:** Ocean Simulator — full-stack marine ecosystem simulator
- **Stack:** C# (.NET 8), Clean Architecture (Domain/Application/Infrastructure/API), xUnit, React 18, TypeScript, Vite, Recharts, Playwright, Jest
- **Created:** 2026-02-23T05:49:07.623Z

## Overview

The Ocean Simulator models a marine ecosystem as a 2D grid. Species include Plankton, Sardine, Shark, Crab, and Reef. Dead specimens (DeadSardine, DeadShark) are distinct entities. The simulation evolves through Snapshots in randomized order.

**Frontend responsibilities (Parker owns):**
- React + TypeScript app (Vite), strict TypeScript
- Left panel: 2D ocean grid — each cell renders a species SVG component (from Lambert)
- Right panel: real-time stats with Recharts graphs (from Lambert)
- Simulation controls: Run 1 Snapshot, Run N Snapshots, Run until extinction (1 or all), Run until next birth/death
- Configuration inputs: dimensions, initial counts per species, breeding thresholds, energy thresholds
- Current population count display
- WebSocket/SignalR client for real-time backend events
- Save/restore state (file upload/download flow)

**Coordination point:** Parker builds the shell; Lambert provides `<PlanktonSvg />`, `<SardineSvg />`, `<SharkSvg />`, `<CrabSvg />`, `<ReefSvg />`, dead variants, and all Recharts graph components.

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
