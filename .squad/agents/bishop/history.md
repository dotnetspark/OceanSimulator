# Bishop — Project History

## Project Context

- **Project:** Ocean Simulator — full-stack marine ecosystem simulation
- **Owner:** Yadel Lopez
- **Stack:** C# (.NET 8) backend, React 18 + TypeScript frontend, Recharts, Vite
- **Description:** 2D grid world with Plankton, Sardines, Sharks, Crabs, and Reefs evolving through Snapshots with predator-prey dynamics, breeding, and starvation mechanics.

## Team

- Ripley — Lead
- Dallas — Backend Dev
- Parker — Frontend Dev
- Lambert — Visual Designer
- Ash — Tester
- Bishop — Data Analyst (me)

## Key Files

- `frontend/src/components/stats/StatsPanel.tsx` — stats panel container
- `frontend/src/components/stats/PopulationGraph.tsx` — population over time charts
- `frontend/src/components/stats/BirthDeathGraph.tsx` — birth/death flow chart
- `frontend/src/components/stats/PopulationPieChart.tsx` — current distribution pie chart
- `frontend/src/styles/palette.ts` — color palette (use these for chart colors)
- `frontend/src/hooks/useSimulation.ts` — exposes `state.populationHistory`, `state.birthsHistory`, `state.deathsHistory`

## Available Data (from SimulationState)

- `populationHistory`: `Array<{ snapshot: number; plankton: number; sardine: number; shark: number; crab: number }>`
- `birthsHistory`: `Array<{ snapshot: number; births: number }>`
- `deathsHistory`: `Array<{ snapshot: number; deaths: number }>`
- `snapshotNumber`: current snapshot number

## Learnings

### Session 1: Chart Redesign (2026-02-23)

**Replaced charts with meaningful ecosystem metrics:**

1. **PopulationGraph → Ecosystem Balance (🌊)**
   - Old: Two separate area charts (prey vs predators) showing raw counts
   - New: LineChart showing predator pressure ratio and prey abundance fraction
   - Data transformation: `predatorPressure = sharks / (sardines + plankton + 0.001)`, `preyAbundance = (sardines + plankton) / totalPopulation`
   - Answers: "Is the predator-prey balance healthy or collapsing?"
   - Colors: shark red for predator pressure, plankton green for prey abundance

2. **BirthDeathGraph → Population Pulse (📈)**
   - Old: Mirrored bar chart (births up, deaths down as negatives)
   - New: Single bar chart showing net change (births - deaths) with conditional coloring
   - Data transformation: `net = births - deaths` per snapshot
   - Colors: green if net > 0 (growth), red if net < 0 (decline), grey if 0
   - Tooltip: "+N new" or "−N lost" format
   - Answers: "Is the total population growing, shrinking, or stable?"

3. **PopulationPieChart → Current Distribution (🔵)**
   - Kept existing donut chart but improved tooltips
   - Added emoji + percentage format: "🌿 Plankton: 142 (45%)"
   - Empty state: "Ocean is empty" when total is 0
   - Already had center label showing total population
   - Answers: "Who currently dominates the ocean?"

**Design decisions:**
- Each chart answers exactly one specific question (critical thinking applied)
- Used existing palette colors (plankton, shark, success, buttonDanger)
- All charts have meaningful empty states with clear messaging
- Height standardized to 160px for consistency
- Kept all `data-testid` attributes for test stability
- No new dependencies — pure Recharts refactor

**TypeScript validation:** Clean compile, no errors.

📌 Team update (2026-02-23T21-30-00Z): Parker moved controls to footer, increased header to h-16; Lambert redesigned StatsPanel as floating glass overlay with collapse toggle; Ripley added Mermaid architecture diagrams — charts fit within floating panel, all colors from existing palette, species badges provide context. — decided by Parker, Lambert, Ripley
