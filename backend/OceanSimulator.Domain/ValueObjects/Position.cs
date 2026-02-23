namespace OceanSimulator.Domain.ValueObjects;

public record Position(int Row, int Col)
{
    public IEnumerable<Position> GetAdjacentPositions(int maxRows, int maxCols)
    {
        for (int dr = -1; dr <= 1; dr++)
        for (int dc = -1; dc <= 1; dc++)
        {
            if (dr == 0 && dc == 0) continue;
            int newRow = Row + dr;
            int newCol = Col + dc;
            if (newRow >= 0 && newRow < maxRows && newCol >= 0 && newCol < maxCols)
                yield return new Position(newRow, newCol);
        }
    }
}
