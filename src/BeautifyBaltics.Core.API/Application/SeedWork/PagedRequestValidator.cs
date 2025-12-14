using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.SeedWork;

public class PagedRequestValidator : AbstractValidator<PagedRequest>
{
    public PagedRequestValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page number must be greater than or equal to 1");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page size must be greater than or equal to 1");

        RuleFor(x => x.PageSize)
            .LessThanOrEqualTo(100)
            .WithMessage("Page size must be less than or equal to 100");
    }
}