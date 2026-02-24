var builder = DistributedApplication.CreateBuilder(args);

// Add the backend API project
var api = builder.AddProject<Projects.OceanSimulator_Api>("api")
    .WithExternalHttpEndpoints();

// Add the Vite frontend with npm integration
var frontend = builder.AddNpmApp("frontend", "../../frontend", "dev")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
