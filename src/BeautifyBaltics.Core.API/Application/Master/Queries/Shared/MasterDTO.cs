namespace BeautifyBaltics.Core.API.Application.Master.Queries.Shared
{
    public record MasterDTO
    {
        public Guid Id { get; init; }
        public string FirstName { get; init; } = string.Empty;
        public string LastName { get; init; } = string.Empty;
        public int? Age { get; init; }
        public string? Gender { get; init; }
        public string Email { get; init; } = string.Empty;
        public string PhoneNumber { get; init; } = string.Empty;
        public decimal Rating { get; init; }
        public double? Latitude { get; init; }
        public double? Longitude { get; init; }
        public string? City { get; init; }
    }
}
