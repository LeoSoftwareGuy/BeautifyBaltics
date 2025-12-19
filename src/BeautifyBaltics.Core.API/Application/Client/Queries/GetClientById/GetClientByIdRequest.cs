namespace BeautifyBaltics.Core.API.Application.Client.Queries.GetClientById
{
    public record GetClientByIdRequest
    {
        public Guid Id { get; init; }
    }
}
