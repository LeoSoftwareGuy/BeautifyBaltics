using JasperFx.Events;
using Marten;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Wolverine;
using Wolverine.Marten;

namespace BeautifyBaltics.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMartenDefaults(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("postgres") ?? throw new ArgumentException("Postgres connection string is required", nameof(configuration));

        services.AddMarten(options =>
            {
                options.Connection(connectionString);
                options.DatabaseSchemaName = "app";
                options.Events.DatabaseSchemaName = "event";
                options.Events.StreamIdentity = StreamIdentity.AsGuid;
            })
            .UseLightweightSessions()
            .IntegrateWithWolverine();

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        return services;
    }

    public static WebApplicationBuilder AddWolverineDefaults(this WebApplicationBuilder builder)
    {
        builder.Host.UseWolverine((context, options) =>
        {
            options.UseFluentValidation();
            options.ApplicationAssembly = typeof(ServiceCollectionExtensions).Assembly;
        });

        return builder;
    }
}
