using Microsoft.Extensions.Hosting;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = DistributedApplication.CreateBuilder(args);

        var postgresServer = builder
            .AddPostgres("postgres-server", port: 5432)
            .WithDataVolume()
            .WithPgAdmin(c => c.WithHostPort(5100));

        var database = postgresServer.AddDatabase("postgres", "beautify_baltics_db");

        var storage = builder.AddAzureStorage("storage");
        if (builder.Environment.IsDevelopment())
        {
            storage.RunAsEmulator(c =>
            {
                c.WithBlobPort(10000).WithQueuePort(10001).WithTablePort(10002);
                c.WithDataVolume();
            });
        }

        var blobStorage = storage.AddBlobs("blobs");
        var dataProtectionKeys = storage.AddBlobContainer("data-protection");

        var coreApi = builder.AddProject("core-api", "../BeautifyBaltics.Core.API/BeautifyBaltics.Core.API.csproj")
            .WithReference(database)
            .WithReference(blobStorage)
            .WithExternalHttpEndpoints()
            .WaitFor(postgresServer)
            .WaitFor(blobStorage)
            .WaitFor(dataProtectionKeys);

        builder.AddNpmApp("back-office-app", "../BeautifyBaltics.Apps", "serve:back-office")
            .WithEnvironment("NODE_ENV", "development")
            .WithReference(coreApi)
            .WithHttpEndpoint(port: 4300, env: "PORT")
            .WithExternalHttpEndpoints()
            .PublishAsDockerFile(c =>
            {
                c.WithBuildArg("APP_NAME", "back-office");
            })
            .WaitFor(coreApi);

        builder.Build().Run();
    }
}