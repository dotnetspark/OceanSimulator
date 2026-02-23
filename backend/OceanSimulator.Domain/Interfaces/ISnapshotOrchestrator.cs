using OceanSimulator.Domain.Entities;

namespace OceanSimulator.Domain.Interfaces;

public interface ISnapshotOrchestrator
{
    Task<SnapshotResult> ExecuteSnapshotAsync(IOcean ocean, CancellationToken cancellationToken = default);
}
