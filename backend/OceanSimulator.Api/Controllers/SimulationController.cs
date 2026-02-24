using Microsoft.AspNetCore.Mvc;
using OceanSimulator.Api.DTOs;
using OceanSimulator.Api.Services;
using OceanSimulator.Application.DTOs;
using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

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
    
    private object BuildGridResponse(IOcean ocean)
    {
        var cells = new List<List<object>>();
        for (int r = 0; r < ocean.Rows; r++)
        {
            var row = new List<object>();
            for (int c = 0; c < ocean.Cols; c++)
            {
                var pos = new Position(r, c);
                var specimen = ocean.GetSpecimenAt(pos);
                var specimenType = specimen?.Type ?? SpecimenType.Water;
                row.Add(new
                {
                    position = new { row = r, col = c },
                    specimenType = specimenType.ToString(),
                    specimenId = specimen?.Id.ToString()
                });
            }
            cells.Add(row);
        }
        return new { rows = ocean.Rows, cols = ocean.Cols, cells };
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
        var grid = BuildGridResponse(_simulationService.Ocean!);
        
        return Ok(grid);
    }
    
    [HttpPost("snapshot")]
    public async Task<IActionResult> ExecuteSnapshot()
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!);
        var grid = BuildGridResponse(_simulationService.Ocean!);
        
        return Ok(new
        {
            snapshotNumber = result.SnapshotNumber,
            populationCounts = new
            {
                plankton = result.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0),
                sardine = result.PopulationCounts.GetValueOrDefault(SpecimenType.Sardine, 0),
                shark = result.PopulationCounts.GetValueOrDefault(SpecimenType.Shark, 0),
                crab = result.PopulationCounts.GetValueOrDefault(SpecimenType.Crab, 0),
                deadSardine = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadSardine, 0),
                deadShark = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadShark, 0)
            },
            totalBirths = result.TotalBirths,
            totalDeaths = result.TotalDeaths,
            isExtinctionReached = result.IsExtinctionReached,
            grid
        });
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
    public async Task<IActionResult> Save()
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");

        var ms = new MemoryStream();
        await _repository.SaveAsync(_simulationService.Ocean!, ms);
        return File(ms.ToArray(), "application/json", "ocean-state.json");
    }

    [HttpPost("load")]
    public async Task<IActionResult> Load(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        using var stream = file.OpenReadStream();
        IOcean ocean;
        try
        {
            ocean = await _repository.LoadAsync(stream);
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to load simulation state: {ex.Message}");
        }

        _simulationService.SetOcean(ocean);
        var grid = BuildGridResponse(ocean);

        return Ok(new
        {
            snapshotNumber = 0,
            populationCounts = new
            {
                plankton    = ocean.GetSpecimenCount(SpecimenType.Plankton),
                sardine     = ocean.GetSpecimenCount(SpecimenType.Sardine),
                shark       = ocean.GetSpecimenCount(SpecimenType.Shark),
                crab        = ocean.GetSpecimenCount(SpecimenType.Crab),
                deadSardine = ocean.GetSpecimenCount(SpecimenType.DeadSardine),
                deadShark   = ocean.GetSpecimenCount(SpecimenType.DeadShark)
            },
            totalBirths         = 0,
            totalDeaths         = 0,
            isExtinctionReached = false,
            grid
        });
    }
    
    [HttpPost("run/extinction")]
    public async Task<IActionResult> RunUntilExtinction([FromBody] RunUntilExtinctionRequest request)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        int maxIterations = 10000;
        int iteration = 0;
        object? lastResult = null;
        
        while (iteration < maxIterations)
        {
            var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!);
            var grid = BuildGridResponse(_simulationService.Ocean!);
            
            lastResult = new
            {
                snapshotNumber = result.SnapshotNumber,
                populationCounts = new
                {
                    plankton = result.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0),
                    sardine = result.PopulationCounts.GetValueOrDefault(SpecimenType.Sardine, 0),
                    shark = result.PopulationCounts.GetValueOrDefault(SpecimenType.Shark, 0),
                    crab = result.PopulationCounts.GetValueOrDefault(SpecimenType.Crab, 0),
                    deadSardine = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadSardine, 0),
                    deadShark = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadShark, 0)
                },
                totalBirths = result.TotalBirths,
                totalDeaths = result.TotalDeaths,
                isExtinctionReached = result.IsExtinctionReached,
                grid
            };
            
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
        
        return Ok(lastResult);
    }
    
    [HttpPost("run/event")]
    public async Task<IActionResult> RunUntilEvent()
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");

        int maxIterations = 10000;

        for (int i = 0; i < maxIterations; i++)
        {
            var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!);
            var grid = BuildGridResponse(_simulationService.Ocean!);

            if (result.TotalBirths > 0 || result.TotalDeaths > 0 || result.IsExtinctionReached)
            {
                return Ok(new
                {
                    snapshotNumber = result.SnapshotNumber,
                    populationCounts = new
                    {
                        plankton    = result.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0),
                        sardine     = result.PopulationCounts.GetValueOrDefault(SpecimenType.Sardine, 0),
                        shark       = result.PopulationCounts.GetValueOrDefault(SpecimenType.Shark, 0),
                        crab        = result.PopulationCounts.GetValueOrDefault(SpecimenType.Crab, 0),
                        deadSardine = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadSardine, 0),
                        deadShark   = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadShark, 0)
                    },
                    totalBirths         = result.TotalBirths,
                    totalDeaths         = result.TotalDeaths,
                    isExtinctionReached = result.IsExtinctionReached,
                    grid
                });
            }
        }

        // No event found in maxIterations — return the last state anyway
        var lastGrid = BuildGridResponse(_simulationService.Ocean!);
        var ocean = _simulationService.Ocean!;
        return Ok(new
        {
            snapshotNumber = maxIterations,
            populationCounts = new
            {
                plankton    = ocean.GetSpecimenCount(SpecimenType.Plankton),
                sardine     = ocean.GetSpecimenCount(SpecimenType.Sardine),
                shark       = ocean.GetSpecimenCount(SpecimenType.Shark),
                crab        = ocean.GetSpecimenCount(SpecimenType.Crab),
                deadSardine = ocean.GetSpecimenCount(SpecimenType.DeadSardine),
                deadShark   = ocean.GetSpecimenCount(SpecimenType.DeadShark)
            },
            totalBirths         = 0,
            totalDeaths         = 0,
            isExtinctionReached = false,
            grid = lastGrid
        });
    }
}
