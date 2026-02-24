namespace OceanSimulator.Api.DTOs;

public class OceanGridApiDto
{
    public int Rows { get; set; }
    public int Cols { get; set; }
    public CellApiDto[][] Cells { get; set; } = [];
}

public class CellApiDto
{
    public PositionApiDto Position { get; set; } = new();
    public string SpecimenType { get; set; } = "Water";
    public string? SpecimenId { get; set; }
}

public class PositionApiDto
{
    public int Row { get; set; }
    public int Col { get; set; }
}
