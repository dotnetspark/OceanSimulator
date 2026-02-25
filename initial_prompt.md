# Ocean Simulator — Full Project Prompt

## Overview
Implement a full‑stack Ocean Simulator consisting of:

- **Backend:** C# using Clean Architecture, SOLID principles, and appropriate design patterns  
- **Frontend:** React + TypeScript with a modern, slick UI  
- **Simulation Engine:** Deterministic, extensible, pattern‑driven  
- **Visualization:** Real‑time grid + right‑panel graphs  
- **Testing:** Comprehensive unit, integration, and Playwright e2e coverage  

The system models a marine ecosystem represented as a 2D matrix of cells. Each cell may contain:

- Water (empty)
- Reef (obstacle)
- Living specimens: Plankton, Sardine, Shark, Crab
- Dead specimens: Sardine or Shark

The simulation evolves through **Snapshots**, where each specimen moves once in randomized order.

---

# Backend Requirements (C#)

## Architecture
Use **Clean Architecture** with the following layers:

- **Domain**  
  Entities, value objects, interfaces, behavior strategies, domain events  
- **Application**  
  Use cases, orchestrators, Snapshot engine, factories  
- **Infrastructure**  
  Persistence, serialization, file I/O, random provider  
- **API**  
  Controllers, DTOs, WebSocket/event endpoints  

## Design Principles
- Apply **SOLID** rigorously  
- No nested conditionals for species behavior  
- No hardcoded rules inside a single "god class"  
- All behavior must be polymorphic and strategy‑driven  
- All randomness must be injected via an interface (e.g., `IRandomProvider`)  
- Simulation must be deterministic when seeded  

## Required Design Patterns
Use patterns where appropriate, including:

- **Strategy Pattern**  
  Movement, feeding, breeding, starvation, attack behavior  
- **Factory Pattern**  
  Specimen creation  
- **Abstract Factory / Builder**  
  Ocean initialization  
- **Observer / Event Aggregator**  
  Real‑time UI updates  
- **Template Method**  
  Snapshot execution flow  
- **State Pattern**  
  Energy, starvation, breeding counters (optional but encouraged)  
- **Repository Pattern**  
  Save/restore simulation state  

---

# Species Rules and Behaviors

## Breeding
- Plankton, Sardines, and Sharks have a breeding counter starting at 0.
- When a specimen reaches its species-specific breeding threshold *during movement*, it spawns a new specimen in a valid adjacent cell.
- After reproduction, the breeding counter resets.

## Starvation
- Sardines and Sharks have an energy counter and an energy threshold.
- Energy starts at the threshold.
- Moving without eating decreases energy by 1.
- Eating resets energy to the threshold.
- If energy reaches 0, the specimen dies and becomes a dead specimen in its last position.

## Movement and Feeding
Movement is always to one of the eight adjacent cells.

### Reef
- Does not move; blocks movement.

### Plankton
- Moves to a random unoccupied cell (Water).
- Increases breeding counter when moving.
- If no unoccupied cells exist, it stays still.

### Sardine
- Prioritizes adjacent Plankton to eat.
  - Eating resets energy, increases breeding counter, and moves.
- If no Plankton is available:
  - Moves to a random unoccupied cell (decrease energy, increase breeding counter).
- If no valid moves exist, it stays still.

### Shark
- Prioritizes adjacent Sardines to eat.
  - Eating resets energy, increases breeding counter, and moves.
- If no Sardines are present and starvation is imminent:
  - Attempts to attack an adjacent Shark.
  - Attack success is determined by weight (Sharks gain weight as they eat).
  - Winner survives, resets energy, increases breeding counter; loser is removed.
- If starvation is not imminent:
  - Moves to a random unoccupied cell (increase breeding counter).

### Crab
- Prioritizes adjacent dead specimens to consume.
  - Consuming removes the dead specimen and moves.
- Otherwise moves to a random unoccupied cell.
- Crabs do not reproduce and do not die.

---

# Species Visual Design (SVG)

## SVG Requirements
All species must be represented using **custom SVG illustrations** rendered in React.  
The SVGs must be:

- Clean, modern, and visually distinct  
- Scalable without pixelation  
- Easily themeable (colors, stroke widths, animations)  
- Lightweight and optimized for performance  
- Designed to be recognizable at small grid sizes  

## Visual Style Guidelines
- Use simple geometric shapes with smooth curves  
- Use a consistent color palette across species  
- Provide subtle animations (optional):  
  - Gentle fin movement  
  - Slight bobbing  
  - Pulse for Plankton  
- Dead specimens should have a visually distinct "faded" or "X‑eye" style  
- Reefs should be stylized but not overly detailed  

## Implementation Notes
- Each species should have its own React component (e.g., `<SharkSvg />`)  
- Components must accept props for:  
  - Size  
  - Color theme  
  - Optional animation toggle  
- Avoid embedding large inline SVG strings; use JSX‑based SVG elements  

---

# Simulation Flow

## Snapshots
- Simulation begins with Snapshot 0: random distribution of all species and reefs.
- Each Snapshot processes all specimens in random order.
- Offspring created during a Snapshot do not move until the next Snapshot.

## Iterations
- An iteration completes when all specimens have moved at least once.

---

# UI Requirements (React + TypeScript)

## Layout
- **Left panel:** ocean grid visualization  
- **Right panel:** real‑time statistics panel with graphs  

## Required UI Features
- Inputs for:
  - Ocean dimensions (rows, columns)
  - Initial counts for each species
  - Breeding thresholds
  - Energy thresholds
- Display:
  - Current population counts
  - Real-time grid visualization
- Simulation controls:
  - Run 1 Snapshot
  - Run N Snapshots
  - Run until a species goes extinct (1 or all)
  - Run until next birth or death
  - Save simulation state to file
  - Restore simulation from file

## Stats Panel Requirements
- Real-time graphs that update as the simulation runs.
- Required graphs:
  - Population over time (line chart per species)
  - Birth/death events per snapshot (bar chart)
  - Current population distribution (pie or donut chart)
- Stats should be visually distinct and color‑coded per species.

## UI/UX Guidelines
- Modern dark theme (ocean‑inspired palette)
- Smooth animations for grid updates
- Responsive layout
- Clean typography and spacing
- Loading states and error boundaries

---

# Technical Stack

## Backend
- .NET 10 (C#)
- ASP.NET Core Web API
- Clean Architecture structure
- xUnit for unit and integration tests
- JSON serialization for state persistence

## Frontend
- React 18+
- TypeScript
- Vite
- Recharts or Chart.js for graphs
- CSS Modules or Tailwind CSS

## Orchestration
- .NET Aspire for local dev orchestration
- YARP reverse proxy for API routing

## Testing
- xUnit (backend unit + integration)
- Vitest (frontend unit)
- Playwright (e2e)

## CI/CD
- GitHub Actions
- PR build gating on all tests
- Branch protection on main

---

# Additional Requirements

## Code Quality
- No magic numbers — use named constants
- XML documentation on public APIs
- Consistent naming conventions
- No commented-out code in final deliverable

## Error Handling
- Global exception handler in API
- Meaningful error messages
- Graceful degradation on frontend

## Performance
- Ocean stored as `Dictionary<Position, ISpecimen>` for O(1) lookup
- Avoid unnecessary allocations in hot paths
- Snapshot processing should handle 100x100 grids smoothly

## GitHub
- All work tracked via GitHub Issues
- PRs linked to issues
- CI pipeline gates merges
- Branch protection on main (require PR + passing checks)
- README with badges for CI, license, runtime versions
