using JasperFx.Events;
using JasperFx.Events.Grouping;
using Marten;
using Marten.Events.Aggregation;
using System.Linq.Expressions;

namespace BeautifyBaltics.Persistence.Projections.SeedWork.CustomGrouping;

/// <summary>
/// Fans events of type TEvent whose key is extracted by eventKeySelector
/// out to every document of type TDoc whose foreignKeySelector matches.
/// </summary>
public class ForeignKeyEventGrouper<TDoc, TKey, TEvent>(
    Expression<Func<TDoc, TKey>> docIdSelector,
    Expression<Func<TDoc, TKey>> foreignKeySelector,
    Func<IEvent<TEvent>, TKey> eventKeySelector
) : IAggregateGrouper<TKey>
    where TDoc : notnull
    where TKey : notnull
    where TEvent : notnull
{
    public async Task Group(IQuerySession session, IEnumerable<IEvent> events, IEventGrouping<TKey> grouping)
    {
        var typedEvents = events.OfType<IEvent<TEvent>>().ToList();
        if (typedEvents.Count == 0) return;

        var keys = typedEvents.Select(eventKeySelector).Distinct().ToArray();

        var docId = Expression.Parameter(typeof(TDoc), "d");

        var docs = await session.Query<TDoc>()
            .Where(Contains(keys, docId))
            .Select(Pair(docId))
            .ToListAsync();

        var lookup = docs
            .GroupBy(x => x.Key, x => x.Value)
            .ToDictionary(g => g.Key, g => g.ToList());

        grouping.AddEvents<IEvent<TEvent>>(
            evt =>
            {
                var key = eventKeySelector(evt);
                return lookup.TryGetValue(key, out var list) ? list : Array.Empty<TKey>();
            },
            typedEvents
        );
    }

    private Expression<Func<TDoc, bool>> Contains(TKey[] keys, ParameterExpression docId)
    {
        var containsMethod = typeof(Enumerable)
            .GetMethods()
            .First(m => m.Name == nameof(Enumerable.Contains) && m.GetParameters().Length == 2)
            .MakeGenericMethod(typeof(TKey));
        var containsCall = Expression.Call(
            containsMethod,
            Expression.Constant(keys),
            Expression.Invoke(foreignKeySelector, docId)
        );
        return Expression.Lambda<Func<TDoc, bool>>(containsCall, docId);
    }

    private Expression<Func<TDoc, KeyValuePair<TKey, TKey>>> Pair(ParameterExpression docId)
    {
        var ctor = typeof(KeyValuePair<TKey, TKey>).GetConstructor([typeof(TKey), typeof(TKey)])!;
        var pair = Expression.New(
            ctor,
            Expression.Invoke(foreignKeySelector, docId),
            Expression.Invoke(docIdSelector, docId)
        );

        return Expression.Lambda<Func<TDoc, KeyValuePair<TKey, TKey>>>(pair, docId);
    }
}
