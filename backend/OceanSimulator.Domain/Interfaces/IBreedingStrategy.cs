namespace OceanSimulator.Domain.Interfaces;

public interface IBreedingStrategy
{
    bool ShouldBreed(ISpecimen specimen);
    ISpecimen? Breed(ISpecimen specimen, IOcean ocean, IRandomProvider random, ISpecimenFactory factory);
}
