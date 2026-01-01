using System.Text.Json.Serialization;
using BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.CreateMaster;

public record CreateMasterRequest : MasterProfileCommandDTO
{
    [JsonIgnore]
    public string SupabaseUserId { get; init; } = string.Empty;
}
