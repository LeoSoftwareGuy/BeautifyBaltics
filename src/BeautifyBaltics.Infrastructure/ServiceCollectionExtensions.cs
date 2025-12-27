using BeautifyBaltics.Infrastructure.Extensions;
using JasperFx;
using JasperFx.Events;
using JasperFx.Events.Daemon;
using Marten;
using Marten.Services;
using Marten.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Wolverine;
using Wolverine.ErrorHandling;
using Wolverine.FluentValidation;
using Wolverine.Http;

namespace BeautifyBaltics.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddWolverineDefaults(this IServiceCollection services, Action<WolverineOptions>? configure) =>
       services.AddWolverine(o =>
       {
           // Apply the validation middleware *and* discover and register
           // Fluent Validation validators
           o.UseFluentValidation();

           // If we encounter a concurrency exception, just try it immediately
           // up to 3 times total
           o.Policies.OnException<ConcurrencyException>().RetryTimes(3);

           // // It's an imperfect world, and sometimes transient connectivity errors
           // // to the database happen
           // o.Policies.OnException<NpgsqlException>()
           //     .RetryWithCooldown(50.Milliseconds(), 100.Milliseconds(), 250.Milliseconds());

           o.Policies.LogMessageStarting(LogLevel.Information);

           // Automatic usage of transactional middleware as
           // Wolverine recognizes that an HTTP endpoint or message handler
           // persists data
           o.Policies.AutoApplyTransactions();

           // Ensures messages are persisted until processed
           o.Policies.UseDurableLocalQueues();

           // Stamping Marten events with user/session information
         //  o.Policies.AddMiddleware(typeof(StampMartenEventMetadata));

           // Applying additional configurations provided by the caller
           configure?.Invoke(o);
       });

    public static MartenServiceCollectionExtensions.MartenConfigurationExpression AddMartenDefaults(
         this IServiceCollection services,
         IConfigurationManager configurationManager,
         IHostEnvironment environment,
         Action<StoreOptions>? configure
     )
    {
        var connectionString = configurationManager.GetConnectionString("postgres") ?? throw new ArgumentException("Postgres connection string is required", nameof(configurationManager));
        var tenantIds = configurationManager.GetSection("Tenants").Get<Dictionary<string, string>>()?.Keys.ToArray()
                       ?? throw new ArgumentException("tenants");

        const string databaseName = "beatify_baltics_db";

        return services.AddMarten(options =>
            {
                options.UseSystemTextJsonForSerialization(casing: Casing.CamelCase);

                options.Connection($"{connectionString};Database={databaseName}");

                options.MultiTenantedWithSingleServer($"{connectionString};Database={databaseName}", t =>
                {
                    t.WithTenants(tenantIds).InDatabaseNamed(databaseName);
                });

                options.DatabaseSchemaName = "app";
                options.Events.DatabaseSchemaName = "event";
                // Turn on Otel tracing for connection activity, and
                // also tag events to each span for all the Marten "write"
                // operations 
                options.OpenTelemetry.TrackConnections = TrackLevel.Verbose;
                options.OpenTelemetry.TrackEventCounters();

                options.Events.TenancyStyle = TenancyStyle.Conjoined;

                options.Events.MetadataConfig.HeadersEnabled = true;
                options.Events.MetadataConfig.CausationIdEnabled = true;
                options.Events.MetadataConfig.CorrelationIdEnabled = true;

                // Reduce the number of database queries necessary to process projections
                // during CQRS command handling with certain workflows
                options.Events.UseIdentityMapForAggregates = true;
                // Turn on the PostgreSQL table partitioning for
                // hot/cold storage on archived events
                options.Events.UseArchivedStreamPartitioning = true;
                // Use the *much* faster workflow for appending events
                // at the cost of *some* loss of metadata usage for
                // inline projections
                options.Events.AppendMode = EventAppendMode.Quick;
                // Opts into a mode where Marten is able to rebuild single
                // stream projections faster by building one stream at a time
                options.Events.UseOptimizedProjectionRebuilds = true;

                // Give the high‐water checker 30 seconds before skipping
                options.Projections.StaleSequenceThreshold = TimeSpan.FromSeconds(30);

                // Marking all documents as multi-tenanted (Conjoined) by default
                // This can be overridden on a per-document basis
                options.Policies.AllDocumentsAreMultiTenanted();

                options.Policies.ForAllDocuments(x =>
                {
                    x.Metadata.CausationId.Enabled = true;
                    x.Metadata.CorrelationId.Enabled = true;
                    x.Metadata.Headers.Enabled = true;
                    x.Metadata.CreatedAt.Enabled = true;
                    x.Metadata.LastModified.Enabled = true;
                    x.Metadata.LastModifiedBy.Enabled = false;
                });

                options.Listeners.Add(new DocumentSessionListener());

                configure?.Invoke(options);
            })
            .UseNpgsqlDataSource()
            .UseLightweightSessions()
            .AddAsyncDaemon(environment.IsDevelopment() ? DaemonMode.Solo : DaemonMode.HotCold)
            .ApplyAllDatabaseChangesOnStartup();
    }

    public static IServiceCollection AddWolverineTenantDetection(this IServiceCollection services)
    {
        var options = new WolverineHttpOptions();
        options.TenantId.IsClaimTypeNamed(CustomClaimTypes.TenantId);
        services.AddSingleton(options);
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        return services;
    }
}
