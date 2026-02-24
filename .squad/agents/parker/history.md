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

### 2026-02-24: Major UX Overhaul — Layout, Navigation, Controls

- **Layout ratio**: Changed `3fr 2fr` → `65fr 35fr` grid for ocean to dominate (~65%) and stats to stay readable (~35%)
- **Hamburger menu**: Replaced scattered header button + SimulationControls Save/Load with a single ☰ menu in the header top-right; uses `useRef` + `mousedown` event for click-outside dismissal
- **Controls moved to stats panel**: `<SimulationControls>` rendered inside `<StatsPanel>` via a `controls?: ReactNode` prop — avoids prop drilling and keeps StatsPanel generic
- **Left panel simplified**: Ocean grid now takes the full left-panel height with no controls row below; cleaner visual focus
- **SimulationControls leaner**: Removed `snapshotNumber`, `onSave`, `onLoad` props; removed "State" section; renamed "Until Event" → "Until Birth or Death"; improved extinction UI to show `[Species dropdown] [Run Until Extinct]`
- **useGridDiff hook**: New `frontend/src/hooks/useGridDiff.ts` — compares previous vs current `OceanGrid` by reference change; returns `Map<string, CellChangeType>` keyed by `${row}-${col}`; change types: `born | died | moved | unchanged`
- **Grid + Cell animation surface**: `OceanGrid` accepts optional `changedCells` prop; `GridCell` accepts `animState?: CellChangeType` and applies `data-anim={animState}` — Lambert's CSS can now target `[data-anim="born"]`, `[data-anim="died"]`, etc.
- **verbatimModuleSyntax**: All new type imports use `import type { X }` form; no violations
- **void operator**: Used `void sim.saveState()` and `void sim.loadState(f)` to satisfy TS strict no-floating-promises in event handlers

- **Removed Tailwind classes**: Switched to inline styles using palette colors for better visual consistency and easier maintainability
- **CSS cleanup**: Removed Vite boilerplate and light mode styles; set proper background colors from palette; removed centering that broke layout
- **App header**: Added persistent header with branding, "New Simulation" reset button, and live snapshot counter
- **Layout improvement**: Changed from 50/50 split to 3fr/2fr grid for better grid visibility; removed gaps for cleaner edges
- **ConfigPanel redesign**: Ocean-themed hero section, species emojis on all inputs, sliders + number inputs for better UX, color-coded species using palette
- **SimulationControls redesign**: Grouped controls into "Step", "Auto-run", and "State" sections; added pulsing indicator for running state; removed snapshot number display (now in header); added emojis and better button hierarchy
- **StatsPanel redesign**: Species cards now show emojis with counts in a more compact 2-column grid; better visual hierarchy
- **Color consistency**: All components now consistently use palette.background, palette.panelBg, palette.accent, and species colors
- **UX improvements**: Sliders for intuitive value selection, visual running state feedback, clearer button labels with icons, better spacing and visual grouping

### 2026-02-24: Tailwind CSS Migration + UX Improvements

- **Tailwind migration**: Converted all key components from inline styles to Tailwind utility classes while preserving exact visual appearance
- **Components converted**: App.tsx (header, layout, error banner), GridCell.tsx, OceanGrid.tsx, StatsPanel.tsx, SimulationControls.tsx (container, GroupLabel, running indicator)
- **Smart hybrid approach**: Used Tailwind for static styles; kept inline `style={{}}` only where dynamic values required (grid column ratios, cell dimensions)
- **Color palette preserved**: Maintained existing color system using Tailwind arbitrary values like `bg-[#0a1628]`, `text-[#00b4d8]`, `border-[rgba(0,180,216,0.2)]`
- **Animation cleanup**: Removed inline `@keyframes pulse` from SimulationControls; replaced with Tailwind's built-in `animate-pulse` class for running indicator
- **Animations import**: Added `@import './styles/animations.css'` at top of `index.css` (before @tailwind directives) to support Lambert's CSS animations for cell state changes
- **Grid sizing fix**: Improved OceanGrid cell sizing from hardcoded 600px reference to viewport-based calculation (`window.innerWidth * 0.60` / `window.innerHeight * 0.85`) — cells now scale properly to available space (18-52px range instead of 20-40px)
- **TypeScript compliance**: All changes pass `tsc --noEmit` with strict mode + verbatimModuleSyntax enabled
- **Maintainability win**: Tailwind utility classes reduce visual noise, improve consistency, and make responsive design easier if needed later

### 2026-02-23: Tailwind Migration + Grid Scaling Fix + Lambert Coordination
- **Tailwind migration completed**: Converted App, GridCell, OceanGrid, StatsPanel, SimulationControls to Tailwind utility classes; preserved exact visual appearance
- **Critical UX win**: Grid cell sizing now viewport-aware (18-52px range, scales to actual window dimensions) instead of hardcoded 600px; on 1440px screens, cells now ~46px vs. 30px before
- **Animation import**: Added `@import './styles/animations.css'` to `index.css` before @tailwind directives, enabling Lambert's CSS animations for cell state changes via `data-anim` attributes
- **Cross-agent**: Lambert completed SVG CSS refactor (centralized keyframes, removed 400+ duplicate style tags), redesigned species for readability, improved charts (split Prey/Predators, mirrored BirthDeathGraph)
- **TypeScript compliance**: Zero errors with strict mode + verbatimModuleSyntax

### 2026-02-24: UX Refinements — Header, Footer Controls, Layout
- **Header improvements**: Increased height from `h-14` (56px) to `h-16` (64px); app title now `text-2xl font-bold`; snapshot counter `text-sm`; hamburger button enlarged to 40×40px hit area with better padding (`px-4 py-2.5 text-xl`)
- **Menu item sizing**: Dropdown menu items now use `py-3` (12px vertical padding) instead of `py-[11px]` for comfortable touch targets
- **Footer-based controls**: Moved `SimulationControls` from StatsPanel to a fixed bottom footer (`fixed bottom-0 left-0 right-0 z-20`); only visible when simulation started
- **SimulationControls variants**: Added `variant?: 'sidebar' | 'footer'` prop; footer variant uses horizontal flexbox (`flex flex-row gap-4 items-center flex-wrap`) for single-row layout; sidebar variant retains vertical layout with grouped sections
- **Layout adjustment**: Main content height now `h-[calc(100vh-64px-72px)]` to account for both header (64px) and footer (72px) without overlap
- **StatsPanel independence**: Removed `controls?: ReactNode` prop from StatsPanel since controls now live in footer; StatsPanel is now a pure floating glass overlay
- **Key files**: `frontend/src/App.tsx`, `frontend/src/components/controls/SimulationControls.tsx`, `frontend/src/components/stats/StatsPanel.tsx`
- **TypeScript compliance**: Zero errors with strict mode + verbatimModuleSyntax

📌 Team update (2026-02-23T21-30-00Z): Lambert redesigned StatsPanel as floating glass overlay; Bishop replaced charts with ecosystem metrics (Ecosystem Balance, Population Pulse); Ripley added Mermaid architecture diagrams — coordinated footer layout with Lambert, confirmed charts fit within panel, charts use existing palette colors. — decided by Lambert, Bishop, Ripley

### 2026-02-24: Aspire Service Discovery Proxy Configuration
- **Aspire env var format**: When AppHost uses `.AddViteApp().WithReference(api)`, Aspire injects service discovery env vars in the format: `services__api__https__0` and `services__api__http__0` (lowercase, double underscores)
- **Vite proxy setup**: Updated `vite.config.ts` to read `services__api__https__0` (prefer HTTPS) or fallback to `services__api__http__0`; proxy only activates when `apiTarget` is set (i.e., running under Aspire)
- **Host binding**: Added `host: true` to Vite server config for Aspire port forwarding compatibility (binds to all interfaces, not just localhost)
- **Standalone dev**: When running Vite standalone (no Aspire), `apiTarget` is undefined → proxy is disabled → frontend dev server works but API calls will fail until backend is running separately
- **Hardcoded API URLs found**: `frontend/src/services/simulationApi.ts` uses `VITE_API_URL ?? 'http://localhost:5030'`; `frontend/src/hooks/useSignalR.ts` uses `VITE_API_URL ?? 'http://localhost:5000'` (different port!); these need updating to use relative paths (`/api`) to leverage the proxy
- **Key file**: `frontend/vite.config.ts`

### 2026-02-24: Relative API Paths Migration
- **API base URL**: Changed `simulationApi.ts` from hardcoded `http://localhost:5030` to empty string `''` (relative paths) — now uses `/api/...` paths through Vite proxy and YARP
- **SignalR hub URL**: Changed `useSignalR.ts` from hardcoded `http://localhost:5000/hubs/simulation` to `/hubs/simulation` (relative path)
- **Proxy compatibility**: Both files now respect `VITE_API_URL` env var if set, otherwise default to relative paths that work through Aspire's Vite proxy (dev) and YARP (production)
- **SignalR proxy note**: SignalR WebSocket connections to `/hubs/simulation` may need a separate proxy entry in `vite.config.ts` if they fail to connect — `/api` proxy only handles HTTP requests, WebSocket upgrades may require dedicated config
- **TypeScript compliance**: All changes pass `tsc --noEmit` with strict mode enabled
- **Key files**: `frontend/src/services/simulationApi.ts`, `frontend/src/hooks/useSignalR.ts`

📌 Team update (2026-02-24T11-56-52.193Z): Merged four Aspire/Vite decisions from inbox. Kane fixed AppHost with AddNpmApp+WithReference. Parker configured vite.config.ts for service discovery proxy. Removed obsolete early Vite proxy decision (superseded by proper YARP+AddNpmApp+proxy architecture). Clear separation: YARP handles external traffic, AddNpmApp injects env vars, Vite proxy uses those vars for dev. Follow-up needed: update hardcoded localhost URLs in simulationApi.ts and useSignalR.ts to use relative paths. — decided by Kane, Parker

### 2026-02-24: Undefined Grid Prop Bug Fix
- **Type mismatch**: `OceanGridProps.grid` was typed as non-nullable `OceanGridType`, but `SimulationState.grid` is `OceanGrid | null` — runtime type mismatch caused crash on line 43 when calling `grid.cells.flat()` before simulation data loaded
- **Fix**: Changed `OceanGridProps.grid` type to `OceanGridType | null | undefined`; added early return with loading message when `grid` is falsy
- **Pattern**: Always align component prop types with the actual state shape that feeds them; nullable state → nullable props
- **User experience**: Component now renders gracefully ("Loading ocean…") instead of crashing when grid data hasn't arrived yet
- **TypeScript compliance**: Zero errors with strict mode + verbatimModuleSyntax after fix
- **Key file**: `frontend/src/components/grid/OceanGrid.tsx`


