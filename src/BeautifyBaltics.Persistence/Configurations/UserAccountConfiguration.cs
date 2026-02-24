using BeautifyBaltics.Domain.Documents.User;
using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class UserAccountConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<User>()
            .DocumentAlias("user_account")
            .UniqueIndex(x => x.Email);
    }
}
