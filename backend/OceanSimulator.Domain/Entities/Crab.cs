using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public class Crab : Specimen
{
    public override SpecimenType Type => SpecimenType.Crab;
    
    public Crab(Position position) : base(position)
    {
    }
    
    public override void ExecuteMove(IOcean ocean, IRandomProvider random)
    {
        if (HasMovedThisSnapshot)
            return;
            
        // Priority 1: Eat adjacent DeadSardine or DeadShark
        var deadSardineCells = ocean.GetAdjacentCellsOfType(Position, SpecimenType.DeadSardine).ToList();
        var deadSharkCells = ocean.GetAdjacentCellsOfType(Position, SpecimenType.DeadShark).ToList();
        var deadCells = deadSardineCells.Concat(deadSharkCells).ToList();
        
        if (deadCells.Any())
        {
            var targetPosition = random.Choose(deadCells);
            ocean.RemoveSpecimen(targetPosition);
            ocean.RemoveSpecimen(Position);
            Position = targetPosition;
            ocean.AddSpecimen(this);
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
        
        HasMovedThisSnapshot = true;
    }
}
