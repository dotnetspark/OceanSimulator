using OceanSimulator.Api.Hubs;
using OceanSimulator.Api.Services;
using OceanSimulator.Application.Orchestrators;
using OceanSimulator.Domain.Interfaces;
using OceanSimulator.Infrastructure.Random;
using OceanSimulator.Infrastructure.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Application services
builder.Services.AddSingleton<SimulationService>();
builder.Services.AddSingleton<IRandomProvider>(sp => new SeededRandomProvider());
builder.Services.AddScoped<IOceanRepository, JsonOceanRepository>();
builder.Services.AddScoped<IOceanEventPublisher, SignalREventPublisher>();
builder.Services.AddScoped<ISnapshotOrchestrator, SnapshotOrchestrator>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();
app.MapControllers();
app.MapHub<SimulationHub>("/hubs/simulation");

app.Run();
