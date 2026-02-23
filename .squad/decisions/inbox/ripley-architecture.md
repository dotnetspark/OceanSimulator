### 2026-02-23: Architecture decisions for Ocean Simulator
**By:** Ripley
**What:**
- Clean Architecture with 4 layers: Domain, Application, Infrastructure, API
- Domain layer has ZERO dependencies on outer layers
- All species behavior via Strategy Pattern (IMovementStrategy, IFeedingStrategy, IBreedingStrategy, IStarvationStrategy, IAttackStrategy)
- All randomness via IRandomProvider — simulation deterministic when seeded
- Dead specimens are distinct entities (DeadSardine, DeadShark), not null states
- Real-time events via SignalR WebSocket
- Frontend: Vite + React 18 + TypeScript strict mode
- Backend: .NET 8 WebAPI with CORS enabled for frontend
- Save/restore via JSON serialization through IOceanRepository
**Why:** SOLID compliance requires all behavior polymorphic via interfaces. No god classes. No nested conditionals.
