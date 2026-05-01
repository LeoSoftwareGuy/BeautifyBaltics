using BeautifyBaltics.Core.API.Application.Booking.BackgroundServices;
using BeautifyBaltics.Core.API.Authentication;
using BeautifyBaltics.Core.API.Middlewares;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Infrastructure;
using BeautifyBaltics.Integrations.BlobStorage;
using BeautifyBaltics.Integrations.Didit;
using BeautifyBaltics.Integrations.Notifications;
using BeautifyBaltics.Persistence;
using BeautifyBaltics.ServiceDefaults;
using BeautifyBaltics.ServiceDefaults.Extensions;
using JasperFx;
using JasperFx.CodeGeneration;
using JasperFx.Resources;
using Mapster;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using Wolverine;
using Wolverine.Http;
using Wolverine.Marten;

internal class Program
{
    private static async Task<int> Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.AddServiceDefaults();
        builder.AddNpgsqlDataSource(connectionName: "postgres", s => { s.DisableHealthChecks = true; });

        builder.Logging.AddSimpleConsole(o =>
        {
            o.IncludeScopes = true;
        });

        builder.Services.AddHttpContextAccessor();

        // Register Mapster in the IoC container
        builder.Services.AddMapster();

        builder.Services.Configure<SupabaseBlobStorageOptions>(opt =>
        {
            opt.Url = builder.Configuration["Supabase:Url"]!;
            opt.ServiceRoleKey = builder.Configuration["Supabase:ServiceRoleKey"]!;
        });

        builder.Services.AddBlobStorageIntegration(c =>
        {
            c.Configure<MasterAggregate.MasterProfileImage>(opt => opt.ContainerName = "master-profile-images");
            c.Configure<MasterAggregate.MasterJobImage>(opt => opt.ContainerName = "master-job-images");
            c.Configure<ClientAggregate.ClientProfileImage>(opt => opt.ContainerName = "client-profile-images");
        });

        builder.Services.AddNotificationsIntegration(builder.Configuration);
        builder.Services.AddDiditIntegration(builder.Configuration);

        // Register exceptions handling
        builder.Services.AddDefaultExceptionHandler();

        builder.Services.AddMartenDefaults(builder.Configuration, builder.Environment, null)
        .ProcessEventsWithWolverineHandlersInStrictOrder("bookings", o =>
        {
            o.IncludeType<BookingCreated>();
            o.IncludeType<BookingConfirmed>();
            o.IncludeType<BookingCancelled>();
        });

        builder.Services.ConfigurePersistence();

        builder.Services.AddWolverineDefaults(o =>
        {
            o.ApplicationAssembly = typeof(Program).Assembly;

            o.Durability.Mode = DurabilityMode.Solo;
        });

        builder.Services.AddPersistenceServices();
        builder.Services.AddInfrastructureServices();

        builder.Services.AddHostedService<BookingCompletionBackgroundService>();
        builder.Services.AddHostedService<BookingExpirationBackgroundService>();

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;

            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });

        builder.Services.CritterStackDefaults(x =>
        {
            x.ApplicationAssembly = typeof(Program).Assembly;

            x.Production.GeneratedCodeMode = TypeLoadMode.Auto;
            x.Production.ResourceAutoCreate = AutoCreate.CreateOrUpdate;
            x.Production.SourceCodeWritingEnabled = false;
        });

        // Cookie authentication with server-side session store
        builder.Services.AddScoped<CustomCookieAuthenticationEvents>();
        builder.Services.AddSingleton<ITicketStore, UserSessionTicketStore>();

        builder.Services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.Cookie.Name = "bb.auth.session";
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.ExpireTimeSpan = TimeSpan.FromDays(30);
                options.SlidingExpiration = true;
                options.EventsType = typeof(CustomCookieAuthenticationEvents);
            });

        // Wire SessionTicketStore after registration
        builder.Services.AddOptions<CookieAuthenticationOptions>(CookieAuthenticationDefaults.AuthenticationScheme)
            .Configure<ITicketStore>((o, store) => o.SessionStore = store);

        // Data Protection — ephemeral keys (acceptable for MVP; add persistence once user base grows)
        builder.Services.AddDataProtection()
            .SetApplicationName("BeautifyBaltics");

        builder.Services.AddAuthorization();

        builder.AddDefaultHealthChecks()
            .AddNpgSql(name: "npgsql");

        builder.Services.AddApiControllers(o =>
        {
            o.Groups.Add(new ApiGroup
            {
                Assembly = typeof(Program).Assembly,
                GroupName = "core-api",
                RoutePrefix = "api/v1"
            });
        });

        builder.Services.AddOpenApi(o =>
        {
            o.Docs.Add(("core-api", new OpenApiInfo
            {
                Title = "Beautify Baltics Core API",
                Version = "v1",
                Description = "Beautify Baltics Core API for back-office operations"
            }));

            o.Assemblies = [typeof(Program).Assembly];
        });

        builder.Services.AddRequestTimeouts();
        builder.Services.AddOutputCache();

        // Configure Wolverine to use CritterStack for resource management
        builder.Host.UseResourceSetupOnStartup();

        var app = builder.Build();

        app.UseForwardedHeaders();

        // Configure the HTTP request pipeline.
        app.UseOpenApiUI(o =>
        {
            o.Title = "BB Core.API Docs";
            o.Documents =
            [
                new ScalarDocument("core-api", "Core API"),
            ];
        });

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
    }
}
