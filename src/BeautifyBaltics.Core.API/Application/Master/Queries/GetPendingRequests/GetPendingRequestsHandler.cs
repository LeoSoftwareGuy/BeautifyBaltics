using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetPendingRequests;

public class GetPendingRequestsHandler(IBookingRepository bookingRepository)
{
    public async Task<GetPendingRequestsResponse> Handle(GetPendingRequestsRequest request, CancellationToken cancellationToken)
    {
        var search = new BookingSearchDTO
        {
            MasterId = request.MasterId,
            Status = BookingStatus.Requested
        };

        var pendingBookings = await bookingRepository.GetListAsync(search, cancellationToken);
        var requests = pendingBookings.Adapt<List<PendingRequestDTO>>();

        return new GetPendingRequestsResponse
        {
            Requests = requests,
            TotalCount = requests.Count
        };
    }
}
