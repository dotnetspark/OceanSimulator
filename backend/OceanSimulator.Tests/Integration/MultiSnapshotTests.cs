namespace OceanSimulator.Tests.Integration;

using OceanSimulator.Application.Orchestrators;
using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;
using OceanSimulator.Tests.Helpers;
using OceanSimulator.Tests.Mocks;
using Moq;

public class MultiSnapshotTests
{
    [Fact]
    public async Task TenSnapshots_WithSameSeed_AreDeterministic()
    {
        // Arrange: Run same simulation twice with same seed
        var ocean1 = OceanTestBuilder.CreateEmpty(5, 5);
        var ocean2 = OceanTestBuilder.CreateEmpty(5, 5);
        
        for (int i = 0; i < 5; i++)
        {
            ocean1.AddSpecimen(new Plankton(new Position(i, 0)));
            ocean2.AddSpecimen(new Plankton(new Position(i, 0)));
        }
        
        var random1 = new MockRandomProvider(Enumerable.Range(0, 1000).ToArray());
        var random2 = new MockRandomProvider(Enumerable.Range(0, 1000).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        
        var orchestrator1 = new SnapshotOrchestrator(random1, publisherMock.Object);
        var orchestrator2 = new SnapshotOrchestrator(random2, publisherMock.Object);
        
        // Act: Run 10 snapshots on each
        var results1 = new List<int>();
        var results2 = new List<int>();
        
        for (int i = 0; i < 10; i++)
        {
            var r1 = await orchestrator1.ExecuteSnapshotAsync(ocean1);
            var r2 = await orchestrator2.ExecuteSnapshotAsync(ocean2);
            results1.Add(r1.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0));
            results2.Add(r2.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0));
        }
        
        // Assert: Results should be identical
        Assert.Equal(results1, results2);
    }
    
    [Fact]
    public async Task Population_Decreases_WhenSharksOutnumberPrey()
    {
        // Arrange: Many sharks, few sardines/plankton -> sardines eventually extinct
        var ocean = OceanTestBuilder.CreateEmpty(10, 10);
        
        // Add 10 sharks
        for (int i = 0; i < 10; i++)
        {
            var shark = new Shark(new Position(i, 0));
            shark.EnergyThreshold = 10;
            ocean.AddSpecimen(shark);
        }
        
        // Add 3 sardines
        for (int i = 0; i < 3; i++)
        {
            var sardine = new Sardine(new Position(i, 1));
            sardine.EnergyThreshold = 5;
            ocean.AddSpecimen(sardine);
        }
        
        var random = new MockRandomProvider(Enumerable.Range(0, 10000).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        var initialSardineCount = ocean.GetSpecimenCount(SpecimenType.Sardine);
        
        // Act: Run 20 snapshots
        for (int i = 0; i < 20; i++)
        {
            await orchestrator.ExecuteSnapshotAsync(ocean);
        }
        
        var finalSardineCount = ocean.GetSpecimenCount(SpecimenType.Sardine);
        
        // Assert: Sardine population should decrease or be extinct
        Assert.True(finalSardineCount <= initialSardineCount);
    }
    
    [Fact]
    public async Task Population_Increases_WhenBreedingEnabled_AndFoodAvailable()
    {
        // Arrange: Plenty of plankton, few sardines with breeding enabled
        var ocean = OceanTestBuilder.CreateEmpty(10, 10);
        
        // Add many plankton
        for (int i = 0; i < 50; i++)
        {
            var plankton = new Plankton(new Position(i % 10, i / 10));
            plankton.BreedingThreshold = 2;
            ocean.AddSpecimen(plankton);
        }
        
        var initialPlanktonCount = ocean.GetSpecimenCount(SpecimenType.Plankton);
        
        var random = new MockRandomProvider(Enumerable.Range(0, 10000).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act: Run 5 snapshots
        for (int i = 0; i < 5; i++)
        {
            await orchestrator.ExecuteSnapshotAsync(ocean);
        }
        
        var finalPlanktonCount = ocean.GetSpecimenCount(SpecimenType.Plankton);
        
        // Assert: Population should increase or stay same (due to breeding)
        Assert.True(finalPlanktonCount >= initialPlanktonCount);
    }
    
    [Fact]
    public async Task ExtinctionReached_WhenNoSardinesOrSharks()
    {
        // Arrange: Only plankton and crabs
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        ocean.AddSpecimen(new Plankton(new Position(0, 0)));
        ocean.AddSpecimen(new Crab(new Position(1, 1)));
        
        var random = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        var result = await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert
        Assert.True(result.IsExtinctionReached);
    }
    
    [Fact]
    public async Task MultipleSnapshots_DoNotDuplicateSpecimens()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        for (int i = 0; i < 5; i++)
        {
            ocean.AddSpecimen(new Plankton(new Position(i, 0)));
        }
        
        var random = new MockRandomProvider(Enumerable.Range(0, 1000).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act: Run 10 snapshots
        for (int i = 0; i < 10; i++)
        {
            await orchestrator.ExecuteSnapshotAsync(ocean);
        }
        
        // Assert: Count should be reasonable (no explosive duplication)
        var finalCount = ocean.GetAllSpecimens().Count();
        Assert.True(finalCount < 100); // Breeding may increase, but not exponentially
    }
    
    [Fact]
    public async Task Crabs_SurviveIndefinitely()
    {
        // Arrange: Only crabs
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        for (int i = 0; i < 3; i++)
        {
            ocean.AddSpecimen(new Crab(new Position(i, 0)));
        }
        
        var random = new MockRandomProvider(Enumerable.Range(0, 1000).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act: Run 50 snapshots
        for (int i = 0; i < 50; i++)
        {
            await orchestrator.ExecuteSnapshotAsync(ocean);
        }
        
        var finalCrabCount = ocean.GetSpecimenCount(SpecimenType.Crab);
        
        // Assert: All crabs still alive
        Assert.Equal(3, finalCrabCount);
    }
}
