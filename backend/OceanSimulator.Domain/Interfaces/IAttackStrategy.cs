using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Interfaces;

public interface IAttackStrategy
{
    Position? SelectAttackTarget(ISpecimen specimen, IOcean ocean, IRandomProvider random);
    ISpecimen? ResolveAttack(ISpecimen attacker, ISpecimen defender, IRandomProvider random);
}
