var builder = DistributedApplication.CreateBuilder(args);

// Add the backend API project (internal only)
var api = builder.AddProject<Projects.OceanSimulator_Api>("api");

// Add the Vite frontend with npm integration (internal only)
var frontend = builder.AddNpmApp("frontend", "../../frontend", "dev")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WaitFor(api);

// Add YARP reverse proxy as the single external endpoint
var proxy = builder.AddYarp("oceanproxy")
    .WithExternalHttpEndpoints()
    .WithConfiguration(yarp =>
    {
        // Route API calls to the backend
        yarp.AddRoute("/api/{**catch-all}", api);
        
        // Route all other traffic to the frontend (catch-all)
        yarp.AddRoute(frontend);
    });

builder.Build().Run();
