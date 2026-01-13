namespace BeautifyBaltics.Core.API.Application.Master.Commands.DeleteMasterJobImage;

public record DeleteMasterJobImageResponse(Guid MasterId, Guid MasterJobId, Guid MasterJobImageId);
