using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Master.DTOs;

public record MasterSearchDTO : BaseSearchDTO
{
    public string? Text { get; init; }
    public string? City { get; init; }
    public Guid? JobId { get; init; }
    public Guid? JobCategoryId { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public string? ExcludeEmail { get; init; }
}
