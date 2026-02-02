using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.SeedWork;
using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Client;

public partial class ClientAggregate : Aggregate
{
    public string SupabaseUserId { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public ContactInformation Contacts { get; private set; } = new(string.Empty, string.Empty);
    public ClientProfileImage? ProfileImage { get; private set; }

    public ClientAggregate() { }

    public ClientAggregate(ClientCreated @event) : this()
    {
        SupabaseUserId = @event.SupabaseUserId;
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Contacts = @event.Contacts;
    }

    internal void Apply(ClientProfileUpdated @event)
    {
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Contacts = @event.Contacts;
    }

    internal void Apply(ClientProfileImageUploaded @event)
    {
        ProfileImage = new ClientProfileImage(
            @event.ClientProfileImageId,
            @event.BlobName,
            @event.FileName,
            @event.FileMimeType,
            @event.FileSize
        );
    }
}
