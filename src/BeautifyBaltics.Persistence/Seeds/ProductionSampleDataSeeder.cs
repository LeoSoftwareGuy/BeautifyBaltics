using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.Aggregates.Master;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Aggregates.Rating;
using BeautifyBaltics.Domain.Aggregates.Rating.Events;
using BeautifyBaltics.Domain.Aggregates.User;
using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.ValueObjects;
using Marten;
using Marten.Schema;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BeautifyBaltics.Persistence.Seeds;

public class ProductionSampleDataSeeder(IHostEnvironment environment, ILogger<ProductionSampleDataSeeder> logger) : IInitialData
{
    private readonly IHostEnvironment _environment = environment;
    private readonly ILogger<ProductionSampleDataSeeder> _logger = logger;

    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        //if (_environment.IsDevelopment()) return;

        await using var checkSession = store.LightweightSession();
        var alreadySeeded = await checkSession.Events.QueryRawEventDataOnly<UserRegistered>()
            .AnyAsync(e => e.UserId == MasterUser1Id, cancellation);
        if (alreadySeeded) return;

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Test@12345!");
        var now = DateTimeOffset.UtcNow;
        var nowUtc = DateTime.UtcNow;

        // Session 1: users + masters + clients
        // BookingProjection.Create needs Master, Client, and MasterJob documents to already
        // exist in the DB, so these must be committed before booking events are written.
        await using var session1 = store.LightweightSession();
        SeedMasterUsers(session1, passwordHash, now);
        SeedClientUsers(session1, passwordHash, now);
        SeedMasterAggregates(session1, now);
        await session1.SaveChangesAsync(cancellation);

        // Session 2: bookings + ratings (Master/Client/MasterJob projections now committed)
        await using var session2 = store.LightweightSession();
        var completedBookings = SeedBookings(session2, nowUtc);
        SeedRatings(session2, completedBookings, nowUtc);
        await session2.SaveChangesAsync(cancellation);

        // Session 3: future availability slots
        await using var session3 = store.LightweightSession();
        SeedAvailabilitySlots(session3, nowUtc);
        await session3.SaveChangesAsync(cancellation);

        _logger.LogInformation("Production sample data seeded: 5 masters, 5 clients, 15 bookings, 10 ratings.");
    }

    private static void SeedMasterUsers(IDocumentSession session, string passwordHash, DateTimeOffset now)
    {
        foreach (var (userId, email, firstName, lastName, phone) in MasterUsers)
        {
            session.Events.StartStream<UserAggregate>(userId,
                new UserRegistered(userId, email, firstName, lastName, phone, UserRole.Master, now, passwordHash));
            session.Events.Append(userId, new UserEmailVerified(userId, now));
        }
    }

    private static void SeedClientUsers(IDocumentSession session, string passwordHash, DateTimeOffset now)
    {
        foreach (var (userId, clientId, email, firstName, lastName, phone) in Clients)
        {
            session.Events.StartStream<UserAggregate>(userId,
                new UserRegistered(userId, email, firstName, lastName, phone, UserRole.Client, now, passwordHash));
            session.Events.Append(userId, new UserEmailVerified(userId, now));
            session.Events.StartStream<ClientAggregate>(clientId,
                new ClientCreated(firstName, lastName, new ContactInformation(email, phone), userId));
        }
    }

    private static void SeedMasterAggregates(IDocumentSession session, DateTimeOffset now)
    {
        foreach (var master in Masters)
        {
            var events = new List<object>
            {
                new MasterCreated(master.FirstName, master.LastName,
                    new ContactInformation(master.Email, master.Phone), master.UserId),
                new MasterProfileUpdated(
                    master.Id, master.FirstName, master.LastName, master.Age, master.Gender,
                    master.Description, new ContactInformation(master.Email, master.Phone),
                    master.Latitude, master.Longitude, master.City, "Estonia",
                    master.AddressLine1, null, master.PostalCode),
                new MasterKycSubmitted(master.Id, "seed-doc", "kyc.jpg", "image/jpeg", 1024, now),
                new MasterKycApproved(master.Id, AdminId, now),
                new MasterActivated(master.Id),
            };

            foreach (var job in master.Jobs)
            {
                events.Add(new MasterJobCreated(
                    master.Id, job.JobDefinitionId, job.Price, job.Duration,
                    job.Title, job.CategoryId, job.CategoryName, job.JobName)
                    { MasterJobId = job.MasterJobId });
            }

            session.Events.StartStream<MasterAggregate>(master.Id, events.ToArray());
        }
    }

    private static List<(Guid BookingId, Guid MasterId, Guid ClientId)> SeedBookings(
        IDocumentSession session, DateTime nowUtc
    )
    {
        var completed = new List<(Guid, Guid, Guid)>();

        foreach (var b in Bookings)
        {
            var scheduledAt = DateTime.SpecifyKind(nowUtc.AddDays(-b.DaysAgo).Date.AddHours(10), DateTimeKind.Unspecified);
            var completedAt = scheduledAt + b.Duration + TimeSpan.FromMinutes(30);

            if (b.Cancelled)
            {
                session.Events.StartStream<BookingAggregate>(b.Id,
                    new BookingCreated(b.MasterId, b.ClientId, b.MasterJobId, scheduledAt, b.Duration, b.Price, null),
                    new BookingCancelled(b.Id, b.MasterId, CancelledByMasterId: b.MasterId));
            }
            else
            {
                session.Events.StartStream<BookingAggregate>(b.Id,
                    new BookingCreated(b.MasterId, b.ClientId, b.MasterJobId, scheduledAt, b.Duration, b.Price, b.Comment),
                    new BookingConfirmed(b.Id, b.MasterId),
                    new BookingCompleted(b.Id, completedAt, b.MasterId, b.ClientId, b.Price));
                completed.Add((b.Id, b.MasterId, b.ClientId));
            }
        }

        return completed;
    }

    private static void SeedRatings(IDocumentSession session,
        List<(Guid BookingId, Guid MasterId, Guid ClientId)> completedBookings, DateTime nowUtc)
    {
        var submittedAt = DateTime.SpecifyKind(nowUtc.AddDays(-3), DateTimeKind.Unspecified);
        var masterRatingValues = new Dictionary<Guid, List<int>>();

        for (var i = 0; i < completedBookings.Count; i++)
        {
            var (bookingId, masterId, clientId) = completedBookings[i];
            var (value, comment) = RatingData[i];
            var ratingId = RatingIds[i];

            session.Events.StartStream<RatingAggregate>(ratingId,
                new RatingSubmitted(bookingId, masterId, clientId, value, comment, submittedAt));

            masterRatingValues.TryAdd(masterId, []);
            masterRatingValues[masterId].Add(value);
        }

        foreach (var (masterId, values) in masterRatingValues)
        {
            var average = Math.Round((decimal)values.Average(), 2);
            session.Events.Append(masterId, new MasterRatingUpdated(masterId, average));
        }
    }

    private static void SeedAvailabilitySlots(IDocumentSession session, DateTime nowUtc)
    {
        var baseDate = DateTime.SpecifyKind(nowUtc.Date.AddDays(3), DateTimeKind.Unspecified);

        foreach (var master in Masters)
        {
            for (var day = 0; day < 14; day++)
            {
                var date = baseDate.AddDays(day);
                if (date.DayOfWeek is DayOfWeek.Sunday) continue;

                session.Events.Append(master.Id,
                    new MasterAvailabilitySlotCreated(master.Id, date.AddHours(9), date.AddHours(12)),
                    new MasterAvailabilitySlotCreated(master.Id, date.AddHours(13), date.AddHours(17)));
            }
        }
    }

    // ─── Fixed GUIDs ───────────────────────────────────────────────────────────

    private static readonly Guid AdminId       = Guid.Parse("00000000-0000-0000-0000-000000000001");

    private static readonly Guid MasterUser1Id = Guid.Parse("aa000001-0000-0000-0000-000000000001");
    private static readonly Guid MasterUser2Id = Guid.Parse("aa000001-0000-0000-0000-000000000002");
    private static readonly Guid MasterUser3Id = Guid.Parse("aa000001-0000-0000-0000-000000000003");
    private static readonly Guid MasterUser4Id = Guid.Parse("aa000001-0000-0000-0000-000000000004");
    private static readonly Guid MasterUser5Id = Guid.Parse("aa000001-0000-0000-0000-000000000005");

    private static readonly Guid Master1Id     = Guid.Parse("bb000001-0000-0000-0000-000000000001");
    private static readonly Guid Master2Id     = Guid.Parse("bb000001-0000-0000-0000-000000000002");
    private static readonly Guid Master3Id     = Guid.Parse("bb000001-0000-0000-0000-000000000003");
    private static readonly Guid Master4Id     = Guid.Parse("bb000001-0000-0000-0000-000000000004");
    private static readonly Guid Master5Id     = Guid.Parse("bb000001-0000-0000-0000-000000000005");

    private static readonly Guid ClientUser1Id = Guid.Parse("cc000001-0000-0000-0000-000000000001");
    private static readonly Guid ClientUser2Id = Guid.Parse("cc000001-0000-0000-0000-000000000002");
    private static readonly Guid ClientUser3Id = Guid.Parse("cc000001-0000-0000-0000-000000000003");
    private static readonly Guid ClientUser4Id = Guid.Parse("cc000001-0000-0000-0000-000000000004");
    private static readonly Guid ClientUser5Id = Guid.Parse("cc000001-0000-0000-0000-000000000005");

    private static readonly Guid Client1Id     = Guid.Parse("dd000001-0000-0000-0000-000000000001");
    private static readonly Guid Client2Id     = Guid.Parse("dd000001-0000-0000-0000-000000000002");
    private static readonly Guid Client3Id     = Guid.Parse("dd000001-0000-0000-0000-000000000003");
    private static readonly Guid Client4Id     = Guid.Parse("dd000001-0000-0000-0000-000000000004");
    private static readonly Guid Client5Id     = Guid.Parse("dd000001-0000-0000-0000-000000000005");

    // Master job IDs — fixed so booking events can reference them
    private static readonly Guid M1Job1Id      = Guid.Parse("ee000001-0000-0000-0000-000000000001");
    private static readonly Guid M1Job2Id      = Guid.Parse("ee000001-0000-0000-0000-000000000002");
    private static readonly Guid M2Job1Id      = Guid.Parse("ee000001-0000-0000-0000-000000000003");
    private static readonly Guid M2Job2Id      = Guid.Parse("ee000001-0000-0000-0000-000000000004");
    private static readonly Guid M3Job1Id      = Guid.Parse("ee000001-0000-0000-0000-000000000005");
    private static readonly Guid M3Job2Id      = Guid.Parse("ee000001-0000-0000-0000-000000000006");
    private static readonly Guid M4Job1Id      = Guid.Parse("ee000001-0000-0000-0000-000000000007");
    private static readonly Guid M4Job2Id      = Guid.Parse("ee000001-0000-0000-0000-000000000008");
    private static readonly Guid M5Job1Id      = Guid.Parse("ee000001-0000-0000-0000-000000000009");
    private static readonly Guid M5Job2Id      = Guid.Parse("ee000001-0000-0000-0000-00000000000a");

    // Booking IDs (15 total: 10 completed + 5 cancelled)
    private static readonly Guid[] BookingIds =
    [
        Guid.Parse("ff000001-0000-0000-0000-000000000001"), // M1 completed #1
        Guid.Parse("ff000001-0000-0000-0000-000000000002"), // M1 completed #2
        Guid.Parse("ff000001-0000-0000-0000-000000000003"), // M1 cancelled
        Guid.Parse("ff000001-0000-0000-0000-000000000004"), // M2 completed #1
        Guid.Parse("ff000001-0000-0000-0000-000000000005"), // M2 completed #2
        Guid.Parse("ff000001-0000-0000-0000-000000000006"), // M2 cancelled
        Guid.Parse("ff000001-0000-0000-0000-000000000007"), // M3 completed #1
        Guid.Parse("ff000001-0000-0000-0000-000000000008"), // M3 completed #2
        Guid.Parse("ff000001-0000-0000-0000-000000000009"), // M3 cancelled
        Guid.Parse("ff000001-0000-0000-0000-00000000000a"), // M4 completed #1
        Guid.Parse("ff000001-0000-0000-0000-00000000000b"), // M4 completed #2
        Guid.Parse("ff000001-0000-0000-0000-00000000000c"), // M4 cancelled
        Guid.Parse("ff000001-0000-0000-0000-00000000000d"), // M5 completed #1
        Guid.Parse("ff000001-0000-0000-0000-00000000000e"), // M5 completed #2
        Guid.Parse("ff000001-0000-0000-0000-00000000000f"), // M5 cancelled
    ];

    // Rating IDs (10 total, one per completed booking)
    private static readonly Guid[] RatingIds =
    [
        Guid.Parse("aa000002-0000-0000-0000-000000000001"),
        Guid.Parse("aa000002-0000-0000-0000-000000000002"),
        Guid.Parse("aa000002-0000-0000-0000-000000000003"),
        Guid.Parse("aa000002-0000-0000-0000-000000000004"),
        Guid.Parse("aa000002-0000-0000-0000-000000000005"),
        Guid.Parse("aa000002-0000-0000-0000-000000000006"),
        Guid.Parse("aa000002-0000-0000-0000-000000000007"),
        Guid.Parse("aa000002-0000-0000-0000-000000000008"),
        Guid.Parse("aa000002-0000-0000-0000-000000000009"),
        Guid.Parse("aa000002-0000-0000-0000-00000000000a"),
    ];

    // ─── Seed definitions ──────────────────────────────────────────────────────

    // Job category IDs (must match SampleDataSeeder)
    private static readonly Guid HairCategoryId           = Guid.Parse("6a8d09ba-74f5-4216-8b63-bed3286851ba");
    private static readonly Guid BarberCategoryId         = Guid.Parse("d8aa52f8-a92a-4df9-8de3-578e11165c46");
    private static readonly Guid NailsCategoryId          = Guid.Parse("9cfab14c-e498-4d8f-b0a4-c94f2f5e9c0d");
    private static readonly Guid BrowsLashesCategoryId    = Guid.Parse("4eef6073-c27d-4f6b-967d-debe5be9501d");
    private static readonly Guid SkinAestheticsCategoryId = Guid.Parse("4240b253-b463-44ac-88fd-3c55c0ffce4a");

    private static readonly (Guid UserId, string Email, string FirstName, string LastName, string Phone)[] MasterUsers =
    [
        (MasterUser1Id, "test.master1@beautifybaltics.com", "Karl",    "Nurmsalu", "+372 5551 0001"),
        (MasterUser2Id, "test.master2@beautifybaltics.com", "Greta",   "Pärn",     "+372 5551 0002"),
        (MasterUser3Id, "test.master3@beautifybaltics.com", "Johanna", "Sild",     "+372 5551 0003"),
        (MasterUser4Id, "test.master4@beautifybaltics.com", "Erik",    "Lepik",    "+372 5551 0004"),
        (MasterUser5Id, "test.master5@beautifybaltics.com", "Liis",    "Mägi",     "+372 5551 0005"),
    ];

    private static readonly (Guid UserId, Guid ClientId, string Email, string FirstName, string LastName, string Phone)[] Clients =
    [
        (ClientUser1Id, Client1Id, "test.client1@beautifybaltics.com", "Anna",   "Tamm", "+372 5551 0011"),
        (ClientUser2Id, Client2Id, "test.client2@beautifybaltics.com", "Mart",   "Kivi", "+372 5551 0012"),
        (ClientUser3Id, Client3Id, "test.client3@beautifybaltics.com", "Piret",  "Oja",  "+372 5551 0013"),
        (ClientUser4Id, Client4Id, "test.client4@beautifybaltics.com", "Jaan",   "Saar", "+372 5551 0014"),
        (ClientUser5Id, Client5Id, "test.client5@beautifybaltics.com", "Kristi", "Valk", "+372 5551 0015"),
    ];

    private sealed record JobSeedData(
        Guid MasterJobId, Guid JobDefinitionId, decimal Price, TimeSpan Duration,
        string Title, Guid CategoryId, string CategoryName, string JobName);

    private sealed record MasterSeedData(
        Guid Id, Guid UserId, string FirstName, string LastName, string Email, string Phone,
        int Age, Gender Gender, string Description,
        double Latitude, double Longitude, string City, string AddressLine1, string PostalCode,
        JobSeedData[] Jobs);

    private static readonly MasterSeedData[] Masters =
    [
        new(
            Master1Id, MasterUser1Id, "Karl", "Nurmsalu",
            "test.master1@beautifybaltics.com", "+372 5551 0001",
            28, Gender.Male,
            "Contemporary hair stylist specialising in precision cuts and luxe finishes for all hair types.",
            59.4370, 24.7536, "Tallinn", "Viru 12", "10140",
            [
                new(M1Job1Id, Guid.Parse("d8b7d62f-8030-46cd-b6f7-e1d5d0c8f5ff"),
                    70m,  TimeSpan.FromMinutes(55),  "Signature Women's Cut", HairCategoryId, "Hair", "Women's Cut"),
                new(M1Job2Id, Guid.Parse("0aeb22fb-90e9-450c-b629-a22c2d4106c4"),
                    185m, TimeSpan.FromMinutes(150), "Couture Balayage",      HairCategoryId, "Hair", "Balayage"),
            ]),
        new(
            Master2Id, MasterUser2Id, "Greta", "Pärn",
            "test.master2@beautifybaltics.com", "+372 5551 0002",
            35, Gender.Female,
            "Editorial nail artist bringing precision gel work and custom designs to everyday clients.",
            59.4350, 24.7480, "Tallinn", "Pärnu mnt 5", "10141",
            [
                new(M2Job1Id, Guid.Parse("1a6292b7-0cc0-4b2c-ad37-2276dfa4cfae"),
                    65m,  TimeSpan.FromMinutes(60),  "Gel Manicure",  NailsCategoryId, "Nails", "Gel Manicure"),
                new(M2Job2Id, Guid.Parse("3abb66c1-cea4-4fd4-a37e-d4b0c31d110b"),
                    120m, TimeSpan.FromMinutes(105), "Studio Nail Art", NailsCategoryId, "Nails", "Nail Art (Complex)"),
            ]),
        new(
            Master3Id, MasterUser3Id, "Johanna", "Sild",
            "test.master3@beautifybaltics.com", "+372 5551 0003",
            26, Gender.Female,
            "Certified brow and lash specialist focused on symmetry, lamination, and volume extensions.",
            59.4380, 24.7430, "Tallinn", "Narva mnt 3", "10117",
            [
                new(M3Job1Id, Guid.Parse("8a2abff0-a685-4bc4-b5be-ed989ef5f1d2"),
                    70m,  TimeSpan.FromMinutes(60),  "Brow Lamination Design",   BrowsLashesCategoryId, "Brows & Lashes", "Brow Lamination"),
                new(M3Job2Id, Guid.Parse("4588c693-ea49-4375-a47d-e2b31e0283bb"),
                    130m, TimeSpan.FromMinutes(120), "Classic Lash Extensions",  BrowsLashesCategoryId, "Brows & Lashes", "Classic Lash Extensions"),
            ]),
        new(
            Master4Id, MasterUser4Id, "Erik", "Lepik",
            "test.master4@beautifybaltics.com", "+372 5551 0004",
            34, Gender.Male,
            "Classic barbering meets modern technique — skin fades, beard trims, and hot towel shaves.",
            59.4390, 24.7500, "Tallinn", "Gonsiori 2", "10147",
            [
                new(M4Job1Id, Guid.Parse("b70d4b7a-c215-43d0-8649-ddb5683766a2"),
                    45m, TimeSpan.FromMinutes(45), "Skin Fade Ritual", BarberCategoryId, "Barber & Beards", "Skin Fade"),
                new(M4Job2Id, Guid.Parse("5973b24a-77a2-42d2-96c3-0511d81d41d4"),
                    30m, TimeSpan.FromMinutes(30), "Beard Trim",       BarberCategoryId, "Barber & Beards", "Beard Trim"),
            ]),
        new(
            Master5Id, MasterUser5Id, "Liis", "Mägi",
            "test.master5@beautifybaltics.com", "+372 5551 0005",
            33, Gender.Female,
            "Paramedical esthetician delivering corrective facials and advanced skin renewal treatments.",
            59.4360, 24.7520, "Tallinn", "Roosikrantsi 8", "10119",
            [
                new(M5Job1Id, Guid.Parse("cf22ea18-503a-48c8-92a0-b87f5ae9ca3d"),
                    95m,  TimeSpan.FromMinutes(75), "Deep Cleansing Facial", SkinAestheticsCategoryId, "Skin & Aesthetics", "Deep Cleansing Facial"),
                new(M5Job2Id, Guid.Parse("56e4bd67-ca2a-400e-82d3-f00820a52f79"),
                    180m, TimeSpan.FromMinutes(90), "Advanced Microneedling",SkinAestheticsCategoryId, "Skin & Aesthetics", "Microneedling"),
            ]),
    ];

    private sealed record BookingSeedData(
        Guid Id, Guid MasterId, Guid ClientId, Guid MasterJobId,
        int DaysAgo, TimeSpan Duration, decimal Price, bool Cancelled, string? Comment);

    private static readonly BookingSeedData[] Bookings =
    [
        // Master 1 — Hair
        new(BookingIds[0],  Master1Id, Client1Id, M1Job1Id, 90, TimeSpan.FromMinutes(55),  70m,  false, "Looking forward to a fresh cut!"),
        new(BookingIds[1],  Master1Id, Client2Id, M1Job2Id, 60, TimeSpan.FromMinutes(150), 185m, false, "Excited for the balayage session."),
        new(BookingIds[2],  Master1Id, Client3Id, M1Job1Id, 45, TimeSpan.FromMinutes(55),  70m,  true,  null),
        // Master 2 — Nails
        new(BookingIds[3],  Master2Id, Client2Id, M2Job1Id, 85, TimeSpan.FromMinutes(60),  65m,  false, "Gel manicure please!"),
        new(BookingIds[4],  Master2Id, Client3Id, M2Job2Id, 55, TimeSpan.FromMinutes(105), 120m, false, "Would love a floral design."),
        new(BookingIds[5],  Master2Id, Client4Id, M2Job1Id, 40, TimeSpan.FromMinutes(60),  65m,  true,  null),
        // Master 3 — Brows & Lashes
        new(BookingIds[6],  Master3Id, Client3Id, M3Job1Id, 80, TimeSpan.FromMinutes(60),  70m,  false, "First time brow lamination!"),
        new(BookingIds[7],  Master3Id, Client4Id, M3Job2Id, 50, TimeSpan.FromMinutes(120), 130m, false, "Classic extensions please."),
        new(BookingIds[8],  Master3Id, Client5Id, M3Job1Id, 35, TimeSpan.FromMinutes(60),  70m,  true,  null),
        // Master 4 — Barber
        new(BookingIds[9],  Master4Id, Client4Id, M4Job1Id, 75, TimeSpan.FromMinutes(45),  45m,  false, "High skin fade please."),
        new(BookingIds[10], Master4Id, Client5Id, M4Job2Id, 45, TimeSpan.FromMinutes(30),  30m,  false, "Beard shape-up."),
        new(BookingIds[11], Master4Id, Client1Id, M4Job1Id, 30, TimeSpan.FromMinutes(45),  45m,  true,  null),
        // Master 5 — Skin & Aesthetics
        new(BookingIds[12], Master5Id, Client5Id, M5Job1Id, 70, TimeSpan.FromMinutes(75),  95m,  false, "Looking forward to the facial!"),
        new(BookingIds[13], Master5Id, Client1Id, M5Job2Id, 40, TimeSpan.FromMinutes(90),  180m, false, "Microneedling session."),
        new(BookingIds[14], Master5Id, Client2Id, M5Job1Id, 25, TimeSpan.FromMinutes(75),  95m,  true,  null),
    ];

    // Rating value + comment for each completed booking (order matches completed bookings emitted by SeedBookings)
    private static readonly (int Value, string Comment)[] RatingData =
    [
        (5, "Fantastic result — exactly the cut I wanted. Will definitely be back!"),
        (4, "Beautiful balayage, very natural and sun-kissed. Highly recommend."),
        (5, "Gel manicure was perfect. Lasted over three weeks without chipping."),
        (5, "Stunning nail art — so creative and detailed. Absolutely love it."),
        (4, "Really happy with the brow lamination. Natural yet defined look."),
        (4, "Beautiful lash extensions. Very natural and comfortable to wear."),
        (5, "Best skin fade I've had. Razor-sharp lines and super clean finish."),
        (4, "Great beard trim, very professional and attentive. Will return."),
        (5, "My skin feels absolutely amazing after the facial. Pure bliss!"),
        (4, "Effective microneedling session. Already seeing improvements after one visit."),
    ];
}
