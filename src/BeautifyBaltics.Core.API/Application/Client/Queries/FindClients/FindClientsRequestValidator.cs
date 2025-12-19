using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Client.Queries.FindClients
{
    public class FindClientsRequestValidator : AbstractValidator<FindClientsRequest>
    {
        public FindClientsRequestValidator()
        {
            Include(new PagedRequestValidator());
        }
    }
}
