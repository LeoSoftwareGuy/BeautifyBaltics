using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Booking;
using Mapster;

namespace BeautifyBaltics.Core.API.Application.Booking.Queries.GetBookingId;

public class GetBookingByIdHandler(IBookingRepository bookingRepository)
{
    public async Task<GetBookingByIdResponse?> Handle(GetBookingByIdRequest request,
        CancellationToken cancellationToken)
    {
        var result = await bookingRepository.GetByIdAsync(request.Id, cancellationToken)
                     ?? throw NotFoundException.For<Persistence.Projections.Booking>(request.Id);

        return result.Adapt<GetBookingByIdResponse>();
    }
}