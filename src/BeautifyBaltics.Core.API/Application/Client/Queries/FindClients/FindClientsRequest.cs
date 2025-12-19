using BeautifyBaltics.Core.API.Application.SeedWork;

namespace BeautifyBaltics.Core.API.Application.Client.Queries.FindClients
{
    public record FindClientsRequest : PagedRequest
    {
        /// <summary>
        /// Filter by first name
        /// </summary>
        public string? FirstName { get; init; }

        /// <summary>
        /// Filter by last name
        /// </summary>
        public string? LastName { get; init; }

        /// <summary>
        /// Filter by email address
        /// </summary>
        public string? Email { get; init; }
    }
}
