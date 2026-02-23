namespace OceanSimulator.Tests.Mocks;

using OceanSimulator.Domain.Interfaces;

public class MockRandomProvider : IRandomProvider
{
    private readonly Queue<int> _intQueue;
    private readonly Queue<double> _doubleQueue;
    private readonly List<int> _originalInts;
    
    public MockRandomProvider(IEnumerable<int>? ints = null, IEnumerable<double>? doubles = null)
    {
        _originalInts = (ints ?? Array.Empty<int>()).ToList();
        _intQueue = new Queue<int>(_originalInts);
        _doubleQueue = new Queue<double>(doubles ?? Array.Empty<double>());
    }
    
    public int Next(int maxValue)
    {
        if (_intQueue.TryDequeue(out var v))
            return v % maxValue;
        return 0;
    }
    
    public int Next(int minValue, int maxValue)
    {
        return minValue + Next(maxValue - minValue);
    }
    
    public double NextDouble()
    {
        return _doubleQueue.TryDequeue(out var v) ? v : 0.0;
    }
    
    public void Shuffle<T>(IList<T> list)
    {
        // Deterministic shuffle: reverse the list for testing predictability
        var temp = list.ToArray();
        for (int i = 0; i < list.Count; i++)
        {
            list[i] = temp[list.Count - 1 - i];
        }
    }
    
    public T Choose<T>(IList<T> items)
    {
        if (items.Count == 0)
            throw new InvalidOperationException("Cannot choose from empty list");
        return items[Next(items.Count)];
    }
}
