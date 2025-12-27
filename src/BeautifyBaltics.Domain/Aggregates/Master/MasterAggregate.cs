using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.SeedWork;
using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master;

public partial class MasterAggregate : Aggregate
{
    private readonly Dictionary<Guid, MasterAvailabilitySlot> _availabilities = [];
    private readonly Dictionary<Guid, MasterJob> _jobs = [];

    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public int? Age { get; private set; }
    public string? Gender { get; private set; }
    public ContactInformation Contacts { get; private set; } = new(string.Empty, string.Empty);
    public IReadOnlyCollection<MasterJob> Jobs => _jobs.Values.ToList();
    public IReadOnlyCollection<MasterAvailabilitySlot> Availability => _availabilities.Values.ToList();

    public MasterAggregate() { }

    public MasterAggregate(MasterCreated @event) : this()
    {
    }

    public void Apply(MasterProfileUpdated @event)
    {
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Age = @event.Age;
        Gender = @event.Gender;
        Contacts = @event.Contacts;
    }

    public void Apply(MasterJobCreated @event)
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

    public void Apply(MasterJobUpdated @event)
    {
        this._jobs[@event.MasterJobId].Update(@event.JobId, @event.Price, @event.Duration, @event.Title);
    }

    public void Apply(MasterJobDeleted @event)
    {
        this._jobs.Remove(@event.MasterJobId);
    }

    public void Apply(MasterAvailabilitySlotCreated @event)
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

    public void Apply(MasterAvailabilitySlotUpdated @event)
    {
        this._availabilities[@event.MasterAvailabilityId].Update(@event.MasterId, @event.StartAt, @event.EndAt);
    }

    public void Apply(MasterAvailabilitySlotDeleted @event)
    {
        this._availabilities.Remove(@event.MasterAvailabilitySlotId);
    }
}
