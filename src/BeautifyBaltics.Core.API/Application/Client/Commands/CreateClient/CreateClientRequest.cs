using System.Text.Json.Serialization;
using BeautifyBaltics.Core.API.Application.Client.Commands.Shared;

namespace BeautifyBaltics.Core.API.Application.Client.Commands.CreateClient
{
    public record CreateClientRequest : ClientCommandDTO
    {
        [JsonIgnore]
        public string SupabaseUserId { get; init; } = string.Empty;
    }
}
