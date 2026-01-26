using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Documents;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.ValueObjects;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Integrations.BlobStorage;
using Marten;
using Marten.Schema;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MasterJobImage = BeautifyBaltics.Domain.Aggregates.Master.MasterJobImage;

namespace BeautifyBaltics.Persistence.Seeds;

public class SampleDataSeeder : IInitialData
{
    private readonly IHostEnvironment _environment;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SampleDataSeeder> _logger;
    private readonly string? _mediaRoot;
    private readonly Dictionary<Guid, CategoryMediaAssets?> _categoryMediaCache = new();

    private static readonly Dictionary<string, string> CategoryFolderOverrides = new(StringComparer.OrdinalIgnoreCase)
    {
        { "Brows", "brows" },
        { "Tattoo", "tatoo" },
        { "Piercing", "piercing" },
        { "Hair", "hair" },
        { "Nails", "nails" },
        { "Grooming", "grooming"},
        { "Color", "color" }
    };

    public SampleDataSeeder(
        IHostEnvironment environment,
        IServiceScopeFactory scopeFactory,
        ILogger<SampleDataSeeder> logger)
    {
        _environment = environment;
        _scopeFactory = scopeFactory;
        _logger = logger;
        _mediaRoot = ResolveMediaRoot();
    }

    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        if (!_environment.IsDevelopment()) return;

        using var daemon = await store.BuildProjectionDaemonAsync();
        await daemon.StartAllAsync();

        try
        {
            await using var session = store.LightweightSession();

            if (await session.Query<Master>().AnyAsync(cancellation)) return;

            await using var scope = _scopeFactory.CreateAsyncScope();
            var masterProfileBlobStorage = scope.ServiceProvider.GetRequiredService<IBlobStorageService<MasterAggregate.MasterProfileImage>>();
            var masterJobImageBlobStorage = scope.ServiceProvider.GetRequiredService<IBlobStorageService<MasterJobImage>>();

            await SeedCategoriesAsync(session, cancellation);
            await SeedJobsAsync(session, cancellation);
            var availabilityByMaster = await SeedMastersAsync(session, cancellation, masterProfileBlobStorage, masterJobImageBlobStorage);

            await session.SaveChangesAsync(cancellation);

            if (availabilityByMaster.Count > 0)
            {
                await using var availabilitySession = store.LightweightSession();

                foreach (var (masterId, events) in availabilityByMaster)
                {
                    availabilitySession.Events.Append(masterId, events.ToArray());
                }

                await availabilitySession.SaveChangesAsync(cancellation);
            }

            await daemon.RebuildProjectionAsync<MasterAvailabilitySlotProjection>(cancellation);
        }
        finally
        {
            await daemon.StopAllAsync();
        }
    }

    private async Task SeedCategoriesAsync(IDocumentSession session, CancellationToken cancellation)
    {
        if (await session.Query<JobCategory>().AnyAsync(cancellation)) return;

        foreach (var category in _categories)
        {
            session.Store(category.ToDocument());
        }
    }

    private async Task SeedJobsAsync(IDocumentSession session, CancellationToken cancellation)
    {
        if (await session.Query<Job>().AnyAsync(cancellation)) return;

        var categoryLookup = _categories.ToDictionary(c => c.Id);

        foreach (var job in _jobs)
        {
            if (!categoryLookup.TryGetValue(job.CategoryId, out var category)) continue;
            session.Store(job.ToDocument(category));
        }
    }

    private async Task<IReadOnlyDictionary<Guid, List<MasterAvailabilitySlotCreated>>> SeedMastersAsync(
        IDocumentSession session,
        CancellationToken cancellation,
        IBlobStorageService<MasterAggregate.MasterProfileImage> masterProfileBlobStorage,
        IBlobStorageService<MasterJobImage> masterJobImageBlobStorage)
    {
        var jobLookup = _jobs.ToDictionary(j => j.Id);
        var availabilityEvents = new Dictionary<Guid, List<MasterAvailabilitySlotCreated>>();

        foreach (var master in _masters)
        {
            var events = new List<object>
            {
                new MasterCreated(master.FirstName, master.LastName, new ContactInformation(master.Email, master.PhoneNumber), master.SupabaseUserId),
                new MasterProfileUpdated(master.Id, master.FirstName, master.LastName, master.Age, master.Gender, master.Description, new ContactInformation(master.Email, master.PhoneNumber),null,null,null,null)
            };

            var primaryJob = master.JobOfferings
                .Select(offering => jobLookup.TryGetValue(offering.JobId, out var job) ? job : null)
                .FirstOrDefault(job => job is not null);

            var profileImageEvent = await TryCreateProfileImageEventAsync(master, primaryJob, masterProfileBlobStorage, cancellation);
            if (profileImageEvent is not null)
            {
                events.Add(profileImageEvent);
            }

            foreach (var offering in master.JobOfferings)
            {
                if (!jobLookup.TryGetValue(offering.JobId, out var jobDefinition)) continue;

                var masterJobCreated = new MasterJobCreated(
                    master.Id,
                    offering.JobId,
                    offering.Price ?? jobDefinition.DefaultPrice,
                    offering.Duration ?? jobDefinition.DefaultDuration,
                    offering.Title ?? jobDefinition.Name,
                    jobDefinition.CategoryId,
                    jobDefinition.CategoryName,
                    jobDefinition.Name
                );

                events.Add(masterJobCreated);

                var jobImageEvents = await CreateJobImageEventsAsync(master, masterJobCreated, jobDefinition, masterJobImageBlobStorage, cancellation);
                events.AddRange(jobImageEvents);
            }

            availabilityEvents[master.Id] = CreateAvailabilityEvents(master.Id).ToList();

            session.Events.StartStream<MasterAggregate>(master.Id, events.ToArray());
        }

        return availabilityEvents;
    }

    private async Task<MasterProfileImageUploaded?> TryCreateProfileImageEventAsync(
        MasterSeed master,
        JobSeed? primaryJob,
        IBlobStorageService<MasterAggregate.MasterProfileImage> masterProfileBlobStorage,
        CancellationToken cancellation)
    {
        if (primaryJob is null || _mediaRoot is null) return null;

        var assets = GetCategoryMediaAssets(primaryJob.CategoryId, primaryJob.CategoryName);
        if (assets?.ProfileImagePath is null) return null;

        try
        {
            var blobFile = CreateBlobFileDto(assets.ProfileImagePath, out var fileSize);
            var blobName = await masterProfileBlobStorage.UploadAsync(master.Id, blobFile, cancellation);

            return new MasterProfileImageUploaded(
                MasterId: master.Id,
                BlobName: blobName,
                FileName: Path.GetFileName(assets.ProfileImagePath),
                FileMimeType: blobFile.ContentType,
                FileSize: fileSize
            );
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Unable to seed profile image for master {MasterEmail}", master.Email);
            return null;
        }
    }

    private async Task<IReadOnlyCollection<MasterJobImageUploaded>> CreateJobImageEventsAsync(
        MasterSeed master,
        MasterJobCreated masterJobCreated,
        JobSeed jobDefinition,
        IBlobStorageService<MasterJobImage> masterJobImageBlobStorage,
        CancellationToken cancellation)
    {
        if (_mediaRoot is null) return Array.Empty<MasterJobImageUploaded>();

        var assets = GetCategoryMediaAssets(jobDefinition.CategoryId, jobDefinition.CategoryName);
        if (assets is null || assets.JobImages.Count == 0) return Array.Empty<MasterJobImageUploaded>();

        var events = new List<MasterJobImageUploaded>();

        foreach (var imagePath in assets.JobImages)
        {
            try
            {
                var blobFile = CreateBlobFileDto(imagePath, out var fileSize);
                var blobName = await masterJobImageBlobStorage.UploadAsync(master.Id, blobFile, cancellation);

                events.Add(new MasterJobImageUploaded(
                    MasterId: master.Id,
                    MasterJobId: masterJobCreated.MasterJobId,
                    BlobName: blobName,
                    FileName: Path.GetFileName(imagePath),
                    FileMimeType: blobFile.ContentType,
                    FileSize: fileSize
                ));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Unable to seed job image {ImagePath} for master {MasterEmail}", imagePath, master.Email);
            }
        }

        return events;
    }

    private IEnumerable<MasterAvailabilitySlotCreated> CreateAvailabilityEvents(Guid masterId)
    {
        var baseDate = DateTime.SpecifyKind(DateTime.UtcNow.Date, DateTimeKind.Utc).AddDays(1);
        var random = new Random(masterId.GetHashCode());

        for (var day = 0; day < 4; day++)
        {
            var dayStart = baseDate.AddDays(day).AddHours(9 + random.Next(0, 2));

            for (var slot = 0; slot < 3; slot++)
            {
                var slotStart = dayStart.AddHours(slot * 2).AddMinutes(random.Next(0, 20));
                var slotEnd = slotStart.AddMinutes(60 + random.Next(0, 31));

                yield return new MasterAvailabilitySlotCreated(masterId, slotStart, slotEnd);
            }
        }
    }

    private CategoryMediaAssets? GetCategoryMediaAssets(Guid categoryId, string categoryName)
    {
        if (_mediaRoot is null) return null;

        if (_categoryMediaCache.TryGetValue(categoryId, out var cached))
        {
            return cached;
        }

        var folderPath = ResolveCategoryFolder(categoryName);
        if (folderPath is null)
        {
            _categoryMediaCache[categoryId] = null;
            return null;
        }

        var files = Directory.EnumerateFiles(folderPath).ToList();
        var profile = files.FirstOrDefault(IsMasterImage);
        var jobImages = files.Where(f => !IsMasterImage(f)).ToList();

        var assets = new CategoryMediaAssets(profile, jobImages);
        _categoryMediaCache[categoryId] = assets;
        return assets;
    }

    private string? ResolveCategoryFolder(string categoryName)
    {
        if (_mediaRoot is null) return null;

        var candidates = new List<string>();

        if (CategoryFolderOverrides.TryGetValue(categoryName, out var overrideName))
        {
            candidates.Add(overrideName);
        }

        candidates.Add(categoryName);
        candidates.Add(categoryName.Replace(" ", string.Empty));
        candidates.Add(categoryName.ToLowerInvariant());
        candidates.Add(categoryName.ToUpperInvariant());

        foreach (var path in candidates
                     .Select(name => Path.Combine(_mediaRoot, name))
                     .Distinct(StringComparer.OrdinalIgnoreCase))
        {
            if (Directory.Exists(path))
            {
                return path;
            }
        }

        _logger.LogDebug("No media directory found for category {CategoryName}", categoryName);
        return null;
    }

    private string? ResolveMediaRoot()
    {
        var candidates = new[]
        {
            @"C:\Dev\Media",
            "/mnt/c/Dev/Media"
        };

        foreach (var candidate in candidates)
        {
            if (!string.IsNullOrWhiteSpace(candidate) && Directory.Exists(candidate))
            {
                return candidate;
            }
        }

        _logger.LogWarning("Media directory not found. Expected one of: {Candidates}", string.Join(", ", candidates));
        return null;
    }

    private static bool IsMasterImage(string filePath) =>
        string.Equals(Path.GetFileNameWithoutExtension(filePath), "Master", StringComparison.OrdinalIgnoreCase);

    private static BlobFileDTO CreateBlobFileDto(string filePath, out long fileSize)
    {
        var fileInfo = new FileInfo(filePath);
        fileSize = fileInfo.Length;

        using var stream = fileInfo.OpenRead();
        return new BlobFileDTO(fileInfo.Name, stream, GetContentType(fileInfo.Extension));
    }

    private static string GetContentType(string extension)
    {
        var normalized = extension.StartsWith('.') ? extension.ToLowerInvariant() : $".{extension.ToLowerInvariant()}";

        return normalized switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };
    }

    private sealed record CategoryMediaAssets(string? ProfileImagePath, IReadOnlyList<string> JobImages);

    #region Seed data

    private readonly JobCategorySeed[] _categories =
    {
        new(Guid.Parse("3f2d35b0-84dc-4e0c-85a1-31c60f7ce62e"), "Hair"),
        new(Guid.Parse("512308de-bf64-44a4-ae69-08b4d782e0ae"), "Grooming"),
        new(Guid.Parse("8ecb25bf-6e2d-4cb3-b818-1c03f2b4b92e"), "Color"),
        new(Guid.Parse("efec4bf5-05af-4621-b8d7-08d132128187"), "Nails"),
        new(Guid.Parse("0db7e1a1-92bf-4c13-9f33-862ea1b9ed07"), "Brows"),
        new(Guid.Parse("b59f3cb2-326c-42a7-9d5f-4c7344a5c5b8"), "Tattoo"),
        new(Guid.Parse("7e5f2b4f-97b9-4a55-8985-7f99dc8df908"), "Piercing")
    };

    private readonly JobSeed[] _jobs =
    {
        new(Guid.Parse("27c3c927-3b06-4d71-9d4c-1fb3f301c730"), "Signature Haircut", Guid.Parse("3f2d35b0-84dc-4e0c-85a1-31c60f7ce62e"),"Haircut", 45,
            "Tailored haircut with styling finish.", 55m),
        new(Guid.Parse("3c3e2f16-e154-432f-a4d4-c14b76e9e05f"), "Precision Beard Trim", Guid.Parse("512308de-bf64-44a4-ae69-08b4d782e0ae"),"Grooming", 30,
            "Beard shaping, conditioning, and styling.", 40m),
        new(Guid.Parse("1407ab0b-0cf4-4d68-8f78-8705498a1f4b"), "Creative Hair Color", Guid.Parse("8ecb25bf-6e2d-4cb3-b818-1c03f2b4b92e"),"Color", 120,
            "Custom color work including toning and finish.", 150m),
        new(Guid.Parse("502cb812-47f5-4c3b-b8c4-c38bea63b70a"), "Hand-painted Nail Art", Guid.Parse("efec4bf5-05af-4621-b8d7-08d132128187"),"Nails", 75,
            "Detailed gel manicure with custom art.", 65m),
        new(Guid.Parse("45964e6e-8dc5-4fee-8c63-23982dffbca6"), "Brow Sculpt & Tint", Guid.Parse("0db7e1a1-92bf-4c13-9f33-862ea1b9ed07"),"Brows", 40,
            "Brow mapping, waxing, and tinting for definition.", 45m),
        new(Guid.Parse("65f2a003-af60-468f-8750-db7c819744c2"), "Fine Line Tattoo", Guid.Parse("b59f3cb2-326c-42a7-9d5f-4c7344a5c5b8"),"Tattoo", 180,
            "Custom fine line tattoo session with consultation.", 320m),
        new(Guid.Parse("b93cbbd8-1e8f-4da2-aee7-46fafa809e92"), "Professional Piercing", Guid.Parse("7e5f2b4f-97b9-4a55-8985-7f99dc8df908"),"Piercing", 35,
            "Sterile piercing service with jewelry.", 70m)
    };

    private readonly MasterSeed[] _masters =
    {
        MasterSeed.Create("Karl", "Nurmsalu", "karl.nurmsalu@beautifybaltics.com", "+372 5550 1001", Gender.Male, 28,
            "Contemporary hair artist focusing on precision fades and textured cuts for all hair types.",
            new[]
            {
                new JobOffering(Guid.Parse("27c3c927-3b06-4d71-9d4c-1fb3f301c730"), 60m, TimeSpan.FromMinutes(50), "Tailored Signature Cut")
            }),
        MasterSeed.Create("Markus", "Lepik", "markus.lepik@beautifybaltics.com", "+372 5550 1002", Gender.Male, 34,
            "Classic barbering meets modern grooming. Known for meticulous beard sculpting and hot towel rituals.",
            new[]
            {
                new JobOffering(Guid.Parse("3c3e2f16-e154-432f-a4d4-c14b76e9e05f"), 42m, TimeSpan.FromMinutes(35), "Precision Beard Ritual")
            }),
        MasterSeed.Create("Eliis", "Kuusk", "eliis.kuusk@beautifybaltics.com", "+372 5550 1003", Gender.Female, 30,
            "Award-winning colorist specializing in dimensional blonding and vivid transformations.",
            new[]
            {
                new JobOffering(Guid.Parse("1407ab0b-0cf4-4d68-8f78-8705498a1f4b"), 168m, TimeSpan.FromMinutes(135), "Couture Color Session")
            }),
        MasterSeed.Create("Greta", "Pärn", "greta.parn@beautifybaltics.com", "+372 5550 1004", Gender.Female, 35,
            "Editorial nail artist bringing runway-inspired designs to everyday wear.",
            new[]
            {
                new JobOffering(Guid.Parse("502cb812-47f5-4c3b-b8c4-c38bea63b70a"), 74m, TimeSpan.FromMinutes(85), "Art Studio Manicure")
            }),
        MasterSeed.Create("Johanna", "Sild", "johanna.sild@beautifybaltics.com", "+372 5550 1005", Gender.Female, 26,
            "Brow designer focusing on natural symmetry, lamination, and tint artistry.",
            new[]
            {
                new JobOffering(Guid.Parse("45964e6e-8dc5-4fee-8c63-23982dffbca6"), 48m, TimeSpan.FromMinutes(45), "Brow Architecture")
            }),
        MasterSeed.Create("Rasmus", "Hallik", "rasmus.hallik@beautifybaltics.com", "+372 5550 1006", Gender.Male, 31,
            "Fine-line tattoo specialist with a minimalist aesthetic and surgical precision.",
            new[]
            {
                new JobOffering(Guid.Parse("65f2a003-af60-468f-8750-db7c819744c2"), 310m, TimeSpan.FromMinutes(195), "Fine Line Narrative")
            }),
        MasterSeed.Create("Anette", "Laur", "anette.laur@beautifybaltics.com", "+372 5550 1007", Gender.Female, 29,
            "Professional piercer prioritizing comfort, curated jewelry, and impeccable hygiene.",
            new[]
            {
                new JobOffering(Guid.Parse("b93cbbd8-1e8f-4da2-aee7-46fafa809e92"), 75m, TimeSpan.FromMinutes(45), "Curated Piercing Experience")
            }),
    };

    #endregion

    private sealed record JobSeed(Guid Id, string Name, Guid CategoryId, string CategoryName, int DurationMinutes, string Description, decimal DefaultPrice)
    {
        public TimeSpan DefaultDuration => TimeSpan.FromMinutes(DurationMinutes);

        public Job ToDocument(JobCategorySeed category) => new(Id, Name, category.Id, category.Name, TimeSpan.FromMinutes(DurationMinutes), Description);
    }

    private sealed record JobCategorySeed(Guid Id, string Name)
    {
        public JobCategory ToDocument() => new(Id, Name);
    }

    private sealed record MasterSeed(Guid Id, string FirstName, string LastName, string Email, string PhoneNumber, string SupabaseUserId, int Age, Domain.Enumerations.Gender Gender, string? Description, IReadOnlyList<JobOffering> JobOfferings)
    {
        public static MasterSeed Create(string firstName, string lastName, string email, string phoneNumber, Domain.Enumerations.Gender gender, int age, string? description, IReadOnlyList<JobOffering> jobOfferings) =>
            new(Guid.NewGuid(), firstName, lastName, email, phoneNumber, Guid.NewGuid().ToString(), age, gender, description, jobOfferings);
    }

    private sealed record JobOffering(Guid JobId, decimal? Price = null, TimeSpan? Duration = null, string? Title = null);

    private sealed record ClientSeed(Guid Id, string FirstName, string LastName, string Email, string PhoneNumber, string SupabaseUserId);
}
