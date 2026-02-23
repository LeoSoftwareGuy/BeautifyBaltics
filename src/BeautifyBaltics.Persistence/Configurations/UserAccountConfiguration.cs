using BeautifyBaltics.Domain.Documents;

using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class UserAccountConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<UserAccount>()
            .DocumentAlias("user_account")
            .UniqueIndex(x => x.Email);
    }
}
