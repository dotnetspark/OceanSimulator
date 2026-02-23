namespace OceanSimulator.Api.DTOs;

public record SimulationConfigDto(
    int Rows,
    int Cols,
    int InitialPlankton,
    int InitialSardines,
    int InitialSharks,
    int InitialCrabs,
    int InitialReefs,
    int PlanktonBreedingThreshold,
    int SardineBreedingThreshold,
    int SharkBreedingThreshold,
    int SardineEnergyThreshold,
    int SharkEnergyThreshold,
    int? Seed);
