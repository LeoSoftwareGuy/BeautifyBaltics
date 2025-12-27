using BeautifyBaltics.Domain.SeedWork;
using BeautifyBaltics.Persistence;
using JasperFx.Core;
using Marten;

namespace BeautifyBaltics.Infrastructure
{
    public class DocumentSessionListener : DocumentSessionListenerBase
    {
        public override Task BeforeSaveChangesAsync(IDocumentSession session, CancellationToken token)
        {
            var userIdString = session.GetHeader(MartenEventMetadata.UserId) as string;

            if (Guid.TryParse(userIdString, out var userId))
            {
                session.PendingChanges.InsertsFor<IAudited>()
                    .Each(x =>
                    {
                        x.CreatedById = userId;
                        x.ModifiedById = userId;
                    });
                session.PendingChanges.UpdatesFor<IAudited>()
                    .Each(x =>
                    {
                        if (x.CreatedById == Guid.Empty) x.CreatedById = userId;
                        x.ModifiedById = userId;
                    });
            }

            return base.BeforeSaveChangesAsync(session, token);
        }
    }

}
