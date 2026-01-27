using FluentValidation;

namespace BeautifyBaltics.Core.API.Application.Master.Commands.Shared;

public class MasterAvailabilitySlotValidator : AbstractValidator<MasterAvailabilitySlotCommandDTO>
{
    private static readonly TimeSpan MinimumLeadTime = TimeSpan.FromHours(3);

    public MasterAvailabilitySlotValidator()
    {
        RuleFor(v => v.Start)
            .NotEmpty()
            .Must(BeAtLeastThreeHoursInAdvance)
            .WithMessage($"Availability slots must start at least {MinimumLeadTime.TotalHours:F0} hours in advance.");

        RuleFor(v => v.End)
            .NotEmpty()
            .GreaterThan(v => v.Start);
    }

    private static bool BeAtLeastThreeHoursInAdvance(DateTime start)
    {
        var normalizedStart = DateTime.SpecifyKind(start, DateTimeKind.Utc);
        return normalizedStart >= DateTime.UtcNow.Add(MinimumLeadTime);
    }
}
