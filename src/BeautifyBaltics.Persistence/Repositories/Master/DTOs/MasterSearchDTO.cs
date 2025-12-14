using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master.DTOs;

public record MasterSearchDTO : BaseSearchDTO
{
    public string? Text { get; set; }
    public string? City { get; set; }
}
