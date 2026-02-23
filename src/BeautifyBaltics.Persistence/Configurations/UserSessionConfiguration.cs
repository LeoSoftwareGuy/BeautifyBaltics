using BeautifyBaltics.Domain.Documents;

using Marten;

namespace BeautifyBaltics.Persistence.Configurations;

public class UserSessionConfiguration : IConfigureMarten
{
    public void Configure(IServiceProvider services, StoreOptions options)
    {
        options.Schema.For<UserSession>()
            .DocumentAlias("user_session")
            .Index(x => x.UserId);
    }
}
