namespace OceanSimulator.Domain.Interfaces;

public interface IStarvationStrategy
{
    void OnMoveWithoutEating(ISpecimen specimen);
    bool IsStarving(ISpecimen specimen);
    bool IsDead(ISpecimen specimen);
    ISpecimen CreateCorpse(ISpecimen specimen);
}
