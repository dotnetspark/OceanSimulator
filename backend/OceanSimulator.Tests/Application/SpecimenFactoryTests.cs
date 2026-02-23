namespace OceanSimulator.Tests.Application;

using OceanSimulator.Application.DTOs;
using OceanSimulator.Application.Factories;
using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.ValueObjects;

public class SpecimenFactoryTests
{
    [Theory]
    [InlineData(SpecimenType.Plankton)]
    [InlineData(SpecimenType.Sardine)]
    [InlineData(SpecimenType.Shark)]
    [InlineData(SpecimenType.Crab)]
    [InlineData(SpecimenType.Reef)]
    public void Factory_Creates_CorrectType(SpecimenType type)
    {
        // Arrange
        var config = new SimulationConfig
        {
            PlanktonBreedingThreshold = 3,
            SardineBreedingThreshold = 5,
            SharkBreedingThreshold = 7,
            SardineEnergyThreshold = 10,
            SharkEnergyThreshold = 15
        };
        var factory = new SpecimenFactory(config);
        var position = new Position(1, 1);
        
        // Act
        var specimen = factory.Create(type, position);
        
        // Assert
        Assert.Equal(type, specimen.Type);
        Assert.Equal(position, specimen.Position);
    }
    
    [Fact]
    public void Factory_Sardine_HasCorrectDefaultEnergy()
    {
        // Arrange
        var config = new SimulationConfig
        {
            SardineEnergyThreshold = 12,
            SardineBreedingThreshold = 5
        };
        var factory = new SpecimenFactory(config);
        
        // Act
        var sardine = factory.Create(SpecimenType.Sardine, new Position(0, 0)) as Sardine;
        
        // Assert
        Assert.NotNull(sardine);
        Assert.Equal(12, sardine.EnergyThreshold);
        Assert.Equal(12, sardine.EnergyCounter);
    }
    
    [Fact]
    public void Factory_Shark_HasCorrectDefaultEnergy()
    {
        // Arrange
        var config = new SimulationConfig
        {
            SharkEnergyThreshold = 20,
            SharkBreedingThreshold = 8
        };
        var factory = new SpecimenFactory(config);
        
        // Act
        var shark = factory.Create(SpecimenType.Shark, new Position(0, 0)) as Shark;
        
        // Assert
        Assert.NotNull(shark);
        Assert.Equal(20, shark.EnergyThreshold);
        Assert.Equal(20, shark.EnergyCounter);
    }
    
    [Fact]
    public void Factory_Plankton_HasCorrectBreedingThreshold()
    {
        // Arrange
        var config = new SimulationConfig
        {
            PlanktonBreedingThreshold = 4
        };
        var factory = new SpecimenFactory(config);
        
        // Act
        var plankton = factory.Create(SpecimenType.Plankton, new Position(0, 0)) as Plankton;
        
        // Assert
        Assert.NotNull(plankton);
        Assert.Equal(4, plankton.BreedingThreshold);
    }
    
    [Fact]
    public void Factory_Crab_DoesNotRequireThresholds()
    {
        // Arrange
        var config = new SimulationConfig();
        var factory = new SpecimenFactory(config);
        
        // Act
        var crab = factory.Create(SpecimenType.Crab, new Position(0, 0)) as Crab;
        
        // Assert
        Assert.NotNull(crab);
        Assert.Equal(SpecimenType.Crab, crab.Type);
    }
    
    [Fact]
    public void Factory_Throws_ForWaterType()
    {
        // Arrange
        var config = new SimulationConfig();
        var factory = new SpecimenFactory(config);
        
        // Act & Assert
        Assert.Throws<ArgumentException>(() => factory.Create(SpecimenType.Water, new Position(0, 0)));
    }
    
    [Fact]
    public void Factory_DeadSardine_CreatesCorrectType()
    {
        // Arrange
        var config = new SimulationConfig();
        var factory = new SpecimenFactory(config);
        
        // Act
        var deadSardine = factory.Create(SpecimenType.DeadSardine, new Position(1, 2));
        
        // Assert
        Assert.NotNull(deadSardine);
        Assert.Equal(SpecimenType.DeadSardine, deadSardine.Type);
        Assert.Equal(new Position(1, 2), deadSardine.Position);
    }
    
    [Fact]
    public void Factory_DeadShark_CreatesCorrectType()
    {
        // Arrange
        var config = new SimulationConfig();
        var factory = new SpecimenFactory(config);
        
        // Act
        var deadShark = factory.Create(SpecimenType.DeadShark, new Position(2, 3));
        
        // Assert
        Assert.NotNull(deadShark);
        Assert.Equal(SpecimenType.DeadShark, deadShark.Type);
        Assert.Equal(new Position(2, 3), deadShark.Position);
    }
    
    [Fact]
    public void Factory_Sardine_BreedingThreshold_IsSetFromConfig()
    {
        // Arrange
        var config = new SimulationConfig
        {
            SardineBreedingThreshold = 7,
            SardineEnergyThreshold = 10
        };
        var factory = new SpecimenFactory(config);
        
        // Act
        var sardine = factory.Create(SpecimenType.Sardine, new Position(0, 0)) as Sardine;
        
        // Assert
        Assert.NotNull(sardine);
        Assert.Equal(7, sardine.BreedingThreshold);
    }
    
    [Fact]
    public void Factory_Shark_BreedingThreshold_IsSetFromConfig()
    {
        // Arrange
        var config = new SimulationConfig
        {
            SharkBreedingThreshold = 9,
            SharkEnergyThreshold = 15
        };
        var factory = new SpecimenFactory(config);
        
        // Act
        var shark = factory.Create(SpecimenType.Shark, new Position(0, 0)) as Shark;
        
        // Assert
        Assert.NotNull(shark);
        Assert.Equal(9, shark.BreedingThreshold);
    }
}
