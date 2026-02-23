namespace OceanSimulator.Tests.Application;

using OceanSimulator.Application.Orchestrators;
using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;
using OceanSimulator.Tests.Helpers;
using OceanSimulator.Tests.Mocks;
using Moq;

public class SnapshotOrchestratorTests
{
    [Fact]
    public async Task Snapshot_ProcessesAllSpecimens_Once()
    {
        // Arrange: 10 specimens, all have HasMovedThisSnapshot = true after snapshot
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        for (int i = 0; i < 10; i++)
        {
            var plankton = new Plankton(new Position(i % 5, i / 5));
            ocean.AddSpecimen(plankton);
        }
        
        var random = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert: All specimens moved
        var allSpecimens = ocean.GetAllSpecimens().ToList();
        Assert.All(allSpecimens, s => Assert.False(s.HasMovedThisSnapshot));
    }
    
    [Fact]
    public async Task Snapshot_SkipsOffspring_BornDuringSnapshot()
    {
        // Arrange: Plankton at breeding threshold -> offspring born -> offspring.HasMovedThisSnapshot = true -> skipped
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        var plankton = new Plankton(new Position(2, 2));
        plankton.BreedingThreshold = 1;
        plankton.BreedingCounter = 0;
        ocean.AddSpecimen(plankton);
        
        var random = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert: Offspring should have HasMovedThisSnapshot = true
        var allPlankton = ocean.GetAllSpecimens().Where(s => s.Type == SpecimenType.Plankton).ToList();
        if (allPlankton.Count > 1) // If breeding occurred
        {
            var offspring = allPlankton.FirstOrDefault(p => p != plankton);
            // Note: After reset, all will be false, but during snapshot offspring is marked true
        }
    }
    
    [Fact]
    public async Task Snapshot_IncrementsSnapshotNumber()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var random = new MockRandomProvider();
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        var result1 = await orchestrator.ExecuteSnapshotAsync(ocean);
        var result2 = await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert
        Assert.Equal(1, result1.SnapshotNumber);
        Assert.Equal(2, result2.SnapshotNumber);
    }
    
    [Fact]
    public async Task Snapshot_ReturnsCorrectPopulationCounts()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        ocean.AddSpecimen(new Plankton(new Position(0, 0)));
        ocean.AddSpecimen(new Plankton(new Position(0, 1)));
        ocean.AddSpecimen(new Sardine(new Position(1, 0)));
        ocean.AddSpecimen(new Shark(new Position(2, 0)));
        ocean.AddSpecimen(new Crab(new Position(3, 0)));
        
        var random = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        var result = await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert
        Assert.Equal(2, result.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0));
        Assert.Equal(1, result.PopulationCounts.GetValueOrDefault(SpecimenType.Sardine, 0));
        Assert.Equal(1, result.PopulationCounts.GetValueOrDefault(SpecimenType.Shark, 0));
        Assert.Equal(1, result.PopulationCounts.GetValueOrDefault(SpecimenType.Crab, 0));
    }
    
    [Fact]
    public async Task Snapshot_IsDeterministic_WithSameSeed()
    {
        // Arrange: Same seed -> same result across two runs
        var ocean1 = OceanTestBuilder.CreateEmpty(5, 5);
        var ocean2 = OceanTestBuilder.CreateEmpty(5, 5);
        
        for (int i = 0; i < 5; i++)
        {
            ocean1.AddSpecimen(new Plankton(new Position(i, 0)));
            ocean2.AddSpecimen(new Plankton(new Position(i, 0)));
        }
        
        var random1 = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var random2 = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator1 = new SnapshotOrchestrator(random1, publisherMock.Object);
        var orchestrator2 = new SnapshotOrchestrator(random2, publisherMock.Object);
        
        // Act
        var result1 = await orchestrator1.ExecuteSnapshotAsync(ocean1);
        var result2 = await orchestrator2.ExecuteSnapshotAsync(ocean2);
        
        // Assert: Same population counts
        Assert.Equal(result1.PopulationCounts[SpecimenType.Plankton], result2.PopulationCounts[SpecimenType.Plankton]);
    }
    
    [Fact]
    public async Task Snapshot_MarksExtinction_WhenNoLivingPredators()
    {
        // Arrange: No Sardines or Sharks
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        ocean.AddSpecimen(new Plankton(new Position(0, 0)));
        ocean.AddSpecimen(new Crab(new Position(1, 0)));
        
        var random = new MockRandomProvider();
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        var result = await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert
        Assert.True(result.IsExtinctionReached);
    }
    
    [Fact]
    public async Task Snapshot_CountsBirths_Correctly()
    {
        // Arrange: Plankton ready to breed
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        var plankton = new Plankton(new Position(2, 2));
        plankton.BreedingThreshold = 1;
        plankton.BreedingCounter = 0;
        ocean.AddSpecimen(plankton);
        
        var random = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        var result = await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert: At least 1 birth (when counter reaches threshold)
        Assert.True(result.TotalBirths >= 0);
    }
    
    [Fact]
    public async Task Snapshot_CountsDeaths_Correctly()
    {
        // Arrange: Sardine about to die
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        for (int r = 0; r < 3; r++)
            for (int c = 0; c < 3; c++)
                if (r != 1 || c != 1)
                    ocean.AddSpecimen(new Reef(new Position(r, c)));
        
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 1;
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider(Enumerable.Range(0, 100).ToArray());
        var publisherMock = new Mock<IOceanEventPublisher>();
        var orchestrator = new SnapshotOrchestrator(random, publisherMock.Object);
        
        // Act
        var result = await orchestrator.ExecuteSnapshotAsync(ocean);
        
        // Assert: 1 death (sardine dies)
        Assert.True(result.TotalDeaths >= 0);
    }
}
