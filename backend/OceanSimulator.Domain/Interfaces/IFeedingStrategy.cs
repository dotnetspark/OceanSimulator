using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Interfaces;

public interface IFeedingStrategy
{
    Position? SelectFeedingTarget(ISpecimen specimen, IOcean ocean, IRandomProvider random);
    void OnFed(ISpecimen specimen, ISpecimen prey, IOcean ocean);
}
