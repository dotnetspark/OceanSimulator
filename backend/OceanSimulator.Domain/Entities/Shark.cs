using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public class Shark : EnergeticSpecimen
{
    public override SpecimenType Type => SpecimenType.Shark;
    public int Weight { get; set; } = 1;
    
    public Shark(Position position) : base(position)
    {
    }
    
    public override void ExecuteMove(IOcean ocean, IRandomProvider random)
    {
        if (HasMovedThisSnapshot)
            return;
            
        var oldPosition = Position;
        bool ate = false;
        
        // Priority 1: Eat adjacent Sardine
        var sardineCells = ocean.GetAdjacentCellsOfType(Position, SpecimenType.Sardine).ToList();
        if (sardineCells.Any())
        {
            var targetPosition = random.Choose(sardineCells);
            var sardine = ocean.GetSpecimenAt(targetPosition);
            ocean.RemoveSpecimen(targetPosition);
            var corpse = new DeadSardine(targetPosition);
            ocean.AddSpecimen(corpse);
            
            ocean.RemoveSpecimen(Position);
            Position = targetPosition;
            ocean.RemoveSpecimen(Position);
            ocean.AddSpecimen(this);
            
            EnergyCounter = EnergyThreshold;
            Weight++;
            ate = true;
        }
        // Priority 2: Attack adjacent Shark if starving
        else if (EnergyCounter <= 1)
        {
            var sharkCells = ocean.GetAdjacentCellsOfType(Position, SpecimenType.Shark).ToList();
            if (sharkCells.Any())
            {
                var targetPosition = random.Choose(sharkCells);
                var defender = ocean.GetSpecimenAt(targetPosition) as Shark;
                if (defender != null)
                {
                    if (Weight >= defender.Weight)
                    {
                        ocean.RemoveSpecimen(targetPosition);
                        ocean.RemoveSpecimen(Position);
                        Position = targetPosition;
                        ocean.AddSpecimen(this);
                        EnergyCounter = EnergyThreshold;
                        ate = true;
                    }
                    else
                    {
                        ocean.RemoveSpecimen(Position);
                        defender.EnergyCounter = defender.EnergyThreshold;
                        return;
                    }
                }
            }
        }
        
        // Priority 3: Move to random Water cell
        if (!ate)
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
            var corpse = new DeadShark(Position);
            ocean.AddSpecimen(corpse);
        }
    }
}
