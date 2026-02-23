# Project Context

- **Owner:** Yadel Lopez
- **Project:** Ocean Simulator — full-stack marine ecosystem simulator
- **Stack:** C# (.NET 8), Clean Architecture (Domain/Application/Infrastructure/API), xUnit, React 18, TypeScript, Vite, Recharts, Playwright, Jest
- **Created:** 2026-02-23T05:49:07.623Z

## Overview

The Ocean Simulator models a marine ecosystem as a 2D grid. Species include Plankton, Sardine, Shark, Crab, and Reef. Dead specimens (DeadSardine, DeadShark) are distinct entities.

**Visual responsibilities (Lambert owns):**

SVG species components (JSX, NOT string blobs):
- `<PlanktonSvg />` — translucent, pulsing, floating feel
- `<SardineSvg />` — sleek, silver-blue, small fish
- `<SharkSvg />` — angular, dark, dominant presence
- `<CrabSvg />` — compact, clawed, distinctly bottom-dwelling
- `<ReefSvg />` — stylized coral/rock, not overly detailed
- `<DeadSardineSvg />` / `<DeadSharkSvg />` — faded palette, X-eyes

All SVG components accept props: `size`, `animated`, `animState`.

Recharts graph components:
- Population over time (all species on one chart)
- Births per Snapshot
- Deaths per Snapshot
- Energy distribution for Sardines
- Energy distribution for Sharks

Color palette must be consistent across SVGs and graphs. All species share a visual world.

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

- **2026-02-23**: SVG animations in React work best with CSS keyframes embedded in `<style>` tags within the SVG. Using `animationEnabled` prop allows users to toggle animations for performance or accessibility. Each species has a distinct animation signature (pulse, sway, fin movement) to reinforce visual identity.

- **2026-02-23**: Color palette consistency is critical across SVGs and Recharts. Using a centralized `palette.ts` ensures species colors match in both grid cells and population graphs, creating visual coherence.

- **2026-02-23**: Dead variants use desaturated colors + X-eyes visual metaphor. This clearly communicates state without animation, saving render cycles.

- **2026-02-23**: ViewBox optimization for small sizes is essential. Changed from 32x32 to 24x24 viewBox to make SVGs crisper at typical 20-24px grid cell sizes. Shapes need to be simplified for readability at small scale — fewer details, bolder strokes.

- **2026-02-23**: CSS animation states (`animState` prop) with values 'born', 'dying', 'moving' enable transition effects without JavaScript timers. Using `animation: X Yms forwards` with CSS class swaps is cleaner than imperative animation control.

- **2026-02-23**: Pie charts with species SVG icons as legend items create stronger visual consistency than emoji. The `<Icon size={16} animated={false} />` pattern ensures icons display consistently across all platforms and reinforce species identity.

- **2026-02-23**: Inline `<style>` tags in SVGs cause severe performance and conflict issues when rendering many components (e.g., 400 cells = 400 duplicate `<style>` tags with conflicting keyframe names). Solution: extract ALL shared keyframes and animation classes to a single global CSS file (`animations.css`), import once at app entry point. Use CSS class composition (`species-born`, `sardine-idle`, etc.) and a `.anim-paused` modifier for play state control.

- **2026-02-23**: SVG readability at small sizes (20-30px) requires bold, iconic design: max 5 elements per species, high-contrast fills, distinctive silhouettes. Remove fine details (gill slits, belly highlights, legs) that become invisible noise. Each species needs ONE key visual identifier: plankton=glowing circle, sardine=teardrop+eye, shark=prominent dorsal fin, crab=claw bumps.

- **2026-02-23**: Population charts with wildly different scales (plankton=200 vs shark=5) need separate Y-axes. Split into stacked mini-charts (Prey/Predators) with independent scales using `AreaChart`. For births/deaths trends, use mirrored bar chart (births positive, deaths negative) with `ReferenceLine y={0}` to clearly show net population flow.

### 2026-02-23: SVG CSS Refactor + Chart UX Complete
- **Completed**: Centralized all SVG keyframes to `frontend/src/styles/animations.css` (shared, single source of truth); removed 400+ duplicate `<style>` tags from SVG components
- **SVG redesign**: Simplified each species to ≤5 bold, iconic elements for 20-30px readability; eliminated animation conflicts entirely
- **Chart improvements**: PopulationGraph split into Prey/Predators mini-charts; BirthDeathGraph now mirrored flow chart with ReferenceLine
- **Cross-agent**: Parker added `@import './styles/animations.css'` to `index.css` and migrated components to Tailwind; animation surface (`data-anim` attributes) now available for cell state targeting
