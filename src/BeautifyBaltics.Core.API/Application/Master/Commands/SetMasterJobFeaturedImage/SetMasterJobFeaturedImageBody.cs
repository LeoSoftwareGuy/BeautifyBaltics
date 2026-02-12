namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public record SetMasterJobFeaturedImageBody
{
    public Guid? ImageId { get; init; }
}
