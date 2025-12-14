using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder
    .AddPostgres("postgres", port: 5432)
    .WithDataVolume();

var database = postgres.AddDatabase("beautifybaltics-db", "beautify_baltics_db");

var keyVaultConnectionString = builder.AddConnectionString("key-vault");

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

var coreApi = builder.AddProject<Projects.BeautifyBaltics_Core_API>("core-api")
    .WithReference(postgres)
    .WithReference(database)
    .WithReference(blobStorage)
    .WithReference(keyVaultConnectionString)
    .WithExternalHttpEndpoints()
    .WaitFor(postgres)
    .WaitFor(blobStorage)
    .WaitFor(dataProtectionKeys);

builder.AddNpmApp("back-office-app", "../BeautifyBaltics.Apps", "serve:back-office")
    .WithReference(coreApi)
    .WithHttpEndpoint(port: 4300, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile(c =>
    {
        c.WithBuildArg("APP_NAME", "back-office");
    })
    .WaitFor(coreApi);

builder.Build().Run();
