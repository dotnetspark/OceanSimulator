using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Interfaces;

public interface IMovementStrategy
{
    Position? SelectMoveTarget(ISpecimen specimen, IOcean ocean, IRandomProvider random);
}
