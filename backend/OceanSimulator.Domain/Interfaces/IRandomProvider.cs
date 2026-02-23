namespace OceanSimulator.Domain.Interfaces;

public interface IRandomProvider
{
    int Next(int minValue, int maxValue);
    int Next(int maxValue);
    double NextDouble();
    void Shuffle<T>(IList<T> list);
    T Choose<T>(IList<T> items);
}
