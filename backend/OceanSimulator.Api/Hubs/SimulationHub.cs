using Microsoft.AspNetCore.SignalR;
using OceanSimulator.Domain.Events;
using OceanSimulator.Domain.Interfaces;

namespace OceanSimulator.Api.Hubs;

public class SimulationHub : Hub
{
    public async Task SubscribeToEvents()
    {
        await Clients.Caller.SendAsync("Subscribed", "Successfully subscribed to ocean events");
    }
}

public class SignalREventPublisher : IOceanEventPublisher
{
    private readonly IHubContext<SimulationHub> _hubContext;
    
    public SignalREventPublisher(IHubContext<SimulationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    
    public async Task PublishAsync(OceanEvent oceanEvent)
    {
        await _hubContext.Clients.All.SendAsync("OceanEvent", oceanEvent);
    }
}
