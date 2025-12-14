using BeautifyBaltics.Persistence.Configurations;
using BeautifyBaltics.Persistence.Repositories;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Client;
using BeautifyBaltics.Persistence.Repositories.Job;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

using Marten;

using Microsoft.Extensions.DependencyInjection;

namespace BeautifyBaltics.Persistence;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection ConfigurePersistence(this IServiceCollection services)
    {
        services.AddSingleton<IConfigureMarten, MasterConfiguration>();
        services.AddSingleton<IConfigureMarten, BookingConfiguration>();
        services.AddSingleton<IConfigureMarten, ClientConfiguration>();
        services.AddSingleton<IConfigureMarten, MasterJobConfiguration>();
        services.AddSingleton<IConfigureMarten, JobConfiguration>();

        return services;
    }

    public static IServiceCollection AddPersistenceServices(this IServiceCollection services)
    {
        services.AddScoped<ICommandRepository, CommandRepository>();
        services.AddScoped<IMasterRepository, MasterRepository>();
        services.AddScoped<IMasterJobRepository, MasterJobRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<IJobRepository, JobRepository>();

        return services;
    }
}
