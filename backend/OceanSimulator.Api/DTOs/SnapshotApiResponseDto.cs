namespace OceanSimulator.Api.DTOs;

public class SnapshotApiResponseDto
{
    public int SnapshotNumber { get; set; }
    public PopulationCountsApiDto PopulationCounts { get; set; } = new();
    public int TotalBirths { get; set; }
    public int TotalDeaths { get; set; }
    public bool IsExtinctionReached { get; set; }
    public OceanGridApiDto Grid { get; set; } = new();
}

public class PopulationCountsApiDto
{
    public int Plankton { get; set; }
    public int Sardine { get; set; }
    public int Shark { get; set; }
    public int Crab { get; set; }
    public int DeadSardine { get; set; }
    public int DeadShark { get; set; }
}
