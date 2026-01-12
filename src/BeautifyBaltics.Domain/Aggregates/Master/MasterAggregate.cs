using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.SeedWork;
using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master;

public partial class MasterAggregate : Aggregate
{
    private readonly Dictionary<Guid, MasterAvailabilitySlot> _availabilities = new();
    private readonly Dictionary<Guid, MasterJob> _jobs = new();

    public string SupabaseUserId { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public int? Age { get; private set; }
    public Gender? Gender { get; private set; }
    public string? Description { get; private set; }
    public ContactInformation Contacts { get; private set; } = new(string.Empty, string.Empty);
    public MasterProfileImage? ProfileImage { get; private set; }
    public IReadOnlyCollection<MasterJob> Jobs => _jobs.Values.ToList();
    public IReadOnlyCollection<MasterAvailabilitySlot> Availability => _availabilities.Values.ToList();

    public MasterAggregate() { }

    public MasterAggregate(MasterCreated @event) : this()
    {
        SupabaseUserId = @event.SupabaseUserId;
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Contacts = @event.Contacts;
    }

    internal void Apply(MasterProfileUpdated @event)
    {
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Age = @event.Age;
        Gender = @event.Gender;
        Description = @event.Description;
        Contacts = @event.Contacts;
    }

    internal void Apply(MasterProfileImageUploaded @event)
    {
        ProfileImage = new MasterProfileImage(
            @event.MasterProfileImageId,
            @event.BlobName,
            @event.FileName,
            @event.FileMimeType,
            @event.FileSize
        );
    }

    internal void Apply(MasterJobCreated @event)
    {
        this._jobs.Add(@event.MasterJobId,
            new MasterJob(
                @event.MasterJobId,
                @event.JobId,
                @event.Price,
                @event.Duration,
                @event.Title,
                @event.JobCategoryId,
                @event.JobCategoryName,
                @event.JobName
            )
        );
    }

    internal void Apply(MasterJobUpdated @event)
    {
        this._jobs[@event.MasterJobId].Update(
            @event.JobId,
            @event.Price,
            @event.Duration,
            @event.Title,
            @event.JobCategoryId,
            @event.JobCategoryName,
            @event.JobName
        );
    }

    internal void Apply(MasterJobDeleted @event)
    {
        this._jobs.Remove(@event.MasterJobId);
    }

    internal void Apply(MasterAvailabilitySlotCreated @event)
    {
        this._availabilities.Add(@event.MasterAvailabilityId,
            new MasterAvailabilitySlot(
                @event.MasterAvailabilityId,
                @event.MasterId,
                @event.StartAt,
                @event.EndAt
            )
        );
    }

    internal void Apply(MasterAvailabilitySlotUpdated @event)
    {
        this._availabilities[@event.MasterAvailabilityId].Update(@event.MasterId, @event.StartAt, @event.EndAt);
    }

    internal void Apply(MasterAvailabilitySlotDeleted @event)
    {
        this._availabilities.Remove(@event.MasterAvailabilitySlotId);
    }

    internal void Apply(MasterJobImageUploaded @event)
    {
        if (!_jobs.TryGetValue(@event.MasterJobId, out var job)) return;

        var image = new MasterJobImage(
            @event.MasterJobImageId,
            @event.BlobName,
            @event.FileName,
            @event.FileMimeType,
            @event.FileSize
        );

        job.AddImage(image);
    }
}
