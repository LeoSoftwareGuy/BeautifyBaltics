using System.Reflection;

namespace BeautifyBaltics.Persistence.Repositories
{
    public static class QueryExtensions
    {
        const string DefaultPropertyName = "CreatedAt";

        public static IQueryable<T> SortBy<T>(this IQueryable<T> query, string? sortBy, bool ascending) where T : notnull
        {
            if (string.IsNullOrWhiteSpace(sortBy))
            {
                var defaultProperty = ResolvePropertyName<T>(DefaultPropertyName);
                if (defaultProperty is null) return query;
                return ascending ? query.OrderBy(DefaultPropertyName) : query.OrderByDescending(DefaultPropertyName);
            }

            var propertyName = ResolvePropertyName<T>(sortBy);

            if (propertyName is null) return query;

            return query
                .OrderBy($"{propertyName} {(ascending ? "asc" : "desc")}")
                .AsQueryable();
        }

        private static string? ResolvePropertyName<T>(string propName) => typeof(T).GetProperty(
            propName,
            BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase
        )?.Name;
    }

}
