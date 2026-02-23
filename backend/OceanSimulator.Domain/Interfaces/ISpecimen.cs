using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Interfaces;

public interface ISpecimen
{
    Guid Id { get; }
    SpecimenType Type { get; }
    Position Position { get; set; }
    bool HasMovedThisSnapshot { get; set; }
    void ExecuteMove(IOcean ocean, IRandomProvider random);
}
