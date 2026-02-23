# Ocean Simulator — Architecture

## Clean Architecture Layers

```
┌─────────────────────────────────────────────────┐
│                    API Layer                     │
│  SimulationController, SimulationHub, DTOs       │
├─────────────────────────────────────────────────┤
│               Infrastructure Layer              │
│  SeededRandomProvider, JsonOceanRepository       │
├─────────────────────────────────────────────────┤
│               Application Layer                 │
│  SnapshotOrchestrator, Use Cases, Factories      │
├─────────────────────────────────────────────────┤
│                 Domain Layer                    │
│  Entities, Interfaces, Strategies, Events        │
└─────────────────────────────────────────────────┘
```

**Dependency rule:** Outer layers depend on inner layers. Domain has ZERO dependencies.

## Design Patterns

| Pattern | Where Applied |
|---------|---------------|
| Polymorphism | Each species overrides `ExecuteMove` — behavior is polymorphic, no switch/if-else on type in movement logic |
| Factory | `SpecimenFactory` — creates all specimen types with config-driven thresholds |
| Template Method | `SnapshotOrchestrator.ExecuteSnapshotAsync` — fixed steps: Get → Shuffle → Process → Reset → Count → Publish |
| Observer/Events | `OceanEvent` hierarchy published via `IOceanEventPublisher` → `SignalREventPublisher` |
| Repository | `IOceanRepository` → `JsonOceanRepository` |
| Builder | `OceanBuilder.BuildRandom` |

## Entity Hierarchy

```
Specimen (abstract)
├── LivingSpecimen (BreedingCounter, BreedingThreshold)
│   ├── EnergeticSpecimen (EnergyCounter, EnergyThreshold)
│   │   ├── Sardine
│   │   └── Shark (Weight)
│   └── Plankton
├── Crab
├── Reef
├── DeadSardine
└── DeadShark
```

## Species Behavior Matrix

| Species | Moves | Eats | Breeds | Starves | Attacks |
|---------|-------|------|--------|---------|---------|
| Plankton | Random Water | — | ✅ counter | ❌ | ❌ |
| Sardine | Plankton > Water | Plankton | ✅ counter | ✅ energy | ❌ |
| Shark | Sardine > (attack) > Water | Sardine | ✅ counter | ✅ energy | ✅ by weight |
| Crab | Dead > Water | Dead specimens | ❌ | ❌ | ❌ |
| Reef | Never | — | ❌ | ❌ | ❌ |

## SOLID Compliance Audit

### ✅ Single Responsibility
- Each entity owns its own movement behavior via `ExecuteMove`
- `SnapshotOrchestrator` orchestrates snapshot flow only
- `SpecimenFactory` handles creation only
- `Ocean` manages grid state only

### ✅ Open/Closed
- New species: add entity + register in factory. No existing code changes required (except factory registration)
- Behavior is polymorphic — `ExecuteMove` overrides, not conditionals

### ✅ Liskov Substitution
- All `Specimen` subtypes substitutable via `ISpecimen` interface
- `LivingSpecimen` and `EnergeticSpecimen` add capabilities without breaking base contracts

### ✅ Interface Segregation
- `IOcean`, `ISpecimen`, `IRandomProvider`, `ISpecimenFactory`, `IOceanEventPublisher`, `IOceanRepository` — each focused on one concern

### ✅ Dependency Inversion
- Domain depends on abstractions only (interfaces)
- Infrastructure provides implementations injected via DI
- Domain.csproj has zero `ProjectReference` or external `PackageReference`

### ⚠️ Tech Debt
- `SnapshotOrchestrator.CreateOffspring` duplicates `SpecimenFactory` switch logic. Should inject `ISpecimenFactory` to respect DRY and SRP.
- `colorTheme` prop declared on all SVG components but unused — wire up when high-contrast theme is needed.

## Adding a New Species

1. Create entity in `OceanSimulator.Domain/Entities/` extending `Specimen` (or `LivingSpecimen`/`EnergeticSpecimen`)
2. Override `ExecuteMove` with species-specific behavior
3. Add `SpecimenType` enum value
4. Register in `SpecimenFactory`
5. Add SVG component in `frontend/src/components/species/`
6. Wire in `GridCell.tsx`
7. Add tests in `OceanSimulator.Tests/Domain/`
