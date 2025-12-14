using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.SeedWork;

public interface ICommandRepository
{
    Guid StartStream<TAggregate>(params object[] events) where TAggregate : Aggregate;
    void Append<TAggregate>(Guid id, params object[] events) where TAggregate : Aggregate;
    TEntity Insert<TEntity>(TEntity entity) where TEntity : IDocument;
    void Update<TEntity>(TEntity entity) where TEntity : IDocument;
    void Delete<TEntity>(TEntity entity) where TEntity : IDocument;
    void HardDelete<TEntity>(TEntity entity) where TEntity : IDocument;
}
