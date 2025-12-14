using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;

using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record Master(Guid Id) : Projection
{
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

public record MasterAvailabilitySlot(DateTime Start, DateTime End);

public class MasterProjection : SingleStreamProjection<Master, Guid>
{
    public static Master Create(IEvent<MasterCreated> @event)
    {
        return new Master(@event.StreamId)
        {
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
            Age = @event.Data.Age,
            Gender = @event.Data.Gender,
            Email = @event.Data.Contacts.Email,
            PhoneNumber = @event.Data.Contacts.PhoneNumber,
        };
    }

    public static Master Apply(MasterProfileUpdated @event, Master current)
    {
        return current with
        {
            FirstName = @event.FirstName,
            LastName = @event.LastName,
            Age = @event.Age,
            Gender = @event.Gender,
            Email = @event.Contacts.Email,
            PhoneNumber = @event.Contacts.PhoneNumber,
        };
    }

    public static Master Apply(MasterAvailabilityDefined @event, Master current)
    {
        var availability = @event.Slots.Select(s => new MasterAvailabilitySlot(s.Start, s.End)).ToArray();
        return current with { Availability = availability };
    }
}
