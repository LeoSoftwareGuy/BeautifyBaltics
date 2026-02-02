using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Booking.Queries.FindBookings;

public class FindBookingsHandler(IBookingRepository repository)
{
    public async Task<PagedResponse<FindBookingsResponse>> Handle(FindBookingsRequest request, CancellationToken cancellationToken)
    {
        var search = request.Adapt<BookingSearchDTO>();
        var result = await repository.GetPagedListAsync(search, cancellationToken);
        return result.ToPagedResponse<Persistence.Projections.Booking, FindBookingsResponse>();
    }
}