using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public abstract class LivingSpecimen : Specimen
{
    public int BreedingCounter { get; set; }
    public int BreedingThreshold { get; set; }
    
    protected LivingSpecimen(Position position) : base(position)
    {
    }
}
