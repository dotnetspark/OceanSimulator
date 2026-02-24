var builder = DistributedApplication.CreateBuilder(args);
var api = builder.AddProject<Projects.OceanSimulator_Api>("api");
var frontend = builder.AddViteApp("frontend", "../../frontend")
    .WithEnvironment("BROWSER", "none")
    .WithReference(api)
    .WaitFor(api);
var proxy = builder.AddYarp("oceanproxy")
    .WithExternalHttpEndpoints()
    .WithConfiguration(yarp =>
    {
        yarp.AddRoute("/api/{**catch-all}", api);
        yarp.AddRoute(frontend);
    });
builder.Build().Run();
