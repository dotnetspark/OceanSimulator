namespace OceanSimulator.Tests.Helpers;

using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

public class OceanTestBuilder
{
    public static IOcean CreateEmpty(int rows = 5, int cols = 5)
    {
        return new Ocean(rows, cols);
    }
    
    public static IOcean CreateWithSpecimens(int rows, int cols, params (SpecimenType type, int row, int col)[] specimens)
    {
        var ocean = new Ocean(rows, cols);
        
        foreach (var (type, row, col) in specimens)
        {
            var position = new Position(row, col);
            ISpecimen specimen = type switch
            {
                SpecimenType.Plankton => new Plankton(position),
                SpecimenType.Sardine => new Sardine(position),
                SpecimenType.Shark => new Shark(position),
                SpecimenType.Crab => new Crab(position),
                SpecimenType.Reef => new Reef(position),
                SpecimenType.DeadSardine => new DeadSardine(position),
                SpecimenType.DeadShark => new DeadShark(position),
                _ => throw new ArgumentException($"Unsupported type: {type}")
            };
            ocean.AddSpecimen(specimen);
        }
        
        return ocean;
    }
}
