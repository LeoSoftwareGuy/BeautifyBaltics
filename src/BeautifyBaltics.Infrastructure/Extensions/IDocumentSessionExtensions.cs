using Marten;

namespace BeautifyBaltics.Infrastructure.Extensions
{
    public static class IDocumentSessionExtensions
    {
        public static async Task<T> LoadRequiredAsync<T>(this IDocumentSession documentSession, object id, CancellationToken cancellationToken = default)
            where T : notnull
        {
            var doc = await documentSession.LoadAsync<T>(id, cancellationToken);
            if (doc is null) throw new InvalidOperationException($"Document of type {typeof(T).Name} with ID {id} not found.");
            return doc;
        }
    }
}
