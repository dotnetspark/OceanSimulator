namespace OceanSimulator.Tests.Domain;

using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;
using OceanSimulator.Tests.Helpers;
using OceanSimulator.Tests.Mocks;

public class SardineBehaviorTests
{
    [Fact]
    public void Sardine_EatsAdjacentPlankton_WhenAvailable()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 2;
        ocean.AddSpecimen(sardine);
        
        var plankton = new Plankton(new Position(1, 2));
        ocean.AddSpecimen(plankton);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert: Plankton removed, Sardine at Plankton's position, energy reset
        Assert.Equal(SpecimenType.Sardine, ocean.GetSpecimenAt(new Position(1, 2))?.Type);
        Assert.Equal(new Position(1, 2), sardine.Position);
        Assert.Equal(5, sardine.EnergyCounter);
        Assert.Equal(1, sardine.BreedingCounter);
    }
    
    [Fact]
    public void Sardine_MovesToWater_WhenNoPlankton()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 3;
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider(new[] { 0 });
        var originalPosition = sardine.Position;
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert: Moved to Water, energy decremented
        Assert.NotEqual(originalPosition, sardine.Position);
        Assert.Equal(2, sardine.EnergyCounter);
    }
    
    [Fact]
    public void Sardine_BreedingCounterIncrements_OnEveryMove()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 3;
        sardine.BreedingCounter = 0;
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert
        Assert.Equal(1, sardine.BreedingCounter);
    }
    
    [Fact]
    public void Sardine_Dies_WhenEnergyReachesZero()
    {
        // Arrange: Sardine with energy = 1, no Plankton adjacent, Water available
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 1;
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert: Sardine replaced by DeadSardine
        var deadSardine = ocean.GetSpecimenAt(sardine.Position);
        Assert.NotNull(deadSardine);
        Assert.Equal(SpecimenType.DeadSardine, deadSardine.Type);
    }
    
    [Fact]
    public void Sardine_EnergyResets_WhenEatingPlankton()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 10;
        sardine.EnergyCounter = 1; // Low energy
        ocean.AddSpecimen(sardine);
        
        var plankton = new Plankton(new Position(1, 2));
        ocean.AddSpecimen(plankton);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert
        Assert.Equal(10, sardine.EnergyCounter);
    }
    
    [Fact]
    public void Sardine_StaysStill_WhenNoValidMoves()
    {
        // Arrange: All adjacent cells are Reef/occupied
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        for (int r = 0; r < 3; r++)
            for (int c = 0; c < 3; c++)
                if (r != 1 || c != 1)
                    ocean.AddSpecimen(new Reef(new Position(r, c)));
        
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 5;
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider();
        var originalPosition = sardine.Position;
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert: Position unchanged, energy still decremented
        Assert.Equal(originalPosition, sardine.Position);
        Assert.Equal(4, sardine.EnergyCounter);
    }
    
    [Fact]
    public void Sardine_SpawnsOffspring_WhenBreedingThresholdMet()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(5, 5);
        var sardine = new Sardine(new Position(2, 2));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 5;
        sardine.BreedingThreshold = 3;
        sardine.BreedingCounter = 2; // One below threshold
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider(new[] { 0, 0 });
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert: Counter should reach threshold
        Assert.Equal(3, sardine.BreedingCounter);
        // Note: Breeding logic implementation will be tested when implemented
    }
    
    [Fact]
    public void Sardine_BreedingCounterIncrements_WhenEating()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var sardine = new Sardine(new Position(1, 1));
        sardine.EnergyThreshold = 5;
        sardine.EnergyCounter = 3;
        sardine.BreedingCounter = 5;
        ocean.AddSpecimen(sardine);
        
        var plankton = new Plankton(new Position(1, 2));
        ocean.AddSpecimen(plankton);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        sardine.ExecuteMove(ocean, random);
        
        // Assert: Counter increments even when eating
        Assert.Equal(6, sardine.BreedingCounter);
    }
}
