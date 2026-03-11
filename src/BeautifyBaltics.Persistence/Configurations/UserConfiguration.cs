using BeautifyBaltics.Domain.Aggregates.User.Events;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class UserConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Events.AddEventType(typeof(UserRegistered));
        options.Events.AddEventType(typeof(UserRoleChanged));
        options.Events.AddEventType(typeof(UserEmailVerified));
        options.Events.AddEventType(typeof(UserPasswordChanged));
        options.Events.AddEventType(typeof(UserDeleted));
    }
}
