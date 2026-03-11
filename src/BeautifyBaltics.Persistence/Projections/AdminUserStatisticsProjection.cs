using BeautifyBaltics.Domain.Aggregates.Booking.Events;
using BeautifyBaltics.Domain.Aggregates.Client.Events;
using BeautifyBaltics.Domain.Aggregates.Master.Events;
using BeautifyBaltics.Domain.Aggregates.User.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Projections.SeedWork;
using BeautifyBaltics.Persistence.Projections.SeedWork.CustomGrouping;
using JasperFx.Events;
using Marten.Events.Projections;

namespace BeautifyBaltics.Persistence.Projections;

public record AdminUserStatistics(Guid Id) : Projection
{
    public Guid? MasterId { get; init; }
    public Guid? ClientId { get; init; }
    public UserRole Role { get; init; }
    public required string Email { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public string FullName => $"{FirstName} {LastName}".Trim();
    public required string PhoneNumber { get; init; }
    public bool EmailVerified { get; init; }
    public DateTimeOffset JoinedAt { get; init; }
    public decimal Rating { get; init; }
    public int TotalBookings { get; init; }
    public decimal Earnings { get; init; }
}

public class AdminUserStatisticsProjection : MultiStreamProjection<AdminUserStatistics, Guid>
{
    public AdminUserStatisticsProjection()
    {
        Identity<UserRegistered>(e => e.UserId);
        Identity<UserRoleChanged>(e => e.UserId);
        Identity<UserEmailVerified>(e => e.UserId);
        Identity<UserDeleted>(e => e.UserId);

        Identity<MasterCreated>(e => e.UserId);
        Identity<ClientCreated>(e => e.UserId);

        CustomGrouping(new ForeignKeyEventGrouper<AdminUserStatistics, Guid, MasterProfileUpdated>(
            doc => doc.Id,
            doc => doc.MasterId,
            e => e.Data.MasterId
        ));

        CustomGrouping(new ForeignKeyEventGrouper<AdminUserStatistics, Guid, MasterRatingUpdated>(
            doc => doc.Id,
            doc => doc.MasterId,
            e => e.Data.MasterId
        ));

        CustomGrouping(new ForeignKeyEventGrouper<AdminUserStatistics, Guid, ClientProfileUpdated>(
            doc => doc.Id,
            doc => doc.ClientId,
            e => e.Data.ClientId
        ));

        CustomGrouping(new ForeignKeyEventGrouper<AdminUserStatistics, Guid, BookingCreated>(
            doc => doc.Id,
            doc => doc.MasterId,
            e => e.Data.MasterId
        ));

        CustomGrouping(new ForeignKeyEventGrouper<AdminUserStatistics, Guid, BookingCreated>(
            doc => doc.Id,
            doc => doc.ClientId,
            e => e.Data.ClientId
        ));

        CustomGrouping(new ForeignKeyEventGrouper<AdminUserStatistics, Guid, BookingCompleted>(
            doc => doc.Id,
            doc => doc.MasterId,
            e => e.Data.MasterId
        ));

        CustomGrouping(new ForeignKeyEventGrouper<AdminUserStatistics, Guid, BookingCompleted>(
            doc => doc.Id,
            doc => doc.ClientId,
            e => e.Data.ClientId
        ));

        DeleteEvent<UserDeleted>();
    }

    public static AdminUserStatistics Create(IEvent<UserRegistered> @event)
    {
        return new AdminUserStatistics(@event.Data.UserId)
        {
            Role = @event.Data.Role,
            Email = @event.Data.Email,
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
            PhoneNumber = @event.Data.PhoneNumber,
            EmailVerified = false,
            JoinedAt = @event.Data.JoinedAt,
            Rating = 0m,
            TotalBookings = 0,
            Earnings = 0m
        };
    }

    public static AdminUserStatistics Apply(IEvent<UserRoleChanged> @event, AdminUserStatistics current) =>
        current with { Role = @event.Data.Role };

    public static AdminUserStatistics Apply(IEvent<UserEmailVerified> @event, AdminUserStatistics current) =>
        current with { EmailVerified = true };

    public static AdminUserStatistics Apply(IEvent<MasterCreated> @event, AdminUserStatistics current) =>
        current with
        {
            MasterId = @event.StreamId,
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
            PhoneNumber = @event.Data.Contacts.PhoneNumber,
            Email = @event.Data.Contacts.Email
        };

    public static AdminUserStatistics Apply(IEvent<ClientCreated> @event, AdminUserStatistics current) =>
        current with
        {
            ClientId = @event.StreamId,
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
            PhoneNumber = @event.Data.Contacts.PhoneNumber,
            Email = @event.Data.Contacts.Email
        };

    public static AdminUserStatistics Apply(IEvent<MasterProfileUpdated> @event, AdminUserStatistics current) =>
        current with
        {
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
            PhoneNumber = @event.Data.Contacts.PhoneNumber,
            Email = @event.Data.Contacts.Email
        };

    public static AdminUserStatistics Apply(IEvent<ClientProfileUpdated> @event, AdminUserStatistics current) =>
        current with
        {
            FirstName = @event.Data.FirstName,
            LastName = @event.Data.LastName,
            PhoneNumber = @event.Data.Contacts.PhoneNumber,
            Email = @event.Data.Contacts.Email
        };

    public static AdminUserStatistics Apply(IEvent<MasterRatingUpdated> @event, AdminUserStatistics current) =>
        current with { Rating = @event.Data.AverageRating };

    public static AdminUserStatistics Apply(IEvent<BookingCreated> _, AdminUserStatistics current) =>
        current with { TotalBookings = current.TotalBookings + 1 };

    public static AdminUserStatistics Apply(IEvent<BookingCompleted> @event, AdminUserStatistics current) =>
        current with { Earnings = current.Earnings + @event.Data.Price };
}
