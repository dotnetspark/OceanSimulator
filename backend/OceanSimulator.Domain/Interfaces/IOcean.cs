using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Interfaces;

public interface IOcean
{
    int Rows { get; }
    int Cols { get; }
    ISpecimen? GetSpecimenAt(Position position);
    void SetSpecimenAt(Position position, ISpecimen? specimen);
    SpecimenType GetCellType(Position position);
    IEnumerable<Position> GetAdjacentPositions(Position position);
    IEnumerable<Position> GetEmptyCells(Position position);
    IEnumerable<Position> GetAdjacentCellsOfType(Position position, SpecimenType type);
    void AddSpecimen(ISpecimen specimen);
    void RemoveSpecimen(Position position);
    IEnumerable<ISpecimen> GetAllSpecimens();
    IEnumerable<ISpecimen> GetSpecimensOfType(SpecimenType type);
    int GetSpecimenCount(SpecimenType type);
}
