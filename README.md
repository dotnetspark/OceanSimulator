# Ocean Simulator

A full-stack marine ecosystem simulator. A 2D grid of ocean cells evolves through **Snapshots** — each specimen moves once per snapshot in randomized order, following species-specific predator-prey behaviors.

## Stack

| Layer | Tech |
|-------|------|
| Backend | C# .NET 8, Clean Architecture, SignalR |
| Frontend | React 18, TypeScript, Vite, Recharts |
| Testing | xUnit, Vitest, Playwright |

## Species

| Species | Behavior |
|---------|----------|
| 🌿 Plankton | Moves to random Water cell, breeds |
| 🐟 Sardine | Eats Plankton, else moves; starves without food |
| 🦈 Shark | Eats Sardines; attacks rival Sharks when starving; starves |
| 🦀 Crab | Scavenges dead specimens; immortal |
| 🪨 Reef | Static obstacle |

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- (Optional) Visual Studio 2022 or VS Code

### Backend

```bash
cd backend
dotnet restore
dotnet run --project OceanSimulator.Api
# API available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # edit VITE_API_URL if needed
npm run dev
# App at http://localhost:5173
```

### Run Both

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

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full Clean Architecture diagram, design pattern inventory, and species behavior matrix.

## Extending

### Add a new species
Follow the steps in [docs/ARCHITECTURE.md#adding-a-new-species](docs/ARCHITECTURE.md#adding-a-new-species).
All behavior is polymorphic — no existing code changes required except registration in `SpecimenFactory` and the SVG component.

### Modify breeding / starvation rules
Edit the relevant entity's `ExecuteMove` method in `OceanSimulator.Domain/Entities/`. No other changes needed.

## License

MIT
