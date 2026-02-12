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
    private readonly string? _seedAssetsRoot;
    private readonly Dictionary<Guid, CategoryMediaAssets?> _categoryMediaCache = new();

    public SampleDataSeeder(
        IHostEnvironment environment,
        IServiceScopeFactory scopeFactory,
        ILogger<SampleDataSeeder> logger
    )
    {
        _environment = environment;
        _scopeFactory = scopeFactory;
        _logger = logger;
        _seedAssetsRoot = ResolveSeedAssetsRoot();
    }

    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        // Reference data: seed categories and jobs in ALL environments
        await using var refSession = store.LightweightSession();
        await SeedCategoriesAsync(refSession, cancellation);
        await SeedJobsAsync(refSession, cancellation);
        await refSession.SaveChangesAsync(cancellation);

        // Sample data: only seed masters and availability in development
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
        IBlobStorageService<MasterJobImage> masterJobImageBlobStorage
    )
    {
        var jobLookup = _jobs.ToDictionary(j => j.Id);
        var availabilityEvents = new Dictionary<Guid, List<MasterAvailabilitySlotCreated>>();

        foreach (var master in _masters)
        {
            var events = new List<object>
            {
                new MasterCreated(master.FirstName, master.LastName, new ContactInformation(master.Email, master.PhoneNumber), master.SupabaseUserId),
                new MasterProfileUpdated(
                    master.Id,
                    master.FirstName,
                    master.LastName,
                    master.Age,
                    master.Gender,
                    master.Description,
                    new ContactInformation(master.Email, master.PhoneNumber),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                )
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
        CancellationToken cancellation
    )
    {
        if (primaryJob is null || _seedAssetsRoot is null) return null;

        var assets = GetCategoryMediaAssets(primaryJob.CategoryId, primaryJob.CategoryName);
        if (assets?.MasterImagePath is null) return null;

        try
        {
            var blobFile = CreateBlobFileDto(assets.MasterImagePath, out var fileSize);
            var blobName = await masterProfileBlobStorage.UploadAsync(master.Id, blobFile, cancellation);

            return new MasterProfileImageUploaded(
                MasterId: master.Id,
                BlobName: blobName,
                FileName: Path.GetFileName(assets.MasterImagePath),
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
        CancellationToken cancellation
    )
    {
        if (_seedAssetsRoot is null) return Array.Empty<MasterJobImageUploaded>();

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
        if (_seedAssetsRoot is null) return null;

        if (_categoryMediaCache.TryGetValue(categoryId, out var cached)) return cached;

        if (!CategoryAssetDefinitions.TryGetValue(categoryId, out var definition))
        {
            _logger.LogDebug("No asset definition found for category {CategoryName}", categoryName);
            _categoryMediaCache[categoryId] = null;
            return null;
        }

        var masterImage = GetAssetPath(definition.MasterImageRelativePath);
        var jobImages = definition.JobImageRelativePaths
            .Select(GetAssetPath)
            .Where(path => path is not null)!
            .Cast<string>()
            .ToList();

        var assets = new CategoryMediaAssets(masterImage, jobImages);
        _categoryMediaCache[categoryId] = assets;
        return assets;
    }

    private string? GetAssetPath(string? relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath) || _seedAssetsRoot is null) return null;
        var combined = Path.GetFullPath(Path.Combine(_seedAssetsRoot, relativePath));
        if (!combined.StartsWith(_seedAssetsRoot, StringComparison.OrdinalIgnoreCase)) return null;
        return File.Exists(combined) ? combined : null;
    }

    private string? ResolveSeedAssetsRoot()
    {
        var assetsPath = Path.Combine(AppContext.BaseDirectory, "Seeds", "Assets");
        if (Directory.Exists(assetsPath)) return assetsPath;

        _logger.LogWarning("Seed assets directory not found at {AssetsPath}", assetsPath);
        return null;
    }

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
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
    }

    private sealed record CategoryMediaAssets(string? MasterImagePath, IReadOnlyList<string> JobImages);

    private sealed record CategoryAssetDefinition(string? MasterImageRelativePath, IReadOnlyList<string> JobImageRelativePaths);

    #region Seed data

    private static readonly Guid HairCategoryId = Guid.Parse("6a8d09ba-74f5-4216-8b63-bed3286851ba");
    private static readonly Guid BarberCategoryId = Guid.Parse("d8aa52f8-a92a-4df9-8de3-578e11165c46");
    private static readonly Guid NailsCategoryId = Guid.Parse("9cfab14c-e498-4d8f-b0a4-c94f2f5e9c0d");
    private static readonly Guid BrowsLashesCategoryId = Guid.Parse("4eef6073-c27d-4f6b-967d-debe5be9501d");
    private static readonly Guid TattooPiercingCategoryId = Guid.Parse("05ae4f80-0c2b-4833-8cd5-d9631506a30c");
    private static readonly Guid SkinAestheticsCategoryId = Guid.Parse("4240b253-b463-44ac-88fd-3c55c0ffce4a");
    private static readonly Guid HairRemovalCategoryId = Guid.Parse("d603b419-36b8-4164-9074-894549d80652");

    private static readonly Dictionary<Guid, CategoryAssetDefinition> CategoryAssetDefinitions = new()
    {
        [HairCategoryId] = new("JobCategories/Hair/masterImage.jpg", ["JobCategories/Hair/job-1.jpg", "JobCategories/Hair/job-2.jpg"]),
        [BarberCategoryId] = new("JobCategories/BarberBeards/masterImage.jpg", ["JobCategories/BarberBeards/job-1.jpg", "JobCategories/BarberBeards/job-2.jpeg"]),
        [NailsCategoryId] = new("JobCategories/Nails/masterImage.jpg", ["JobCategories/Nails/job-1.jpg", "JobCategories/Nails/job-2.jpg"]),
        [BrowsLashesCategoryId] = new("JobCategories/BrowsLashes/masterImage.jpg", ["JobCategories/BrowsLashes/job-1.jpg", "JobCategories/BrowsLashes/job-2.jpg"]),
        [TattooPiercingCategoryId] = new("JobCategories/TattooPiercing/masterImage.jpg", ["JobCategories/TattooPiercing/job-1.jpg", "JobCategories/TattooPiercing/job-2.jpg"]),
        [SkinAestheticsCategoryId] = new("JobCategories/SkinAesthetics/masterImage.jpg", ["JobCategories/SkinAesthetics/job-1.jpg", "JobCategories/SkinAesthetics/job-2.jpg"]),
        [HairRemovalCategoryId] = new("JobCategories/HairRemoval/masterImage.jpg", ["JobCategories/HairRemoval/job-1.jpg", "JobCategories/HairRemoval/job-2.jpg"]),
    };

    private readonly JobCategorySeed[] _categories =
    {
        new(HairCategoryId, "Hair"),
        new(BarberCategoryId, "Barber & Beards"),
        new(NailsCategoryId, "Nails"),
        new(BrowsLashesCategoryId, "Brows & Lashes"),
        new(TattooPiercingCategoryId, "Tattoo & Piercing"),
        new(SkinAestheticsCategoryId, "Skin & Aesthetics"),
        new(HairRemovalCategoryId, "Hair Removal")
    };

    private readonly JobSeed[] _jobs =
    {
        new(Guid.Parse("d8b7d62f-8030-46cd-b6f7-e1d5d0c8f5ff"), "Women's Cut", HairCategoryId, "Hair", 60,
            "Signature dry or wet cut tailored to hair texture and lifestyle.", 70m),
        new(Guid.Parse("4ca7a22c-4e3e-47dc-bc78-c37873887818"), "Men's Cut", HairCategoryId, "Hair", 45,
            "Clipper and scissor work finished with styling detail.", 50m),
        new(Guid.Parse("0aeb22fb-90e9-450c-b629-a22c2d4106c4"), "Balayage", HairCategoryId, "Hair", 150,
            "Hand-painted lightening for seamless, sun-kissed dimension.", 185m),
        new(Guid.Parse("13a8aaf5-deac-4c6c-883b-31379608784e"), "Highlights", HairCategoryId, "Hair", 120,
            "Foil work to brighten and add contrast through the mid-lengths.", 150m),
        new(Guid.Parse("436ea629-227b-4741-9ced-97e35547f016"), "Silk Press", HairCategoryId, "Hair", 90,
            "Press and finish service for sleek, glass-like shine on textured hair.", 110m),
        new(Guid.Parse("3694d18d-f488-459a-8ef2-822ee4463f8e"), "Keratin Treatment", HairCategoryId, "Hair", 120,
            "Smoothing service reducing frizz and improving manageability.", 220m),

        new(Guid.Parse("b70d4b7a-c215-43d0-8649-ddb5683766a2"), "Skin Fade", BarberCategoryId, "Barber & Beards", 45,
            "High-contrast fade with razor cleanup and detail work.", 45m),
        new(Guid.Parse("5973b24a-77a2-42d2-96c3-0511d81d41d4"), "Beard Trim", BarberCategoryId, "Barber & Beards", 30,
            "Clipper/ shear beard work with conditioning finish.", 30m),
        new(Guid.Parse("b0d07024-5b4d-4c2f-afb2-842995a5c7a3"), "Hot Towel Shave", BarberCategoryId, "Barber & Beards", 40,
            "Straight razor shave with hot towel ritual and skin treatment.", 45m),
        new(Guid.Parse("bb2e42ef-5628-4f13-a76b-e642b0c15a20"), "Line Up", BarberCategoryId, "Barber & Beards", 20,
            "Edge detailing for hairline, beard, and neckline.", 25m),

        new(Guid.Parse("1a6292b7-0cc0-4b2c-ad37-2276dfa4cfae"), "Gel Manicure", NailsCategoryId, "Nails", 60,
            "Structured gel manicure with cuticle care and polish.", 65m),
        new(Guid.Parse("fb142af6-5e83-4ea4-82c8-4f40aae70b4f"), "Acrylic Full Set", NailsCategoryId, "Nails", 90,
            "Customized acrylic extensions with shape refining.", 95m),
        new(Guid.Parse("7f9e8f66-de5a-41ff-8936-9884df371418"), "Pedicure", NailsCategoryId, "Nails", 75,
            "Spa pedicure with exfoliation, massage, and polish.", 80m),
        new(Guid.Parse("3abb66c1-cea4-4fd4-a37e-d4b0c31d110b"), "Nail Art (Complex)", NailsCategoryId, "Nails", 105,
            "Hand-painted premium designs with encapsulation or chrome.", 120m),
        new(Guid.Parse("bc5c5314-6333-488e-a568-1e8f4348555c"), "Shellac Removal", NailsCategoryId, "Nails", 30,
            "Gentle soak-off and nail conditioning treatment.", 25m),

        new(Guid.Parse("8a2abff0-a685-4bc4-b5be-ed989ef5f1d2"), "Brow Lamination", BrowsLashesCategoryId, "Brows & Lashes", 60,
            "Keratin brow sculpt for lifted, brushed-up symmetry.", 70m),
        new(Guid.Parse("02d717d3-a1b8-4c17-9c4b-36c3cc48899b"), "Brow Tint & Wax", BrowsLashesCategoryId, "Brows & Lashes", 45,
            "Mapping, waxing, and tint for crisp brow definition.", 55m),
        new(Guid.Parse("4588c693-ea49-4375-a47d-e2b31e0283bb"), "Classic Lash Extensions", BrowsLashesCategoryId, "Brows & Lashes", 120,
            "Single-lash extensions for natural fullness.", 130m),
        new(Guid.Parse("4ee28956-c376-4566-b9fa-76b7542d6292"), "Volume Lash Fill", BrowsLashesCategoryId, "Brows & Lashes", 90,
            "Fan extensions fill for density and drama.", 110m),
        new(Guid.Parse("0282c478-ad72-41dc-b6db-d48581efde2d"), "Lash Lift", BrowsLashesCategoryId, "Brows & Lashes", 50,
            "Keratin lash curling service for wide-eyed lift.", 65m),

        new(Guid.Parse("b3623438-df69-4aff-bdbb-aca2e38a04e8"), "Fine Line Tattoo (Small)", TattooPiercingCategoryId, "Tattoo & Piercing", 90,
            "Custom minimal tattoo including stencil and aftercare.", 180m),
        new(Guid.Parse("1216f27e-60b6-4ec4-a8f0-534ad3dfe239"), "Custom Tattoo Session (Hourly)", TattooPiercingCategoryId, "Tattoo & Piercing", 60,
            "Hourly booking for bespoke illustration work.", 150m),
        new(Guid.Parse("44b36869-25fc-4149-a5ad-4bbd2675c669"), "Ear Lobe Piercing", TattooPiercingCategoryId, "Tattoo & Piercing", 20,
            "Sterile dual lobe piercing with curated jewelry.", 60m),
        new(Guid.Parse("d93ad97e-c090-401c-a83f-ad6c5a2b4c94"), "Septum Piercing", TattooPiercingCategoryId, "Tattoo & Piercing", 30,
            "Needle piercing with anatomy consultation and styling.", 80m),

        new(Guid.Parse("cf22ea18-503a-48c8-92a0-b87f5ae9ca3d"), "Deep Cleansing Facial", SkinAestheticsCategoryId, "Skin & Aesthetics", 75,
            "Enzyme exfoliation, steam, and lymphatic sculpting massage.", 95m),
        new(Guid.Parse("56e4bd67-ca2a-400e-82d3-f00820a52f79"), "Microneedling", SkinAestheticsCategoryId, "Skin & Aesthetics", 90,
            "Collagen induction therapy with targeted serum infusion.", 180m),
        new(Guid.Parse("59565d42-e6d3-4fa7-ae19-5df18806d29e"), "Chemical Peel", SkinAestheticsCategoryId, "Skin & Aesthetics", 60,
            "Layered resurfacing peel tailored to skin goals.", 150m),
        new(Guid.Parse("27cc07d2-7771-4d2d-89bc-820e1e581a61"), "Lip Blush (Permanent Makeup)", SkinAestheticsCategoryId, "Skin & Aesthetics", 150,
            "Custom pigment implantation for soft, balanced lip tone.", 220m),

        new(Guid.Parse("dafe65dd-c1a7-48e4-945f-f8cf0b699458"), "Full Leg Wax", HairRemovalCategoryId, "Hair Removal", 70,
            "Warm wax removal for thighs through ankles.", 85m),
        new(Guid.Parse("b3c779fe-2915-4437-91c7-878bacb97423"), "Brazilian Wax", HairRemovalCategoryId, "Hair Removal", 60,
            "Sensitive-skin wax service with calming finish.", 90m),
        new(Guid.Parse("7c9ca09d-7f59-47b7-8117-f7d0afc24520"), "Laser Hair Removal (Underarms)", HairRemovalCategoryId, "Hair Removal", 45,
            "Diode laser session targeting underarm growth reduction.", 120m),
        new(Guid.Parse("237f190e-3786-4ff3-a580-1159e7bee46f"), "Threading (Face)", HairRemovalCategoryId, "Hair Removal", 30,
            "Precision threading for brows, lip, and cheeks.", 40m)
    };

    private readonly MasterSeed[] _masters =
    {
        MasterSeed.Create("Karl", "Nurmsalu", "karl.nurmsalu@beautifybaltics.com", "+372 5550 1001", Gender.Male, 28,
            "Contemporary hair artist focusing on precise shapes and luxe finishes.",
            new[]
            {
                new JobOffering(Guid.Parse("d8b7d62f-8030-46cd-b6f7-e1d5d0c8f5ff"), 78m, TimeSpan.FromMinutes(55), "Signature Women's Cut")
            }),
        MasterSeed.Create("Markus", "Lepik", "markus.lepik@beautifybaltics.com", "+372 5550 1002", Gender.Male, 34,
            "Classic barbering meets modern grooming with meticulous detail.",
            new[]
            {
                new JobOffering(Guid.Parse("b70d4b7a-c215-43d0-8649-ddb5683766a2"), 48m, TimeSpan.FromMinutes(45), "Skin Fade Ritual")
            }),
        MasterSeed.Create("Eliis", "Kuusk", "eliis.kuusk@beautifybaltics.com", "+372 5550 1003", Gender.Female, 30,
            "Award-winning colorist specializing in dimensional blonding and balayage.",
            new[]
            {
                new JobOffering(Guid.Parse("0aeb22fb-90e9-450c-b629-a22c2d4106c4"), 195m, TimeSpan.FromMinutes(150), "Couture Balayage Session")
            }),
        MasterSeed.Create("Greta", "Pärn", "greta.parn@beautifybaltics.com", "+372 5550 1004", Gender.Female, 35,
            "Editorial nail artist bringing runway-inspired designs to everyday wear.",
            new[]
            {
                new JobOffering(Guid.Parse("3abb66c1-cea4-4fd4-a37e-d4b0c31d110b"), 130m, TimeSpan.FromMinutes(105), "Studio Nail Art")
            }),
        MasterSeed.Create("Johanna", "Sild", "johanna.sild@beautifybaltics.com", "+372 5550 1005", Gender.Female, 26,
            "Brow designer focused on lamination, tint artistry, and symmetry.",
            new[]
            {
                new JobOffering(Guid.Parse("8a2abff0-a685-4bc4-b5be-ed989ef5f1d2"), 78m, TimeSpan.FromMinutes(60), "Brow Lamination Design")
            }),
        MasterSeed.Create("Maris", "Kask", "maris.kask@beautifybaltics.com", "+372 5550 1006", Gender.Female, 33,
            "Paramedical esthetician delivering corrective facials and microneedling.",
            new[]
            {
                new JobOffering(Guid.Parse("56e4bd67-ca2a-400e-82d3-f00820a52f79"), 195m, TimeSpan.FromMinutes(95), "Advanced Microneedling")
            }),
        MasterSeed.Create("Rasmus", "Hallik", "rasmus.hallik@beautifybaltics.com", "+372 5550 1007", Gender.Male, 31,
            "Fine-line tattoo specialist with minimalist precision.",
            new[]
            {
                new JobOffering(Guid.Parse("b3623438-df69-4aff-bdbb-aca2e38a04e8"), 320m, TimeSpan.FromMinutes(100), "Fine Line Narrative")
            }),
        MasterSeed.Create("Anette", "Laur", "anette.laur@beautifybaltics.com", "+372 5550 1008", Gender.Female, 29,
            "Body waxing and laser expert prioritizing comfort and hygiene.",
            new[]
            {
                new JobOffering(Guid.Parse("b3c779fe-2915-4437-91c7-878bacb97423"), 95m, TimeSpan.FromMinutes(60), "Luxury Brazilian Wax")
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
