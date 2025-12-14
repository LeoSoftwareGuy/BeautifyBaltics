using BeautifyBaltics.Domain.SeedWork;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using Marten;

namespace BeautifyBaltics.Persistence.Repositories;

public class CommandRepository(IDocumentSession session) : ICommandRepository
{
    public Guid StartStream<TAggregate>(params object[] events) where TAggregate : Aggregate =>
        session.Events.StartStream<TAggregate>(events).Id;

    public void Append<TAggregate>(Guid id, params object[] events) where TAggregate : Aggregate =>
        session.Events.Append(id, events);

    public TEntity Insert<TEntity>(TEntity entity) where TEntity : IDocument
    {
        session.Insert(entity);
        return entity;
    }

    public void Update<TEntity>(TEntity entity) where TEntity : IDocument =>
        session.Update(entity);

    public void Delete<TEntity>(TEntity entity) where TEntity : IDocument =>
        session.Delete(entity);

    public void HardDelete<TEntity>(TEntity entity) where TEntity : IDocument =>
        session.HardDelete(entity);
}
