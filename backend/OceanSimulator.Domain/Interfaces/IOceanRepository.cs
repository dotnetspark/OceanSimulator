namespace OceanSimulator.Domain.Interfaces;

public interface IOceanRepository
{
    Task SaveAsync(IOcean ocean, string filePath);
    Task SaveAsync(IOcean ocean, Stream stream);
    Task<IOcean> LoadAsync(string filePath);
    Task<IOcean> LoadAsync(Stream stream);
}
