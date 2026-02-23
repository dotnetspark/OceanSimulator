using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public class DeadSardine : Specimen
{
    public override SpecimenType Type => SpecimenType.DeadSardine;
    
    public DeadSardine(Position position) : base(position)
    {
    }
    
    public override void ExecuteMove(IOcean ocean, IRandomProvider random)
    {
        HasMovedThisSnapshot = true;
    }
}
