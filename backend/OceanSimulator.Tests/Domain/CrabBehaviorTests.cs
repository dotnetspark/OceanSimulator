namespace OceanSimulator.Tests.Domain;

using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;
using OceanSimulator.Tests.Helpers;
using OceanSimulator.Tests.Mocks;

public class CrabBehaviorTests
{
    [Fact]
    public void Crab_ConsumesAdjacentDeadSardine()
    {
        // Arrange: DeadSardine adjacent -> Crab moves there, DeadSardine removed
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var crab = new Crab(new Position(1, 1));
        ocean.AddSpecimen(crab);
        
        var deadSardine = new DeadSardine(new Position(1, 2));
        ocean.AddSpecimen(deadSardine);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        crab.ExecuteMove(ocean, random);
        
        // Assert: Crab moved to DeadSardine position, DeadSardine removed
        Assert.Equal(new Position(1, 2), crab.Position);
        Assert.Null(ocean.GetSpecimenAt(new Position(1, 2)));
    }
    
    [Fact]
    public void Crab_ConsumesAdjacentDeadShark()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var crab = new Crab(new Position(1, 1));
        ocean.AddSpecimen(crab);
        
        var deadShark = new DeadShark(new Position(1, 2));
        ocean.AddSpecimen(deadShark);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        crab.ExecuteMove(ocean, random);
        
        // Assert: Crab moved to DeadShark position, DeadShark removed
        Assert.Equal(new Position(1, 2), crab.Position);
        Assert.Null(ocean.GetSpecimenAt(new Position(1, 2)));
    }
    
    [Fact]
    public void Crab_PrioritizesDeadSpecimens_OverWater()
    {
        // Arrange: Both DeadSardine and Water adjacent -> Crab moves to DeadSardine
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var crab = new Crab(new Position(1, 1));
        ocean.AddSpecimen(crab);
        
        var deadSardine = new DeadSardine(new Position(1, 2));
        ocean.AddSpecimen(deadSardine);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        crab.ExecuteMove(ocean, random);
        
        // Assert: Crab ate the dead specimen, not just moved to water
        Assert.Equal(new Position(1, 2), crab.Position);
    }
    
    [Fact]
    public void Crab_MovesToWater_WhenNoDeadSpecimens()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var crab = new Crab(new Position(1, 1));
        ocean.AddSpecimen(crab);
        
        var random = new MockRandomProvider(new[] { 0 });
        var originalPosition = crab.Position;
        
        // Act
        crab.ExecuteMove(ocean, random);
        
        // Assert: Crab moved to adjacent water
        Assert.NotEqual(originalPosition, crab.Position);
    }
    
    [Fact]
    public void Crab_NeverDies()
    {
        // Arrange: Run 1000 moves with no food
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        var crab = new Crab(new Position(2, 2));
        ocean.AddSpecimen(crab);
        
        var random = new MockRandomProvider(Enumerable.Range(0, 2000).ToArray());
        
        // Act: 1000 snapshots
        for (int i = 0; i < 1000; i++)
        {
            crab.HasMovedThisSnapshot = false;
            crab.ExecuteMove(ocean, random);
        }
        
        // Assert: Crab still alive
        var allCrabs = ocean.GetAllSpecimens().Where(s => s.Type == SpecimenType.Crab).ToList();
        Assert.Single(allCrabs);
        Assert.Equal(SpecimenType.Crab, allCrabs[0].Type);
    }
    
    [Fact]
    public void Crab_NeverBreeds()
    {
        // Arrange: Run 1000 snapshots
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        var crab = new Crab(new Position(2, 2));
        ocean.AddSpecimen(crab);
        
        var random = new MockRandomProvider(Enumerable.Range(0, 2000).ToArray());
        
        // Act
        for (int i = 0; i < 1000; i++)
        {
            crab.HasMovedThisSnapshot = false;
            crab.ExecuteMove(ocean, random);
        }
        
        // Assert: Crab count never increased
        var crabCount = ocean.GetAllSpecimens().Count(s => s.Type == SpecimenType.Crab);
        Assert.Equal(1, crabCount);
    }
    
    [Fact]
    public void Crab_StaysStill_WhenNoValidMoves()
    {
        // Arrange: Crab surrounded by Reef
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        for (int r = 0; r < 3; r++)
            for (int c = 0; c < 3; c++)
                if (r != 1 || c != 1)
                    ocean.AddSpecimen(new Reef(new Position(r, c)));
        
        var crab = new Crab(new Position(1, 1));
        ocean.AddSpecimen(crab);
        
        var random = new MockRandomProvider();
        var originalPosition = crab.Position;
        
        // Act
        crab.ExecuteMove(ocean, random);
        
        // Assert
        Assert.Equal(originalPosition, crab.Position);
    }
}
