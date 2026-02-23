using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public class Plankton : LivingSpecimen
{
    public override SpecimenType Type => SpecimenType.Plankton;
    
    public Plankton(Position position) : base(position)
    {
    }
    
    public override void ExecuteMove(IOcean ocean, IRandomProvider random)
    {
        if (HasMovedThisSnapshot)
            return;
            
        var emptyCells = ocean.GetEmptyCells(Position).ToList();
        if (emptyCells.Any())
        {
            var targetPosition = random.Choose(emptyCells);
            ocean.RemoveSpecimen(Position);
            Position = targetPosition;
            ocean.AddSpecimen(this);
        }
        
        BreedingCounter++;
        HasMovedThisSnapshot = true;
    }
}
