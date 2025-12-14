using BeautifyBaltics.Domain.SeedWork;
using Marten;
using BeautifyBaltics.Persistence.Projections.SeedWork;

namespace BeautifyBaltics.Persistence.Configurations.Extensions;
public static class DocumentMappingExpressionExtensions
{
    public static MartenRegistry.DocumentMappingExpression<T> MapDocumentMetadata<T>(
        this MartenRegistry.DocumentMappingExpression<T> expression) where T : IDocument
    {
        return expression
            .Metadata(m =>
            {
                m.CreatedAt.MapTo(x => x.CreatedAt);
                m.LastModified.MapTo(x => x.ModifiedAt);
                m.SoftDeletedAt.MapTo(x => x.DeletedAt);
                m.IsSoftDeleted.MapTo(x => x.Deleted);
            });
    }

    public static MartenRegistry.DocumentMappingExpression<T> MapProjectionMetadata<T>(
        this MartenRegistry.DocumentMappingExpression<T> expression) where T : IProjection
    {
        return expression
            .Metadata(m =>
            {
                m.CreatedAt.MapTo(x => x.CreatedAt);
                m.LastModified.MapTo(x => x.ModifiedAt);
            });
    }
}
