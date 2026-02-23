using Microsoft.AspNetCore.Mvc;
using OceanSimulator.Api.DTOs;
using OceanSimulator.Api.Services;
using OceanSimulator.Application.DTOs;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;

namespace OceanSimulator.Api.Controllers;

[ApiController]
[Route("api/simulation")]
public class SimulationController : ControllerBase
{
    private readonly SimulationService _simulationService;
    private readonly ISnapshotOrchestrator _orchestrator;
    private readonly IOceanRepository _repository;
    
    public SimulationController(
        SimulationService simulationService,
        ISnapshotOrchestrator orchestrator,
        IOceanRepository repository)
    {
        _simulationService = simulationService;
        _orchestrator = orchestrator;
        _repository = repository;
    }
    
    [HttpPost("initialize")]
    public IActionResult Initialize([FromBody] SimulationConfigDto configDto)
    {
        var config = new SimulationConfig(
            configDto.Rows,
            configDto.Cols,
            configDto.InitialPlankton,
            configDto.InitialSardines,
            configDto.InitialSharks,
            configDto.InitialCrabs,
            configDto.InitialReefs,
            configDto.PlanktonBreedingThreshold,
            configDto.SardineBreedingThreshold,
            configDto.SharkBreedingThreshold,
            configDto.SardineEnergyThreshold,
            configDto.SharkEnergyThreshold,
            configDto.Seed);
            
        _simulationService.Initialize(config);
        
        return Ok(new { message = "Simulation initialized", rows = config.Rows, cols = config.Cols });
    }
    
    [HttpPost("snapshot")]
    public async Task<IActionResult> ExecuteSnapshot()
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!);
        return Ok(result);
    }
    
    [HttpPost("snapshots/{n}")]
    public async Task<IActionResult> ExecuteNSnapshots(int n)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        var results = new List<object>();
        for (int i = 0; i < n; i++)
        {
            var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!);
            results.Add(result);
            
            if (result.IsExtinctionReached)
                break;
        }
        
        return Ok(results);
    }
    
    [HttpGet("state")]
    public IActionResult GetState()
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        var ocean = _simulationService.Ocean!;
        var populations = new Dictionary<string, int>();
        
        foreach (SpecimenType type in Enum.GetValues<SpecimenType>())
        {
            if (type != SpecimenType.Water)
            {
                populations[type.ToString()] = ocean.GetSpecimenCount(type);
            }
        }
        
        return Ok(new
        {
            rows = ocean.Rows,
            cols = ocean.Cols,
            populations
        });
    }
    
    [HttpPost("save")]
    public async Task<IActionResult> Save([FromBody] string filePath)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        await _repository.SaveAsync(_simulationService.Ocean!, filePath);
        return Ok(new { message = "Simulation saved", filePath });
    }
    
    [HttpPost("load")]
    public async Task<IActionResult> Load([FromBody] string filePath)
    {
        var ocean = await _repository.LoadAsync(filePath);
        _simulationService.SetOcean(ocean);
        return Ok(new { message = "Simulation loaded", filePath });
    }
    
    [HttpPost("run/extinction")]
    public async Task<IActionResult> RunUntilExtinction([FromBody] RunUntilExtinctionRequest request)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        var results = new List<object>();
        int maxIterations = 10000;
        int iteration = 0;
        
        while (iteration < maxIterations)
        {
            var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!);
            results.Add(result);
            iteration++;
            
            if (request.Target.ToLower() == "sardine")
            {
                if (result.PopulationCounts.GetValueOrDefault(SpecimenType.Sardine, 0) == 0)
                    break;
            }
            else if (request.Target.ToLower() == "all")
            {
                if (result.IsExtinctionReached)
                    break;
            }
        }
        
        return Ok(new { iterations = iteration, results });
    }
    
    [HttpPost("run/event")]
    public async Task<IActionResult> RunUntilEvent([FromBody] string eventType)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        return Ok(new { message = "RunUntilEvent not yet implemented" });
    }
}
