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

All SVG components accept props: `size`, `colorTheme`, `animationEnabled`.

Recharts graph components:
- Population over time (all species on one chart)
- Births per Snapshot
- Deaths per Snapshot
- Energy distribution for Sardines
- Energy distribution for Sharks

Color palette must be consistent across SVGs and graphs. All species share a visual world.

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
