using BeautifyBaltics.Core.API.Application.Master.Queries.Shared;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterById;

public record GetMasterByIdResponse : MasterDTO
{
    public IEnumerable<MasterJobDTO> Jobs { get; init; } = [];
    public IEnumerable<MasterAvailabilitySlotDTO> Availability { get; init; } = [];
}
