using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public class Sardine : EnergeticSpecimen
{
    public override SpecimenType Type => SpecimenType.Sardine;
    
    public Sardine(Position position) : base(position)
    {
    }
    
    public override void ExecuteMove(IOcean ocean, IRandomProvider random)
    {
        if (HasMovedThisSnapshot)
            return;
            
        var oldPosition = Position;
        bool ate = false;
        
        // Priority 1: Eat adjacent Plankton
        var planktonCells = ocean.GetAdjacentCellsOfType(Position, SpecimenType.Plankton).ToList();
        if (planktonCells.Any())
        {
            var targetPosition = random.Choose(planktonCells);
            ocean.RemoveSpecimen(targetPosition);
            ocean.RemoveSpecimen(Position);
            Position = targetPosition;
            ocean.AddSpecimen(this);
            EnergyCounter = EnergyThreshold;
            ate = true;
        }
        // Priority 2: Move to random Water cell
        else
        {
            var emptyCells = ocean.GetEmptyCells(Position).ToList();
            if (emptyCells.Any())
            {
                var targetPosition = random.Choose(emptyCells);
                ocean.RemoveSpecimen(Position);
                Position = targetPosition;
                ocean.AddSpecimen(this);
            }
        }
        
        if (!ate)
            EnergyCounter--;
            
        BreedingCounter++;
        HasMovedThisSnapshot = true;
        
        // Check if dead
        if (EnergyCounter <= 0)
        {
            ocean.RemoveSpecimen(Position);
            var corpse = new DeadSardine(Position);
            ocean.AddSpecimen(corpse);
        }
    }
}
