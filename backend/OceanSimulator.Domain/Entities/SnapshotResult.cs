using OceanSimulator.Domain.Enums;

namespace OceanSimulator.Domain.Entities;

public record SnapshotResult(
    int SnapshotNumber,
    Dictionary<SpecimenType, int> PopulationCounts,
    int TotalBirths,
    int TotalDeaths,
    bool IsExtinctionReached);
