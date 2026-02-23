using OceanSimulator.Application.DTOs;
using OceanSimulator.Domain.Entities;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Application.Factories;

public class SpecimenFactory : ISpecimenFactory
{
    private readonly SimulationConfig _config;
    
    public SpecimenFactory(SimulationConfig config)
    {
        _config = config;
    }
    
    public ISpecimen Create(SpecimenType type, Position position)
    {
        return type switch
        {
            SpecimenType.Plankton => new Plankton(position) 
            { 
                BreedingThreshold = _config.PlanktonBreedingThreshold 
            },
            SpecimenType.Sardine => new Sardine(position) 
            { 
                BreedingThreshold = _config.SardineBreedingThreshold,
                EnergyThreshold = _config.SardineEnergyThreshold
            },
            SpecimenType.Shark => new Shark(position) 
            { 
                BreedingThreshold = _config.SharkBreedingThreshold,
                EnergyThreshold = _config.SharkEnergyThreshold
            },
            SpecimenType.Crab => new Crab(position),
            SpecimenType.Reef => new Reef(position),
            SpecimenType.DeadSardine => new DeadSardine(position),
            SpecimenType.DeadShark => new DeadShark(position),
            _ => throw new ArgumentException($"Cannot create specimen of type {type}")
        };
    }
}
