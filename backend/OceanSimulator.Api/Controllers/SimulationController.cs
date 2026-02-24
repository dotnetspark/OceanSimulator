using Microsoft.AspNetCore.Mvc;
using OceanSimulator.Api.DTOs;
using OceanSimulator.Api.Services;
using OceanSimulator.Application.DTOs;
using OceanSimulator.Domain.Entities;
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

    // ── helpers ─────────────────────────────────────────────────────────────

    private static OceanGridApiDto BuildGrid(IOcean ocean)
    {
        var cells = new CellApiDto[ocean.Rows][];
        for (int row = 0; row < ocean.Rows; row++)
        {
            cells[row] = new CellApiDto[ocean.Cols];
            for (int col = 0; col < ocean.Cols; col++)
            {
                var pos = new OceanSimulator.Domain.ValueObjects.Position(row, col);
                var specimen = ocean.GetSpecimenAt(pos);
                cells[row][col] = new CellApiDto
                {
                    Position = new PositionApiDto { Row = row, Col = col },
                    SpecimenType = (specimen?.Type ?? SpecimenType.Water).ToString(),
                    SpecimenId = specimen?.Id.ToString()
                };
            }
        }
        return new OceanGridApiDto { Rows = ocean.Rows, Cols = ocean.Cols, Cells = cells };
    }

    private static SnapshotApiResponseDto BuildResponse(SnapshotResult result, IOcean ocean) =>
        new()
        {
            SnapshotNumber = result.SnapshotNumber,
            PopulationCounts = new PopulationCountsApiDto
            {
                Plankton    = result.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0),
                Sardine     = result.PopulationCounts.GetValueOrDefault(SpecimenType.Sardine,  0),
                Shark       = result.PopulationCounts.GetValueOrDefault(SpecimenType.Shark,    0),
                Crab        = result.PopulationCounts.GetValueOrDefault(SpecimenType.Crab,     0),
                DeadSardine = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadSardine, 0),
                DeadShark   = result.PopulationCounts.GetValueOrDefault(SpecimenType.DeadShark,   0),
            },
            TotalBirths        = result.TotalBirths,
            TotalDeaths        = result.TotalDeaths,
            IsExtinctionReached = result.IsExtinctionReached,
            Grid = BuildGrid(ocean)
        };

    // ── endpoints ────────────────────────────────────────────────────────────

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
        return Ok(BuildGrid(_simulationService.Ocean!));
    }
    
    [HttpPost("snapshot")]
    public async Task<IActionResult> ExecuteSnapshot(CancellationToken cancellationToken)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!, cancellationToken);
        return Ok(BuildResponse(result, _simulationService.Ocean!));
    }
    
    [HttpPost("snapshots/{n}")]
    public async Task<IActionResult> ExecuteNSnapshots(int n, CancellationToken cancellationToken)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");

        SnapshotResult? last = null;
        for (int i = 0; i < n; i++)
        {
            if (cancellationToken.IsCancellationRequested) break;
            last = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!, cancellationToken);
            if (last.IsExtinctionReached) break;
        }
        
        return Ok(last is null ? null : BuildResponse(last, _simulationService.Ocean!));
    }
    
    [HttpGet("state")]
    public IActionResult GetState()
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");
            
        var ocean = _simulationService.Ocean!;
        return Ok(new
        {
            snapshotNumber = 0,
            populationCounts = new PopulationCountsApiDto
            {
                Plankton    = ocean.GetSpecimenCount(SpecimenType.Plankton),
                Sardine     = ocean.GetSpecimenCount(SpecimenType.Sardine),
                Shark       = ocean.GetSpecimenCount(SpecimenType.Shark),
                Crab        = ocean.GetSpecimenCount(SpecimenType.Crab),
                DeadSardine = ocean.GetSpecimenCount(SpecimenType.DeadSardine),
                DeadShark   = ocean.GetSpecimenCount(SpecimenType.DeadShark),
            },
            totalBirths = 0,
            totalDeaths = 0,
            isExtinctionReached = false,
            grid = BuildGrid(ocean)
        });
    }

    [HttpPost("save")]
    public async Task<IActionResult> Save()
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");

        var tempPath = Path.Combine(Path.GetTempPath(), $"ocean-{Guid.NewGuid()}.json");
        await _repository.SaveAsync(_simulationService.Ocean!, tempPath);
        var bytes = await System.IO.File.ReadAllBytesAsync(tempPath);
        System.IO.File.Delete(tempPath);
        return File(bytes, "application/json", "ocean-state.json");
    }

    [HttpPost("load")]
    public async Task<IActionResult> Load(IFormFile file)
    {
        var tempPath = Path.Combine(Path.GetTempPath(), $"ocean-load-{Guid.NewGuid()}.json");
        await using (var stream = System.IO.File.Create(tempPath))
            await file.CopyToAsync(stream);

        var ocean = await _repository.LoadAsync(tempPath);
        System.IO.File.Delete(tempPath);
        _simulationService.SetOcean(ocean);

        var counts = new PopulationCountsApiDto
        {
            Plankton    = ocean.GetSpecimenCount(SpecimenType.Plankton),
            Sardine     = ocean.GetSpecimenCount(SpecimenType.Sardine),
            Shark       = ocean.GetSpecimenCount(SpecimenType.Shark),
            Crab        = ocean.GetSpecimenCount(SpecimenType.Crab),
            DeadSardine = ocean.GetSpecimenCount(SpecimenType.DeadSardine),
            DeadShark   = ocean.GetSpecimenCount(SpecimenType.DeadShark),
        };
        return Ok(new SnapshotApiResponseDto
        {
            SnapshotNumber = 0,
            PopulationCounts = counts,
            TotalBirths = 0,
            TotalDeaths = 0,
            IsExtinctionReached = false,
            Grid = BuildGrid(ocean)
        });
    }
    
    [HttpPost("run/extinction")]
    public async Task<IActionResult> RunUntilExtinction([FromBody] RunUntilExtinctionRequest request, CancellationToken cancellationToken)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");

        SnapshotResult? last = null;
        int maxIterations = 10000;

        for (int i = 0; i < maxIterations; i++)
        {
            if (cancellationToken.IsCancellationRequested) break;
            last = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!, cancellationToken);

            bool done = request.Target.ToLowerInvariant() switch
            {
                "plankton"   => last.PopulationCounts.GetValueOrDefault(SpecimenType.Plankton, 0) == 0,
                "sardine"    => last.PopulationCounts.GetValueOrDefault(SpecimenType.Sardine,  0) == 0,
                "shark"      => last.PopulationCounts.GetValueOrDefault(SpecimenType.Shark,    0) == 0,
                "crab"       => last.PopulationCounts.GetValueOrDefault(SpecimenType.Crab,     0) == 0,
                _            => last.IsExtinctionReached
            };

            if (done) break;
        }
        
        return Ok(last is null ? null : BuildResponse(last, _simulationService.Ocean!));
    }
    
    [HttpPost("run/event")]
    public async Task<IActionResult> RunUntilEvent(CancellationToken cancellationToken)
    {
        if (!_simulationService.IsInitialized)
            return BadRequest("Simulation not initialized");

        // Run snapshots until a birth or death occurs
        int maxIterations = 10000;
        for (int i = 0; i < maxIterations; i++)
        {
            if (cancellationToken.IsCancellationRequested) break;
            var result = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!, cancellationToken);
            if (result.TotalBirths > 0 || result.TotalDeaths > 0 || result.IsExtinctionReached)
                return Ok(BuildResponse(result, _simulationService.Ocean!));
        }

        // No event found — return current state
        var last = await _orchestrator.ExecuteSnapshotAsync(_simulationService.Ocean!, cancellationToken);
        return Ok(BuildResponse(last, _simulationService.Ocean!));
    }
}
