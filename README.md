# Ocean Simulator

A full-stack marine ecosystem simulator. A 2D grid of ocean cells evolves through **Snapshots** — each specimen moves once per snapshot in randomized order, following species-specific predator-prey behaviors.

## Stack

```mermaid
graph TB
    UI["React 18<br/>TypeScript<br/>Vite"]
    API["SignalR Hub<br/>REST API"]
    BL["Clean Architecture<br/>C# .NET 8"]
    Test["xUnit, Vitest<br/>Playwright"]
    
    UI -->|WebSocket/HTTP| API
    API -->|Orchestration| BL
    Test -.->|Validates| BL
    Test -.->|E2E Tests| UI
    
    style UI fill:#61dafb,color:#000
    style API fill:#512bd4,color:#fff
    style BL fill:#512bd4,color:#fff
    style Test fill:#ffd43b,color:#000
```

## Species & Food Chain

```mermaid
graph LR
    Plankton["🌿 Plankton<br/>Random movement<br/>Breeds always"]
    Sardine["🐟 Sardine<br/>Eats Plankton<br/>Starves if hungry"]
    Shark["🦈 Shark<br/>Eats Sardines<br/>Attacks rivals when hungry"]
    Crab["🦀 Crab<br/>Scavenges dead<br/>Immortal"]
    Reef["🪨 Reef<br/>Static obstacle"]
    Dead["💀 Dead Bodies<br/>Crab food"]
    
    Plankton -->|Eaten by| Sardine
    Sardine -->|Eaten by| Shark
    Sardine -->|Dies| Dead
    Shark -->|Dies| Dead
    Dead -->|Consumed by| Crab
    
    style Plankton fill:#90EE90
    style Sardine fill:#FFB6C1
    style Shark fill:#FF6347
    style Crab fill:#FFD700
    style Reef fill:#A9A9A9
    style Dead fill:#8B0000,color:#fff
```

**Species Behaviors:**
- **Plankton:** Moves to random Water cell, breeds on every move
- **Sardine:** Eats Plankton or moves to Water, starves without food
- **Shark:** Eats Sardines, attacks rival Sharks when starving, breeds
- **Crab:** Scavenges dead specimens; cannot starve or breed
- **Reef:** Static obstacle; never moves

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- (Optional) Visual Studio 2022 or VS Code

### Quick Start with .NET Aspire (Recommended)

The easiest way to run the full stack locally:

```bash
cd backend
dotnet run --project OceanSimulator.AppHost
```

This launches the **Aspire Dashboard** at `http://localhost:15299` (or similar), which orchestrates:
- Backend API (with auto-assigned port and service discovery)
- Vite frontend dev server (port 5173)
- Telemetry, logs, and health checks in one unified dashboard

### Run Projects Individually (Alternative)

#### Backend

```bash
cd backend
dotnet restore
dotnet run --project OceanSimulator.Api
# API available at http://localhost:5030
# Swagger UI at http://localhost:5030/swagger
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # edit VITE_API_URL if needed
npm run dev
# App at http://localhost:5173
```

#### Run Both (Manual Method)

```bash
# Terminal 1 — backend
cd backend && dotnet run --project OceanSimulator.Api

# Terminal 2 — frontend
cd frontend && npm run dev
```

## Testing

### Backend unit + integration tests

```bash
cd backend
dotnet test
```

### Frontend unit tests (Vitest)

```bash
cd frontend
npm run test
```

### End-to-end tests (Playwright)

```bash
# Start backend and frontend first, then:
cd frontend
npx playwright test
```

## Architecture

### Frontend Component Tree

```mermaid
graph TD
    App["App<br/>(main entry)"]
    SimView["SimulationView<br/>(state + hooks)"]
    Controls["Controls<br/>(form & buttons)"]
    Grid["OceanGrid<br/>(SVG rendering)"]
    GridCell["GridCell×N²<br/>(cell + species)"]
    StatsPanel["StatsPanel<br/>(population graphs)"]
    Species["Species Components<br/>(Plankton, Sardine, etc)"]
    
    App --> SimView
    SimView --> Controls
    SimView --> Grid
    SimView --> StatsPanel
    Grid --> GridCell
    GridCell --> Species
    
    style App fill:#61dafb,color:#000
    style SimView fill:#61dafb,color:#000
    style Controls fill:#87CEEB,color:#000
    style Grid fill:#87CEEB,color:#000
    style GridCell fill:#B0E0E6,color:#000
    style StatsPanel fill:#87CEEB,color:#000
    style Species fill:#E0FFFF,color:#000
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full Clean Architecture diagram, design pattern inventory, species behavior matrix, and snapshot execution flow.

## Extending

### Add a new species
Follow the steps in [docs/ARCHITECTURE.md#adding-a-new-species](docs/ARCHITECTURE.md#adding-a-new-species).
All behavior is polymorphic — no existing code changes required except registration in `SpecimenFactory` and the SVG component.

### Modify breeding / starvation rules
Edit the relevant entity's `ExecuteMove` method in `OceanSimulator.Domain/Entities/`. No other changes needed.

## License

MIT
