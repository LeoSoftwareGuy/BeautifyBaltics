using BeautifyBaltics.Core.API.Middlewares;
using BeautifyBaltics.Infrastructure;
using BeautifyBaltics.Persistence;
using BeautifyBaltics.ServiceDefaults;
using JasperFx;
using JasperFx.CodeGeneration;
using JasperFx.Resources;
using Mapster;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Wolverine;
using Wolverine.Http;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddNpgsqlDataSource(connectionName: "postgres", s => { s.DisableHealthChecks = true; });

// Register Azure Blob Storage clients in the IoC container
builder.AddAzureBlobServiceClient(connectionName: "blobs", s =>
{
    s.DisableHealthChecks = true;
    s.DisableTracing = false;
});

builder.Logging.AddSimpleConsole(o =>
{
    o.IncludeScopes = true;
});

builder.Services.AddHttpContextAccessor();

// Register Mapster in the IoC container
builder.Services.AddMapster();

// Register exceptions handling
builder.Services.AddDefaultExceptionHandler();

builder.Services.AddMartenDefaults(builder.Configuration, builder.Environment, null);

builder.Services.ConfigurePersistence();

builder.Services.AddWolverineDefaults(o =>
{
    o.ApplicationAssembly = typeof(Program).Assembly;

    if (builder.Environment.IsDevelopment())
    {
        // https://wolverinefx.net/guide/durability/leadership-and-troubleshooting.html#solo-mode
        o.Durability.Mode = DurabilityMode.Solo;
    }
});

// Configure Wolverine to use the current tenant ID from the HTTP context
// A custom middleware that extracts the tenant ID from the HTTP request and sets it in the Wolverine context
builder.Services.AddWolverineTenantDetection();


builder.Services.AddPersistenceServices();
builder.Services.AddInfrastructureServices();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

//if (!builder.Environment.IsIntegrationTesting())
//{
    // Configure CritterStack defaults
    builder.Services.CritterStackDefaults(x =>
    {
        x.ApplicationAssembly = typeof(Program).Assembly;

        x.Production.GeneratedCodeMode = TypeLoadMode.Auto; // TODO: switch to Static if codegen write issues are resolved
        x.Production.ResourceAutoCreate = AutoCreate.None;
        x.Production.SourceCodeWritingEnabled = false;
    });
//}

builder.Services.AddAuthorization();

var bytes = Encoding.UTF8.GetBytes(builder.Configuration["Authentication:JwtSecret"]!);

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(bytes),
        ValidAudience = builder.Configuration["Authentication:ValidAudience"],
        ValidIssuer = builder.Configuration["Authentication:ValidIssuer"]
    };
});

builder.Services.AddRequestTimeouts();
builder.Services.AddOutputCache();

// Configure Wolverine to use CritterStack for resource management
builder.Host.UseResourceSetupOnStartup();

var app = builder.Build();

app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseStatusCodePages();

app.MapDefaultEndpoints();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseRequestTimeouts();
app.UseOutputCache();

app.MapControllers();

app.MapDeadLettersEndpoints("/api/v1/debug/dead-letters").WithTags("Debug");

return await app.RunJasperFxCommands(args);
