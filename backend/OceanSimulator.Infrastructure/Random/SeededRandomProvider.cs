using OceanSimulator.Domain.Interfaces;

namespace OceanSimulator.Infrastructure.Random;

public class SeededRandomProvider : IRandomProvider
{
    private readonly System.Random _rng;
    
    public SeededRandomProvider(int? seed = null)
    {
        _rng = seed.HasValue ? new System.Random(seed.Value) : new System.Random();
    }
    
    public int Next(int minValue, int maxValue)
    {
        return _rng.Next(minValue, maxValue);
    }
    
    public int Next(int maxValue)
    {
        return _rng.Next(maxValue);
    }
    
    public double NextDouble()
    {
        return _rng.NextDouble();
    }
    
    public void Shuffle<T>(IList<T> list)
    {
        int n = list.Count;
        for (int i = n - 1; i > 0; i--)
        {
            int j = _rng.Next(i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }
    }
    
    public T Choose<T>(IList<T> items)
    {
        if (items.Count == 0)
            throw new ArgumentException("Cannot choose from empty list", nameof(items));
        return items[_rng.Next(items.Count)];
    }
}
