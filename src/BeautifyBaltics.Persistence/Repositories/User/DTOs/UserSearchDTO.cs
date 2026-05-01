using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.User.DTOs
{
    public record UserSearchDTO : BaseSearchDTO
    {
        public string? Search { get; init; }
        public UserRole? Role { get; init; }
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public string? Email { get; init; }
        public int? TotalBookings { get; init; }
        public decimal? Rating { get; init; }
        public decimal? Earnings { get; init; }
    }
}
