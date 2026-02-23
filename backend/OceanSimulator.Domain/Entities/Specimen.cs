using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public abstract class Specimen : ISpecimen
{
    public Guid Id { get; } = Guid.NewGuid();
    public abstract SpecimenType Type { get; }
    public Position Position { get; set; }
    public bool HasMovedThisSnapshot { get; set; }
    
    protected Specimen(Position position)
    {
        Position = position;
    }
    
    public abstract void ExecuteMove(IOcean ocean, IRandomProvider random);
}
