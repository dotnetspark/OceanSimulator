using OceanSimulator.Application.DTOs;
using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Application.Factories;

public class OceanBuilder
{
    public IOcean BuildRandom(SimulationConfig config, IRandomProvider random, ISpecimenFactory factory)
    {
        var ocean = new Ocean(config.Rows, config.Cols);
        var allPositions = Enumerable.Range(0, config.Rows)
            .SelectMany(r => Enumerable.Range(0, config.Cols).Select(c => new Position(r, c)))
            .ToList();
        random.Shuffle(allPositions);
        
        var specimens = new List<(SpecimenType Type, int Count)>
        {
            (SpecimenType.Reef, config.InitialReefs),
            (SpecimenType.Plankton, config.InitialPlankton),
            (SpecimenType.Sardine, config.InitialSardines),
            (SpecimenType.Shark, config.InitialSharks),
            (SpecimenType.Crab, config.InitialCrabs),
        };
        
        int index = 0;
        foreach (var (type, count) in specimens)
        {
            for (int i = 0; i < count && index < allPositions.Count; i++, index++)
            {
                var specimen = factory.Create(type, allPositions[index]);
                ocean.AddSpecimen(specimen);
            }
        }
        return ocean;
    }
}
