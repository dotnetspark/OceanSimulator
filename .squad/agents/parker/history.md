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

### 2026-02-23: Frontend Shell Implementation
- **Architecture**: Reducer-based state management with `useSimulation` hook provides clean separation between UI and business logic
- **Grid rendering**: Adaptive cell sizing (20-40px) based on grid dimensions ensures optimal display for various grid sizes
- **Component structure**: Left panel (grid + controls) / Right panel (stats) layout works well for desktop-first simulation UX
- **SignalR integration**: Auto-reconnect pattern with `useRef` prevents connection loss during long-running simulations
- **File operations**: Save uses blob download with dynamic filename; Load uses hidden input pattern for cleaner UI
- **Lambert coordination**: StatsPanel already implemented with graph components; preserved existing work while adding required population display
- **TypeScript**: Strict typing with `simulation.types.ts` catches API contract mismatches at compile time
- **Ready for SVGs**: GridCell uses color mapping as placeholders; switching to Lambert's SVG components only requires updating the switch/map logic
