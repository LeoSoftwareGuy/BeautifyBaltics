using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using JasperFx.Events;

using Marten.Events.Aggregation;

namespace BeautifyBaltics.Persistence.Projections;

public record Master(Guid Id) : Projection
{
    public string SupabaseUserId { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public int? Age { get; init; }
    public Gender? Gender { get; init; }
    public string? Description { get; init; }
    public string Email { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
    public decimal Rating { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? City { get; init; }
    public string? Country { get; init; }
    public string? AddressLine1 { get; init; }
    public string? AddressLine2 { get; init; }
    public string? PostalCode { get; init; }
    public string? ProfileImageBlobName { get; init; }
    public string? ProfileImageFileName { get; init; }
    public string? ProfileImageMimeType { get; init; }
    public long? ProfileImageSize { get; init; }
    public int BufferMinutes { get; init; }

    public string? LocationName =>
        !string.IsNullOrWhiteSpace(City) ? City :
        !string.IsNullOrWhiteSpace(Country) ? Country : null;

    public string? LocationAddress
    {
        get
        {
            var segments = new[] { AddressLine1, AddressLine2, PostalCode, Country }
                .Where(s => !string.IsNullOrWhiteSpace(s));
            var address = string.Join(", ", segments);
            return string.IsNullOrWhiteSpace(address) ? null : address;
        }
    }
}

public class MasterProjection : SingleStreamProjection<Master, Guid>
{
    public static Master Create(IEvent<MasterCreated> @event)
    {
        return new Master(@event.StreamId)
        {
            SupabaseUserId = @event.Data.SupabaseUserId,
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
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
            Description = @event.Description,
            Email = @event.Contacts.Email,
            PhoneNumber = @event.Contacts.PhoneNumber,
            Latitude = @event.Latitude,
            Longitude = @event.Longitude,
            City = @event.City,
            Country = @event.Country,
            AddressLine1 = @event.AddressLine1,
            AddressLine2 = @event.AddressLine2,
            PostalCode = @event.PostalCode,
        };
    }

    public static Master Apply(MasterProfileImageUploaded @event, Master current)
    {
        return current with
        {
            ProfileImageBlobName = @event.BlobName,
            ProfileImageFileName = @event.FileName,
            ProfileImageMimeType = @event.FileMimeType,
            ProfileImageSize = @event.FileSize
        };
    }

    public static Master Apply(MasterBufferTimeUpdated @event, Master current) => current with { BufferMinutes = @event.BufferMinutes };
}
