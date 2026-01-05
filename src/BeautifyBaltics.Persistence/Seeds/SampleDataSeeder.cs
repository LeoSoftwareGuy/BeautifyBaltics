using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Documents;
using BeautifyBaltics.Domain.ValueObjects;
using BeautifyBaltics.Persistence.Projections;
using Marten;
using Marten.Schema;
using Microsoft.Extensions.Hosting;

namespace BeautifyBaltics.Persistence.Seeds;

public class SampleDataSeeder(IHostEnvironment environment) : IInitialData
{
    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        if (!environment.IsDevelopment()) return;

        await using var session = store.LightweightSession();

        if (await session.Query<Master>().AnyAsync(cancellation)) return;

        await SeedCategoriesAsync(session, cancellation);
        await SeedJobsAsync(session, cancellation);
        await SeedMastersAsync(session);
      //  await SeedClientAsync(session, cancellation);

        await session.SaveChangesAsync(cancellation);
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

    private Task SeedMastersAsync(IDocumentSession session)
    {
        var jobLookup = _jobs.ToDictionary(j => j.Id);

        foreach (var master in _masters)
        {
            var events = new List<object>
            {
                new MasterCreated(master.FirstName, master.LastName, new ContactInformation(master.Email, master.PhoneNumber), master.SupabaseUserId),
                new MasterProfileUpdated(master.Id, master.FirstName, master.LastName, master.Age, master.Gender, new ContactInformation(master.Email, master.PhoneNumber))
            };

            foreach (var offering in master.JobOfferings)
            {
                if (!jobLookup.TryGetValue(offering.JobId, out var jobDefinition)) continue;

                events.Add(new MasterJobCreated(
                    master.Id,
                    offering.JobId,
                    offering.Price ?? jobDefinition.DefaultPrice,
                    offering.Duration ?? jobDefinition.DefaultDuration,
                    offering.Title ?? jobDefinition.Name
                ));
            }

            session.Events.StartStream<MasterAggregate>(master.Id, events.ToArray());
        }

        return Task.CompletedTask;
    }

    private async Task SeedClientAsync(IDocumentSession session, CancellationToken cancellation)
    {
        if (await session.Query<Client>().AnyAsync(cancellation)) return;

        var contacts = new ContactInformation(_client.Email, _client.PhoneNumber);

        session.Events.StartStream<ClientAggregate>(_client.Id, new ClientCreated(
            _client.FirstName,
            _client.LastName,
            contacts,
            _client.SupabaseUserId
        ));
    }

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
        new(Guid.Parse("27c3c927-3b06-4d71-9d4c-1fb3f301c730"), "Signature Haircut", Guid.Parse("3f2d35b0-84dc-4e0c-85a1-31c60f7ce62e"), 45,
            "Tailored haircut with styling finish.", 55m),
        new(Guid.Parse("3c3e2f16-e154-432f-a4d4-c14b76e9e05f"), "Precision Beard Trim", Guid.Parse("512308de-bf64-44a4-ae69-08b4d782e0ae"), 30,
            "Beard shaping, conditioning, and styling.", 40m),
        new(Guid.Parse("1407ab0b-0cf4-4d68-8f78-8705498a1f4b"), "Creative Hair Color", Guid.Parse("8ecb25bf-6e2d-4cb3-b818-1c03f2b4b92e"), 120,
            "Custom color work including toning and finish.", 150m),
        new(Guid.Parse("502cb812-47f5-4c3b-b8c4-c38bea63b70a"), "Hand-painted Nail Art", Guid.Parse("efec4bf5-05af-4621-b8d7-08d132128187"), 75,
            "Detailed gel manicure with custom art.", 65m),
        new(Guid.Parse("45964e6e-8dc5-4fee-8c63-23982dffbca6"), "Brow Sculpt & Tint", Guid.Parse("0db7e1a1-92bf-4c13-9f33-862ea1b9ed07"), 40,
            "Brow mapping, waxing, and tinting for definition.", 45m),
        new(Guid.Parse("65f2a003-af60-468f-8750-db7c819744c2"), "Fine Line Tattoo", Guid.Parse("b59f3cb2-326c-42a7-9d5f-4c7344a5c5b8"), 180,
            "Custom fine line tattoo session with consultation.", 320m),
        new(Guid.Parse("b93cbbd8-1e8f-4da2-aee7-46fafa809e92"), "Professional Piercing", Guid.Parse("7e5f2b4f-97b9-4a55-8985-7f99dc8df908"), 35,
            "Sterile piercing service with jewelry.", 70m),
        new(Guid.Parse("f35a5782-0c7c-4fcd-9a6d-87c78f701911"), "Bridal Styling Session", Guid.Parse("3f2d35b0-84dc-4e0c-85a1-31c60f7ce62e"), 90,
            "Trial and final bridal styling with accessories.", 180m)
    };

    private readonly MasterSeed[] _masters =
    {
        MasterSeed.Create("Eliis", "Kuusk", "eliis.kuusk@beautifybaltics.com", "+372 5550 1001", "female", 30, new[]
        {
            new JobOffering(Guid.Parse("27c3c927-3b06-4d71-9d4c-1fb3f301c730")),
            new JobOffering(Guid.Parse("1407ab0b-0cf4-4d68-8f78-8705498a1f4b"), 165m, TimeSpan.FromMinutes(130), "Color Dimension")
        }),
        MasterSeed.Create("Markus", "Lepik", "markus.lepik@beautifybaltics.com", "+372 5550 1002", "male", 34, new[]
        {
            new JobOffering(Guid.Parse("27c3c927-3b06-4d71-9d4c-1fb3f301c730"), 58m, null, "Gentleman's Cut"),
            new JobOffering(Guid.Parse("3c3e2f16-e154-432f-a4d4-c14b76e9e05f"))
        }),
        MasterSeed.Create("Anette", "Laur", "anette.laur@beautifybaltics.com", "+372 5550 1003", "female", 29, new[]
        {
            new JobOffering(Guid.Parse("45964e6e-8dc5-4fee-8c63-23982dffbca6")),
            new JobOffering(Guid.Parse("502cb812-47f5-4c3b-b8c4-c38bea63b70a"))
        }),
        MasterSeed.Create("Rasmus", "Hallik", "rasmus.hallik@beautifybaltics.com", "+372 5550 1004", "male", 31, new[]
        {
            new JobOffering(Guid.Parse("65f2a003-af60-468f-8750-db7c819744c2")),
            new JobOffering(Guid.Parse("b93cbbd8-1e8f-4da2-aee7-46fafa809e92"))
        }),
        MasterSeed.Create("Greta", "Pärn", "greta.parn@beautifybaltics.com", "+372 5550 1005", "female", 35, new[]
        {
            new JobOffering(Guid.Parse("502cb812-47f5-4c3b-b8c4-c38bea63b70a"), 72m, TimeSpan.FromMinutes(80), "Editorial Nails"),
            new JobOffering(Guid.Parse("45964e6e-8dc5-4fee-8c63-23982dffbca6"), 48m)
        }),
        MasterSeed.Create("Karl", "Nurmsalu", "karl.nurmsalu@beautifybaltics.com", "+372 5550 1006", "male", 27, new[]
        {
            new JobOffering(Guid.Parse("27c3c927-3b06-4d71-9d4c-1fb3f301c730")),
            new JobOffering(Guid.Parse("3c3e2f16-e154-432f-a4d4-c14b76e9e05f"), 45m, null, "Hot Towel Beard Ritual")
        }),
        MasterSeed.Create("Merilin", "Jõe", "merilin.joe@beautifybaltics.com", "+372 5550 1007", "female", 33, new[]
        {
            new JobOffering(Guid.Parse("1407ab0b-0cf4-4d68-8f78-8705498a1f4b")),
            new JobOffering(Guid.Parse("f35a5782-0c7c-4fcd-9a6d-87c78f701911"))
        }),
        MasterSeed.Create("Sander", "Mets", "sander.mets@beautifybaltics.com", "+372 5550 1008", "male", 28, new[]
        {
            new JobOffering(Guid.Parse("65f2a003-af60-468f-8750-db7c819744c2"), 290m),
            new JobOffering(Guid.Parse("b93cbbd8-1e8f-4da2-aee7-46fafa809e92"))
        }),
        MasterSeed.Create("Johanna", "Sild", "johanna.sild@beautifybaltics.com", "+372 5550 1009", "female", 26, new[]
        {
            new JobOffering(Guid.Parse("45964e6e-8dc5-4fee-8c63-23982dffbca6"), 50m, null, "Precision Brow Lift"),
            new JobOffering(Guid.Parse("502cb812-47f5-4c3b-b8c4-c38bea63b70a"), 60m)
        }),
        MasterSeed.Create("Tanel", "Visnapuu", "tanel.visnapuu@beautifybaltics.com", "+372 5550 1010", "male", 32, new[]
        {
            new JobOffering(Guid.Parse("27c3c927-3b06-4d71-9d4c-1fb3f301c730")),
            new JobOffering(Guid.Parse("3c3e2f16-e154-432f-a4d4-c14b76e9e05f"))
        })
    };

    private readonly ClientSeed _client = new(
        Guid.Parse("5fda9cbe-3560-4a5e-b020-902a0e1d312c"),
        "Liisa",
        "Õun",
        "liisa.oun@beautifybaltics.com",
        "+372 5550 2000",
        Guid.NewGuid().ToString());

    #endregion

    private sealed record JobSeed(Guid Id, string Name, Guid CategoryId, int DurationMinutes, string Description, decimal DefaultPrice)
    {
        public TimeSpan DefaultDuration => TimeSpan.FromMinutes(DurationMinutes);

        public Job ToDocument(JobCategorySeed category) => new(Id, Name, category.Id, category.Name, TimeSpan.FromMinutes(DurationMinutes), Description);
    }

    private sealed record JobCategorySeed(Guid Id, string Name)
    {
        public JobCategory ToDocument() => new(Id, Name);
    }

    private sealed record MasterSeed(Guid Id, string FirstName, string LastName, string Email, string PhoneNumber, string SupabaseUserId, int Age, string Gender, IReadOnlyList<JobOffering> JobOfferings)
    {
        public static MasterSeed Create(string firstName, string lastName, string email, string phoneNumber, string gender, int age, IReadOnlyList<JobOffering> jobOfferings) =>
            new(Guid.NewGuid(), firstName, lastName, email, phoneNumber, Guid.NewGuid().ToString(), age, gender, jobOfferings);
    }

    private sealed record JobOffering(Guid JobId, decimal? Price = null, TimeSpan? Duration = null, string? Title = null);

    private sealed record ClientSeed(Guid Id, string FirstName, string LastName, string Email, string PhoneNumber, string SupabaseUserId);
}
