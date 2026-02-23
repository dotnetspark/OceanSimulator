using OceanSimulator.Domain.Enums;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Domain.ValueObjects;

namespace OceanSimulator.Domain.Entities;

public class Ocean : IOcean
{
    private readonly ISpecimen?[,] _grid;
    private readonly List<ISpecimen> _specimens = new();
    
    public int Rows { get; }
    public int Cols { get; }
    
    public Ocean(int rows, int cols)
    {
        Rows = rows;
        Cols = cols;
        _grid = new ISpecimen?[rows, cols];
    }
    
    public ISpecimen? GetSpecimenAt(Position position)
    {
        if (position.Row < 0 || position.Row >= Rows || position.Col < 0 || position.Col >= Cols)
            return null;
        return _grid[position.Row, position.Col];
    }
    
    public void SetSpecimenAt(Position position, ISpecimen? specimen)
    {
        if (position.Row < 0 || position.Row >= Rows || position.Col < 0 || position.Col >= Cols)
            return;
        _grid[position.Row, position.Col] = specimen;
    }
    
    public SpecimenType GetCellType(Position position)
    {
        var specimen = GetSpecimenAt(position);
        return specimen?.Type ?? SpecimenType.Water;
    }
    
    public IEnumerable<Position> GetAdjacentPositions(Position position)
    {
        return position.GetAdjacentPositions(Rows, Cols);
    }
    
    public IEnumerable<Position> GetEmptyCells(Position position)
    {
        return GetAdjacentPositions(position)
            .Where(p => GetCellType(p) == SpecimenType.Water);
    }
    
    public IEnumerable<Position> GetAdjacentCellsOfType(Position position, SpecimenType type)
    {
        return GetAdjacentPositions(position)
            .Where(p => GetCellType(p) == type);
    }
    
    public void AddSpecimen(ISpecimen specimen)
    {
        _specimens.Add(specimen);
        SetSpecimenAt(specimen.Position, specimen);
    }
    
    public void RemoveSpecimen(Position position)
    {
        var specimen = GetSpecimenAt(position);
        if (specimen != null)
        {
            _specimens.Remove(specimen);
            SetSpecimenAt(position, null);
        }
    }
    
    public IEnumerable<ISpecimen> GetAllSpecimens()
    {
        return _specimens;
    }
    
    public IEnumerable<ISpecimen> GetSpecimensOfType(SpecimenType type)
    {
        return _specimens.Where(s => s.Type == type);
    }
    
    public int GetSpecimenCount(SpecimenType type)
    {
        return _specimens.Count(s => s.Type == type);
    }
}
