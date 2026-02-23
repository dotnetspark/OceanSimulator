namespace OceanSimulator.Domain.Interfaces;

public interface IOceanRepository
{
    Task SaveAsync(IOcean ocean, string filePath);
    Task<IOcean> LoadAsync(string filePath);
}
