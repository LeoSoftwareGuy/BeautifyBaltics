using BeautifyBaltics.Domain.Exceptions;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Admin.Commands.RebuildProjection;

public class RebuildProjectionHandler(IDocumentStore store)
{
    public async Task<RebuildProjectionResponse> Handle(RebuildProjectionRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.ProjectionName)) throw new ArgumentException("Projection name is required.");

        using var daemon = await store.BuildProjectionDaemonAsync();

        await daemon.PrepareForRebuildsAsync();
        await daemon.RebuildProjectionAsync(request.ProjectionName, cancellationToken);

        return new RebuildProjectionResponse(request.ProjectionName);
    }
}
