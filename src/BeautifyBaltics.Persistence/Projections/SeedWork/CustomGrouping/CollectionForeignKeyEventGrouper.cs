using JasperFx.Events;
using JasperFx.Events.Grouping;
using Marten;
using Marten.Events.Aggregation;
using System.Linq.Expressions;

namespace BeautifyBaltics.Persistence.Projections.SeedWork.CustomGrouping
{
    /// <summary>
    /// Fans events of type TEven to all TDoc documents whose collection elements match event keys.
    /// </summary>
    public class CollectionForeignKeyEventGrouper<TDoc, TElem, TKey, TEvent> : IAggregateGrouper<TKey>
        where TDoc : notnull
        where TElem : notnull
        where TKey : notnull
        where TEvent : notnull
    {
        private readonly Func<TDoc, TKey> _docIdFn;
        private readonly Func<TDoc, IEnumerable<TElem>> _collectionFn;
        private readonly Func<TElem, TKey> _elemKeyFn;
        private readonly Func<IEvent<TEvent>, TKey> _eventKeyFn;
        private readonly string _collectionProperty;
        private readonly string _elemKeyProperty;

        public CollectionForeignKeyEventGrouper(
            Expression<Func<TDoc, TKey>> docIdSelector,
            Expression<Func<TDoc, IEnumerable<TElem>>> collectionSelector,
            Expression<Func<TElem, TKey>> elemKeySelector,
            Func<IEvent<TEvent>, TKey> eventKeySelector)
        {
            _docIdFn = docIdSelector.Compile();
            _collectionFn = collectionSelector.Compile();
            _elemKeyFn = elemKeySelector.Compile();
            _eventKeyFn = eventKeySelector ?? throw new ArgumentNullException(nameof(eventKeySelector));

            if (collectionSelector.Body is MemberExpression cm) _collectionProperty = cm.Member.Name;
            else
            {
                throw new ArgumentException("Collection selector must be a simple member access", nameof(collectionSelector));
            }

            if (elemKeySelector.Body is MemberExpression em) _elemKeyProperty = em.Member.Name;
            else
            {
                throw new ArgumentException("Element key selector must be a simple member access", nameof(elemKeySelector));
            }
        }

        public async Task Group(IQuerySession session, IEnumerable<IEvent> events, IEventGrouping<TKey> grouping)
        {
            var typedEvents = events.OfType<IEvent<TEvent>>().ToList();
            if (typedEvents.Count == 0) return;

            var keys = typedEvents.Select(_eventKeyFn).Distinct().ToArray();

            var docId = Expression.Parameter(typeof(TDoc), "d");

            var docs = await session.Query<TDoc>()
                .Where(Contains(docId, keys))
                .ToListAsync();

            var pairs = docs.SelectMany(doc => _collectionFn(doc)
                .Where(elem => keys.Contains(_elemKeyFn(elem)))
                .Select(elem => (Key: _elemKeyFn(elem), DocId: _docIdFn(doc))));

            var lookup = pairs
                .GroupBy(x => x.Key, x => x.DocId)
                .ToDictionary(g => g.Key, g => g.ToList());

            grouping.AddEvents<IEvent<TEvent>>(
                evt =>
                {
                    var key = _eventKeyFn(evt);
                    return lookup.TryGetValue(key, out var list) ? list : Array.Empty<TKey>();
                },
                typedEvents
            );
        }

        private Expression<Func<TDoc, bool>> Contains(ParameterExpression docId, TKey[] keys)
        {
            var collExpr = Expression.Property(docId, _collectionProperty);

            var elemParam = Expression.Parameter(typeof(TElem), "e");
            var elemKeyExpr = Expression.Property(elemParam, _elemKeyProperty);

            var containsCall = Expression.Call(
                typeof(Enumerable), nameof(Enumerable.Contains), [typeof(TKey)],
                Expression.Constant(keys, typeof(TKey[])),
                elemKeyExpr
            );
            var containsLambda = Expression.Lambda<Func<TElem, bool>>(containsCall, elemParam);

            var anyCall = Expression.Call(
                typeof(Enumerable), nameof(Enumerable.Any), [typeof(TElem)],
                collExpr, containsLambda
            );
            return Expression.Lambda<Func<TDoc, bool>>(anyCall, docId);
        }
    }
}
