namespace BeautifyBaltics.Core.API.Application.Master.Commands.SetMasterJobFeaturedImage;

public record SetMasterJobFeaturedImageResponse(Guid MasterId, Guid MasterJobId, Guid? FeaturedImageId);
