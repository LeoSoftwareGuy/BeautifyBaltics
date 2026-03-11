using JasperFx.Events;
using JasperFx.Events.Grouping;
using Marten;
using Marten.Events.Aggregation;
using System.Linq.Expressions;

namespace BeautifyBaltics.Persistence.Projections.SeedWork.CustomGrouping;

/// <summary>
/// Fans events of type TEvent whose key is extracted by eventKeySelector
/// out to every document of type TDoc whose nullable foreignKeySelector matches.
/// </summary>
public class ForeignKeyEventGrouper<TDoc, TKey, TEvent>(
    Expression<Func<TDoc, TKey>> docIdSelector,
    Expression<Func<TDoc, TKey?>> foreignKeySelector,
    Func<IEvent<TEvent>, TKey> eventKeySelector
) : IAggregateGrouper<TKey>
    where TDoc : notnull
    where TKey : struct
    where TEvent : notnull
{
    private readonly Func<TDoc, TKey?> _compiledForeignKey = foreignKeySelector.Compile();
    private readonly Func<TDoc, TKey> _compiledDocId = docIdSelector.Compile();

    public async Task Group(IQuerySession session, IEnumerable<IEvent> events, IEventGrouping<TKey> grouping)
    {
        var typedEvents = events.OfType<IEvent<TEvent>>().ToList();
        if (typedEvents.Count == 0) return;

        var keys = typedEvents.Select(eventKeySelector).Distinct().ToArray();
        var nullableKeys = keys.Select(k => (TKey?)k).ToArray();

        var docs = await session.Query<TDoc>()
            .Where(BuildContainsExpression(nullableKeys))
            .ToListAsync();

        var lookup = docs
            .Where(d => _compiledForeignKey(d).HasValue)
            .GroupBy(d => _compiledForeignKey(d)!.Value, d => _compiledDocId(d))
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

    private Expression<Func<TDoc, bool>> BuildContainsExpression(TKey?[] keys)
    {
        var containsMethod = typeof(Enumerable)
            .GetMethods()
            .First(m => m.Name == nameof(Enumerable.Contains) && m.GetParameters().Length == 2)
            .MakeGenericMethod(typeof(TKey?));
        var containsCall = Expression.Call(
            containsMethod,
            Expression.Constant(keys, typeof(TKey?[])),
            foreignKeySelector.Body
        );
        return Expression.Lambda<Func<TDoc, bool>>(containsCall, foreignKeySelector.Parameters[0]);
    }
}
