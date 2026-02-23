using OceanSimulator.Domain.Events;

namespace OceanSimulator.Domain.Interfaces;

public interface IOceanEventPublisher
{
    Task PublishAsync(OceanEvent oceanEvent);
}
