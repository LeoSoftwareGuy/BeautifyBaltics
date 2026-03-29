using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Domain.SeedWork.Approvable;
using BeautifyBaltics.Domain.ValueObjects;

namespace BeautifyBaltics.Domain.Aggregates.Master;

public partial class MasterAggregate : ApprovableAggregate
{
    private readonly Dictionary<Guid, MasterAvailabilitySlot> _availabilities = new();
    private readonly Dictionary<Guid, MasterJob> _jobs = new();

    public bool IsVisible { get; private set; }
    public Guid UserId { get; private set; }

    public KycStatus KycStatus { get; private set; } = KycStatus.NotSubmitted;
    public string? KycDocumentBlobName { get; private set; }
    public string? KycDocumentFileName { get; private set; }
    public string? KycRejectionReason { get; private set; }
    public DateTimeOffset? KycSubmittedAt { get; private set; }
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public int? Age { get; private set; }
    public Gender? Gender { get; private set; }
    public string? Description { get; private set; }
    public ContactInformation Contacts { get; private set; } = new(string.Empty, string.Empty);
    public MasterProfileImage? ProfileImage { get; private set; }
    public double? Latitude { get; private set; }
    public double? Longitude { get; private set; }
    public string? City { get; private set; }
    public string? Country { get; private set; }
    public string? AddressLine1 { get; private set; }
    public string? AddressLine2 { get; private set; }
    public string? PostalCode { get; private set; }
    public int BufferMinutes { get; private set; }
    public IReadOnlyCollection<MasterJob> Jobs => _jobs.Values.ToList();
    public IReadOnlyCollection<MasterAvailabilitySlot> Availabilities => _availabilities.Values.ToList();

    public MasterAggregate() { }

    public MasterAggregate(MasterCreated @event) : this()
    {
        UserId = @event.UserId;
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Contacts = @event.Contacts;
    }

    internal void Apply(MasterChangeProposed @event) => ApplyChangeProposed(@event);

    internal void Apply(MasterChangesetApproved @event) => ApplyChangesetApproved(@event);

    internal void Apply(MasterChangesetRejected @event) => ApplyChangesetRejected(@event);

    internal void Apply(MasterActivated _) => IsVisible = true;

    internal void Apply(MasterProfileUpdated @event)
    {
        FirstName = @event.FirstName;
        LastName = @event.LastName;
        Age = @event.Age;
        Gender = @event.Gender;
        Description = @event.Description;
        Contacts = @event.Contacts;
        Latitude = @event.Latitude;
        Longitude = @event.Longitude;
        City = @event.City;
        Country = @event.Country;
        AddressLine1 = @event.AddressLine1;
        AddressLine2 = @event.AddressLine2;
        PostalCode = @event.PostalCode;
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

    internal void Apply(MasterJobDraftCreated @event)
    {
        _jobs.Add(@event.MasterJobId,
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

    internal void Apply(MasterJobSubmittedForReview @event)
    {
        if (_jobs.TryGetValue(@event.MasterJobId, out var job))
            job.SubmitForReview();
    }

    internal void Apply(MasterJobActivated @event)
    {
        if (_jobs.TryGetValue(@event.MasterJobId, out var job))
            job.Activate();
    }

    internal void Apply(MasterJobDeclined @event)
    {
        if (_jobs.TryGetValue(@event.MasterJobId, out var job))
            job.Decline();
    }

    // Backward compat: jobs approved via old changeset flow before draft model was introduced
    internal void Apply(MasterJobCreated @event)
    {
        if (!_jobs.ContainsKey(@event.MasterJobId))
        {
            _jobs.Add(@event.MasterJobId,
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
        _jobs[@event.MasterJobId].Activate();
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
                @event.EndAt,
                @event.SlotType
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

    internal void Apply(MasterJobImageDeleted @event)
    {
        if (!_jobs.TryGetValue(@event.MasterJobId, out var job)) return;

        job.RemoveImage(@event.MasterJobImageId);
    }

    internal void Apply(MasterJobFeaturedImageSet @event)
    {
        if (!_jobs.TryGetValue(@event.MasterJobId, out var job)) return;

        job.SetFeaturedImage(@event.FeaturedImageId);
    }

    internal void Apply(MasterJobFeaturedImageFramed @event)
    {
        if (!_jobs.TryGetValue(@event.MasterJobId, out var job)) return;

        job.UpdateFeaturedImageFraming(@event.FocusX, @event.FocusY, @event.Zoom);
    }

    internal void Apply(MasterBufferTimeUpdated @event)
    {
        BufferMinutes = @event.BufferMinutes;
    }

    internal void Apply(MasterKycSubmitted @event)
    {
        KycStatus = KycStatus.Pending;
        KycDocumentBlobName = @event.BlobName;
        KycDocumentFileName = @event.FileName;
        KycRejectionReason = null;
        KycSubmittedAt = @event.SubmittedAt;
    }

    internal void Apply(MasterKycApproved _)
    {
        KycStatus = KycStatus.Approved;
        KycRejectionReason = null;
    }

    internal void Apply(MasterKycRejected @event)
    {
        KycStatus = KycStatus.Rejected;
        KycRejectionReason = @event.Reason;
    }

    public bool IsAvailable(DateTime startAt, DateTime endAt)
    {
        return !_availabilities.Any(v => v.Value.StartAt < endAt && v.Value.EndAt > startAt);
    }

    public bool HasOverlappingAvailability(DateTime startAt, DateTime endAt)
    {
        return _availabilities.Values.Any(slot =>
            slot.StartAt < endAt && slot.EndAt > startAt);
    }

    public MasterJob GetJobOrThrow(Guid masterJobId)
    {
        if (_jobs.TryGetValue(masterJobId, out var job)) return job;
        throw NotFoundException.For<MasterJob>(masterJobId);
    }

    public void EnsureJobImageExists(MasterJob job, Guid imageId)
    {
        var exists = job.Images.Any(i => i.MasterJobImageId == imageId);
        if (!exists) throw NotFoundException.For<MasterJobImage>(imageId);
    }
}
