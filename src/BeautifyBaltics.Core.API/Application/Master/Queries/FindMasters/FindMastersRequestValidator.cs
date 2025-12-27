using BeautifyBaltics.Core.API.Application.SeedWork;
using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasters;

public class FindMastersRequestValidator : AbstractValidator<FindMastersRequest>
{
    public FindMastersRequestValidator()
    {
        Include(new PagedRequestValidator());

        RuleFor(v => v.Text)
            .MaximumLength(128);

        RuleFor(v => v.City)
            .MaximumLength(128);
    }
}
