namespace BeautifyBaltics.Core.API.Application.Booking.Queries.GetBookingId;

public record GetBookingByIdRequest
{
    public Guid Id { get; init; }
}