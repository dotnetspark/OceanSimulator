using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Events;

public abstract record OceanEvent(DateTime Timestamp);
public record SpecimenMovedEvent(DateTime Timestamp, Guid SpecimenId, SpecimenType Type, Position From, Position To) : OceanEvent(Timestamp);
public record SpecimenBornEvent(DateTime Timestamp, Guid SpecimenId, SpecimenType Type, Position Position) : OceanEvent(Timestamp);
public record SpecimenDiedEvent(DateTime Timestamp, Guid SpecimenId, SpecimenType Type, Position Position, string Cause) : OceanEvent(Timestamp);
public record SpecimenAteEvent(DateTime Timestamp, Guid AttackerId, SpecimenType AttackerType, Guid PreyId, SpecimenType PreyType, Position Position) : OceanEvent(Timestamp);
public record SnapshotCompletedEvent(DateTime Timestamp, int SnapshotNumber, Dictionary<SpecimenType, int> PopulationCounts) : OceanEvent(Timestamp);
