using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.SeedWork;
using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master;

public partial class MasterAggregate : Aggregate
{
    private readonly Dictionary<Guid, MasterAvailabilitySlot> _availabilities = [];
    private readonly Dictionary<Guid, MasterJob> _jobs = [];
    private readonly Dictionary<Guid, MasterPortfolioImage> _portfolioImages = [];

    public string SupabaseUserId { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public int? Age { get; private set; }
    public string? Gender { get; private set; }
    public ContactInformation Contacts { get; private set; } = new(string.Empty, string.Empty);
    public MasterProfileImage? ProfileImage { get; private set; }
    public IReadOnlyCollection<MasterJob> Jobs => _jobs.Values.ToList();
    public IReadOnlyCollection<MasterAvailabilitySlot> Availability => _availabilities.Values.ToList();
    public IReadOnlyCollection<MasterPortfolioImage> Portfolio => _portfolioImages.Values.ToList();

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
                @event.Title
            )
        );
    }

    internal void Apply(MasterJobUpdated @event)
    {
        this._jobs[@event.MasterJobId].Update(@event.JobId, @event.Price, @event.Duration, @event.Title);
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

    internal void Apply(MasterPortfolioImageUploaded @event)
    {
        var portfolioImage = new MasterPortfolioImage(
            @event.MasterPortfolioImageId,
            @event.BlobName,
            @event.FileName,
            @event.FileMimeType,
            @event.FileSize
        );

        this._portfolioImages[@event.MasterPortfolioImageId] = portfolioImage;
    }
}
