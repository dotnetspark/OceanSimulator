using OceanSimulator.Application.DTOs;
using OceanSimulator.Application.Factories;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Infrastructure.Random;

namespace OceanSimulator.Api.Services;

public class SimulationService
{
    private IOcean? _ocean;
    private IRandomProvider? _random;
    private SimulationConfig? _config;
    private ISpecimenFactory? _factory;
    
    public IOcean? Ocean => _ocean;
    public IRandomProvider? Random => _random;
    public SimulationConfig? Config => _config;
    public ISpecimenFactory? Factory => _factory;
    
    public void Initialize(SimulationConfig config)
    {
        _config = config;
        _random = new SeededRandomProvider(config.Seed);
        _factory = new SpecimenFactory(config);
        var builder = new OceanBuilder();
        _ocean = builder.BuildRandom(config, _random, _factory);
    }
    
    public void SetOcean(IOcean ocean)
    {
        _ocean = ocean;
    }
    
    public bool IsInitialized => _ocean != null;
}
