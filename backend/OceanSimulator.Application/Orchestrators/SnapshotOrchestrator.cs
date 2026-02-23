using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Events;
using OceanSimulator.Domain.Interfaces;

namespace OceanSimulator.Application.Orchestrators;

public class SnapshotOrchestrator : ISnapshotOrchestrator
{
    private int _snapshotNumber = 0;
    private readonly IRandomProvider _random;
    private readonly IOceanEventPublisher _publisher;
    
    public SnapshotOrchestrator(IRandomProvider random, IOceanEventPublisher publisher)
    {
        _random = random;
        _publisher = publisher;
    }
    
    public async Task<SnapshotResult> ExecuteSnapshotAsync(IOcean ocean, CancellationToken cancellationToken = default)
    {
        _snapshotNumber++;
        
        // Step 1: Get movable specimens
        var specimens = GetMovableSpecimens(ocean);
        
        // Step 2: Shuffle specimens
        ShuffleSpecimens(specimens, _random);
        
        // Step 3: Process specimens
        var (births, deaths) = ProcessSpecimens(specimens, ocean, _random);
        
        // Step 4: Reset movement flags
        ResetMovementFlags(ocean);
        
        // Step 5: Collect population counts
        var counts = CollectPopulationCounts(ocean);
        
        // Step 6: Publish event
        var snapshotEvent = new SnapshotCompletedEvent(DateTime.UtcNow, _snapshotNumber, counts);
        await _publisher.PublishAsync(snapshotEvent);
        
        // Check for extinction
        bool isExtinctionReached = counts.GetValueOrDefault(SpecimenType.Sardine, 0) == 0 &&
                                   counts.GetValueOrDefault(SpecimenType.Shark, 0) == 0;
        
        return new SnapshotResult(_snapshotNumber, counts, births, deaths, isExtinctionReached);
    }
    
    private List<ISpecimen> GetMovableSpecimens(IOcean ocean)
    {
        return ocean.GetAllSpecimens()
            .Where(s => !s.HasMovedThisSnapshot)
            .ToList();
    }
    
    private void ShuffleSpecimens(List<ISpecimen> specimens, IRandomProvider random)
    {
        random.Shuffle(specimens);
    }
    
    private (int births, int deaths) ProcessSpecimens(List<ISpecimen> specimens, IOcean ocean, IRandomProvider random)
    {
        int births = 0;
        int deaths = 0;
        
        foreach (var specimen in specimens)
        {
            if (specimen.HasMovedThisSnapshot)
                continue;
                
            var oldPosition = specimen.Position;
            var oldType = specimen.Type;
            
            specimen.ExecuteMove(ocean, random);
            
            // Check if specimen died (was removed from ocean)
            if (ocean.GetSpecimenAt(oldPosition) != specimen && ocean.GetSpecimenAt(specimen.Position) != specimen)
            {
                deaths++;
            }
            
            // Check for breeding
            if (specimen is LivingSpecimen living && living.BreedingCounter >= living.BreedingThreshold)
            {
                var emptyCells = ocean.GetEmptyCells(specimen.Position).ToList();
                if (emptyCells.Any())
                {
                    var birthPosition = random.Choose(emptyCells);
                    var offspring = CreateOffspring(specimen.Type, birthPosition, living.BreedingThreshold, 
                        specimen is EnergeticSpecimen energetic ? energetic.EnergyThreshold : 0);
                    ocean.AddSpecimen(offspring);
                    offspring.HasMovedThisSnapshot = true;
                    living.BreedingCounter = 0;
                    births++;
                }
            }
        }
        
        return (births, deaths);
    }
    
    private ISpecimen CreateOffspring(SpecimenType type, Domain.ValueObjects.Position position, int breedingThreshold, int energyThreshold)
    {
        return type switch
        {
            SpecimenType.Plankton => new Plankton(position) { BreedingThreshold = breedingThreshold },
            SpecimenType.Sardine => new Sardine(position) { BreedingThreshold = breedingThreshold, EnergyThreshold = energyThreshold },
            SpecimenType.Shark => new Shark(position) { BreedingThreshold = breedingThreshold, EnergyThreshold = energyThreshold },
            _ => throw new InvalidOperationException($"Cannot breed {type}")
        };
    }
    
    private void ResetMovementFlags(IOcean ocean)
    {
        foreach (var specimen in ocean.GetAllSpecimens())
        {
            specimen.HasMovedThisSnapshot = false;
        }
    }
    
    private Dictionary<SpecimenType, int> CollectPopulationCounts(IOcean ocean)
    {
        var counts = new Dictionary<SpecimenType, int>();
        foreach (SpecimenType type in Enum.GetValues<SpecimenType>())
        {
            if (type != SpecimenType.Water)
            {
                counts[type] = ocean.GetSpecimenCount(type);
            }
        }
        return counts;
    }
}
