namespace OceanSimulator.Tests.Domain;

using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;
using OceanSimulator.Tests.Helpers;
using OceanSimulator.Tests.Mocks;

public class SharkBehaviorTests
{
    [Fact]
    public void Shark_EatsAdjacentSardine_WhenAvailable()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var shark = new Shark(new Position(1, 1));
        shark.EnergyThreshold = 10;
        shark.EnergyCounter = 3;
        shark.Weight = 2;
        ocean.AddSpecimen(shark);
        
        var sardine = new Sardine(new Position(1, 2));
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        shark.ExecuteMove(ocean, random);
        
        // Assert: Sardine removed, DeadSardine created at old Sardine pos, Shark moved
        var deadSardine = ocean.GetSpecimenAt(new Position(1, 2));
        Assert.NotNull(deadSardine);
        Assert.Equal(SpecimenType.DeadSardine, deadSardine.Type);
        Assert.Equal(new Position(1, 2), shark.Position);
        Assert.Equal(10, shark.EnergyCounter);
        Assert.Equal(3, shark.Weight);
        Assert.Equal(1, shark.BreedingCounter);
    }
    
    [Fact]
    public void Shark_MovesToWater_WhenNoSardineAndNotStarving()
    {
        // Arrange: energy > 1, no Sardine, Water available
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var shark = new Shark(new Position(1, 1));
        shark.EnergyThreshold = 10;
        shark.EnergyCounter = 5;
        ocean.AddSpecimen(shark);
        
        var random = new MockRandomProvider(new[] { 0 });
        var originalPosition = shark.Position;
        
        // Act
        shark.ExecuteMove(ocean, random);
        
        // Assert: Moved to water, energy unchanged (no decrement for sharks moving to water without eating)
        Assert.NotEqual(originalPosition, shark.Position);
        Assert.Equal(1, shark.BreedingCounter);
    }
    
    [Fact]
    public void Shark_AttacksAnotherShark_WhenStarving()
    {
        // Arrange: Shark energy = 1 (starving), no Sardine, adjacent Shark present
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var attacker = new Shark(new Position(1, 1));
        attacker.EnergyThreshold = 10;
        attacker.EnergyCounter = 1;
        attacker.Weight = 5;
        ocean.AddSpecimen(attacker);
        
        var defender = new Shark(new Position(1, 2));
        defender.EnergyThreshold = 10;
        defender.EnergyCounter = 5;
        defender.Weight = 2;
        ocean.AddSpecimen(defender);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        attacker.ExecuteMove(ocean, random);
        
        // Assert: Attacker wins (higher weight), moves to defender's position
        Assert.Equal(new Position(1, 2), attacker.Position);
        Assert.Equal(10, attacker.EnergyCounter);
        Assert.Null(ocean.GetSpecimenAt(new Position(1, 1)));
    }
    
    [Fact]
    public void Shark_Attack_HigherWeightWins()
    {
        // Arrange
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var attacker = new Shark(new Position(1, 1));
        attacker.EnergyThreshold = 10;
        attacker.EnergyCounter = 1;
        attacker.Weight = 5;
        ocean.AddSpecimen(attacker);
        
        var defender = new Shark(new Position(1, 2));
        defender.EnergyThreshold = 10;
        defender.EnergyCounter = 5;
        defender.Weight = 2;
        ocean.AddSpecimen(defender);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        attacker.ExecuteMove(ocean, random);
        
        // Assert: Attacker moved to defender's position, defender removed
        Assert.Equal(new Position(1, 2), attacker.Position);
        var allSharks = ocean.GetAllSpecimens().Where(s => s.Type == SpecimenType.Shark).ToList();
        Assert.Single(allSharks);
    }
    
    [Fact]
    public void Shark_Attack_LowerWeightLoses()
    {
        // Arrange: attacker.Weight = 1, defender.Weight = 4 -> defender removes attacker
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var attacker = new Shark(new Position(1, 1));
        attacker.EnergyThreshold = 10;
        attacker.EnergyCounter = 1;
        attacker.Weight = 1;
        ocean.AddSpecimen(attacker);
        
        var defender = new Shark(new Position(1, 2));
        defender.EnergyThreshold = 10;
        defender.EnergyCounter = 5;
        defender.Weight = 4;
        ocean.AddSpecimen(defender);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        attacker.ExecuteMove(ocean, random);
        
        // Assert: Attacker removed, defender still at original position with reset energy
        Assert.Null(ocean.GetSpecimenAt(new Position(1, 1)));
        Assert.Equal(new Position(1, 2), defender.Position);
        Assert.Equal(10, defender.EnergyCounter);
    }
    
    [Fact]
    public void Shark_Dies_WhenEnergyReachesZero()
    {
        // Arrange: energy = 1, no Sardine, no adjacent Shark, Water available
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var shark = new Shark(new Position(1, 1));
        shark.EnergyThreshold = 10;
        shark.EnergyCounter = 1;
        shark.Weight = 3;
        ocean.AddSpecimen(shark);
        
        // Add another shark far away so attack doesn't trigger
        var otherShark = new Shark(new Position(0, 0));
        ocean.AddSpecimen(otherShark);
        
        var random = new MockRandomProvider(new[] { 5 }); // Move away from other shark
        
        // Act
        shark.ExecuteMove(ocean, random);
        
        // Assert: Shark died and became DeadShark
        var deadShark = ocean.GetSpecimenAt(shark.Position);
        Assert.NotNull(deadShark);
        Assert.Equal(SpecimenType.DeadShark, deadShark.Type);
    }
    
    [Fact]
    public void Shark_GainsWeight_WhenEatingSardine()
    {
        // Arrange: initial weight = 1, after eating Sardine -> weight = 2
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var shark = new Shark(new Position(1, 1));
        shark.EnergyThreshold = 10;
        shark.EnergyCounter = 5;
        shark.Weight = 1;
        ocean.AddSpecimen(shark);
        
        var sardine = new Sardine(new Position(1, 2));
        ocean.AddSpecimen(sardine);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        shark.ExecuteMove(ocean, random);
        
        // Assert
        Assert.Equal(2, shark.Weight);
    }
    
    [Fact]
    public void Shark_PrioritizesSardine_OverAttack()
    {
        // Arrange: Starving shark with both Sardine and Shark adjacent
        var ocean = OceanTestBuilder.CreateEmpty(3, 3);
        var shark = new Shark(new Position(1, 1));
        shark.EnergyThreshold = 10;
        shark.EnergyCounter = 1;
        shark.Weight = 2;
        ocean.AddSpecimen(shark);
        
        var sardine = new Sardine(new Position(1, 0));
        ocean.AddSpecimen(sardine);
        
        var otherShark = new Shark(new Position(1, 2));
        ocean.AddSpecimen(otherShark);
        
        var random = new MockRandomProvider(new[] { 0 });
        
        // Act
        shark.ExecuteMove(ocean, random);
        
        // Assert: Shark ate Sardine (priority 1), not attack (priority 2)
        var deadSardine = ocean.GetSpecimenAt(new Position(1, 0));
        Assert.NotNull(deadSardine);
        Assert.Equal(SpecimenType.DeadSardine, deadSardine.Type);
        Assert.Equal(new Position(1, 0), shark.Position);
    }
}
