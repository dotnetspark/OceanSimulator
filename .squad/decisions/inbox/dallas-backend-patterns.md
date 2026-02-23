# Backend Architecture Patterns and Decisions

**Date:** 2026-02-23  
**Author:** Dallas (Backend Dev)  
**Context:** Implementation of Ocean Simulator backend (Issues #1-7)

## Architecture Pattern: Clean Architecture

**Decision:** Structured backend as Domain → Application → Infrastructure → API layers.

**Rationale:**
- Domain layer contains pure business logic (entities, interfaces, value objects)
- Application layer orchestrates domain logic (SnapshotOrchestrator, factories)
- Infrastructure provides technical implementations (SeededRandomProvider, JsonOceanRepository)
- API exposes HTTP + SignalR endpoints

**Benefit:** Clear separation of concerns, testable, maintainable.

---

## Pattern: Template Method in SnapshotOrchestrator

**Decision:** SnapshotOrchestrator uses Template Method pattern with defined steps:
1. GetMovableSpecimens (excludes HasMovedThisSnapshot)
2. ShuffleSpecimens (randomize order)
3. ProcessSpecimens (call ExecuteMove, handle breeding/deaths)
4. ResetMovementFlags (prepare for next snapshot)
5. CollectPopulationCounts
6. PublishEvent

**Rationale:** Snapshot flow is fixed, but each step can be customized or tested independently.

**Benefit:** Consistent execution order, easy to extend, testable.

---

## Pattern: Self-Contained Behavior in Entities

**Decision:** Species behavior (movement, eating, breeding checks, starvation) is embedded in each specimen's ExecuteMove method, not extracted into separate strategy classes.

**Rationale:**
- Spec describes behavior clearly for each species
- Simpler implementation for first iteration
- Can refactor to Strategy pattern later if needed

**Tradeoff:** Less flexible than Strategy pattern, but more readable and sufficient for current requirements.

---

## Design: Breeding Logic in Orchestrator

**Decision:** Breeding counter increment happens in ExecuteMove, but offspring creation is in SnapshotOrchestrator after move completes.

**Rationale:**
- Orchestrator can access ISpecimenFactory
- Offspring marked HasMovedThisSnapshot=true to prevent moving in same snapshot
- Consistent with spec: "offspring don't move until next snapshot"

**Alternative considered:** Let specimens breed themselves — rejected because they'd need factory dependency.

---

## Design: Death Creates Corpse Entities

**Decision:** When Sardine/Shark starves or is killed, it's removed and replaced with DeadSardine/DeadShark entity.

**Rationale:**
- Crabs need something to consume
- Dead specimens are distinct entities with Type, Position
- Ocean grid can hold any ISpecimen

**Benefit:** Clean semantics, no special "dead" flag on living specimens.

---

## Design: Shark Attack Weight Resolution

**Decision:** Shark-vs-Shark attack compares Weight property:
- Higher weight wins
- Equal weight → attacker wins
- Winner resets energy, loser is removed

**Rationale:** Spec defines this behavior explicitly.

---

## Infrastructure: SeededRandomProvider

**Decision:** IRandomProvider implemented with optional seed parameter. When seeded, uses System.Random(seed) for deterministic behavior.

**Rationale:**
- Testability: unit tests can use fixed seed
- Reproducibility: users can replay simulations with same seed
- Shuffle uses Fisher-Yates algorithm

---

## API: SimulationService as Singleton State Holder

**Decision:** SimulationService holds current IOcean, IRandomProvider, SimulationConfig as singleton in DI container.

**Rationale:**
- Single simulation session per API instance
- Controllers inject service to access current ocean state
- Simple state management for MVP

**Alternative considered:** Store ocean in database per session — deferred for later.

---

## API: SignalR for Real-Time Events

**Decision:** SignalREventPublisher implements IOceanEventPublisher, broadcasts events via SimulationHub.

**Rationale:**
- Frontend can subscribe to real-time updates
- Observer pattern decouples domain from API
- SignalR handles WebSocket connection management

**Benefit:** Clean separation, scalable for future event types.

---

## CORS Configuration

**Decision:** API configured with CORS for http://localhost:5173 (Vite dev server default).

**Rationale:** Frontend will run on Vite dev server during development.

---

## Files Created

**Domain:**
- Entities: Specimen, LivingSpecimen, EnergeticSpecimen, Plankton, Sardine, Shark, Crab, Reef, DeadSardine, DeadShark, Ocean

**Application:**
- Factories: SpecimenFactory, OceanBuilder
- Orchestrators: SnapshotOrchestrator
- DTOs: SimulationConfig

**Infrastructure:**
- Random: SeededRandomProvider
- Serialization: JsonOceanRepository

**API:**
- Controllers: SimulationController
- Hubs: SimulationHub, SignalREventPublisher
- Services: SimulationService
- Program.cs (DI registration, CORS, SignalR)

---

## Next Steps

1. Frontend can now initialize ocean, run snapshots, subscribe to SignalR events
2. Unit tests can verify behavior with MockRandomProvider
3. Consider refactoring to Strategy pattern if behavior becomes more complex
