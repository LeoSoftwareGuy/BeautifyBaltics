namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetPendingKycSubmissions;

public record GetPendingKycSubmissionsResponse(IReadOnlyList<PendingKycSubmissionDTO> Items);

public record PendingKycSubmissionDTO(
    Guid MasterId,
    string FirstName,
    string LastName,
    string Email,
    string? DocumentUrl,
    DateTimeOffset? SubmittedAt
);
