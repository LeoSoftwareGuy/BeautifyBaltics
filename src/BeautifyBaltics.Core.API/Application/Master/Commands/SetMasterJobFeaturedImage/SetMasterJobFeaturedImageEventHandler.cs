using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Exceptions;
using Wolverine;
using Wolverine.Marten;
using static BeautifyBaltics.Domain.Aggregates.Master.MasterAggregate;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public class SetMasterJobFeaturedImageEventHandler
{
    [AggregateHandler]
    public (Events, OutgoingMessages) Handle(SetMasterJobFeaturedImageRequest request, MasterAggregate master)
    {
        if (master == null) throw NotFoundException.For<MasterAggregate>(request.MasterId);
        if (request.MasterJobImageId is null) throw DomainException.WithMessage("Featured image id must be provided.");

        var job = master.GetJobOrThrow(request.MasterJobId);
        master.EnsureJobImageExists(job, request.MasterJobImageId.Value);

        var events = new Events();

        if (job.FeaturedImageId != request.MasterJobImageId)
        {
            events.Add(new MasterJobFeaturedImageSet(request.MasterId, request.MasterJobId, request.MasterJobImageId));
        }

        if (HasFramingChanges(request))
        {
            var (focusX, focusY, zoom) = NormalizeFraming(job, request);
            events.Add(new MasterJobFeaturedImageFramed(request.MasterId, request.MasterJobId, focusX, focusY, zoom));
        }

        var response = new SetMasterJobFeaturedImageResponse(request.MasterId, request.MasterJobId, request.MasterJobImageId);
        return (events, [response]);
    }

    private static bool HasFramingChanges(SetMasterJobFeaturedImageRequest request) =>
        request.FocusX.HasValue || request.FocusY.HasValue || request.Zoom.HasValue;

    private static (double FocusX, double FocusY, double Zoom) NormalizeFraming(MasterJob job, SetMasterJobFeaturedImageRequest request)
    {
        var focusX = Math.Clamp(request.FocusX ?? job.FeaturedImageFocusX, 0, 1);
        var focusY = Math.Clamp(request.FocusY ?? job.FeaturedImageFocusY, 0, 1); 
        var zoom = Math.Clamp(request.Zoom ?? job.FeaturedImageZoom, 0.4, 3);

        return (focusX, focusY, zoom);
    }
}
