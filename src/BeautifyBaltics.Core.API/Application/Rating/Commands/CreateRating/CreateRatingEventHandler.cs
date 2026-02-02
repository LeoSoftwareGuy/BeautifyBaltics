using BeautifyBaltics.Domain.Aggregates.Booking;
using BeautifyBaltics.Domain.Aggregates.Rating;
using BeautifyBaltics.Domain.Aggregates.Rating.Events;
using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Domain.Exceptions;
using BeautifyBaltics.Persistence.Repositories.Rating;
using BeautifyBaltics.Persistence.Repositories.SeedWork;
using Marten;

namespace BeautifyBaltics.Core.API.Application.Rating.Commands.SubmitRating;

public class CreateRatingEventHandler(
    IDocumentSession documentSession,
    ICommandRepository commandRepository,
    IRatingRepository ratingRepository
)
{
    public async Task<CreateRatingResponse> Handle(CreateRatingRequest request, CancellationToken cancellationToken)
    {
        var booking = await documentSession.Events.AggregateStreamAsync<BookingAggregate>(request.BookingId, token: cancellationToken)
            ?? throw NotFoundException.For<BookingAggregate>(request.BookingId);

        if (booking.Status != BookingStatus.Completed) throw DomainException.WithMessage("Only completed bookings can be rated");

        var existingRating = await ratingRepository.GetByBookingIdAsync(request.BookingId, cancellationToken);

        if (existingRating != null) throw DomainException.WithMessage("A rating has already been submitted for this booking");

        var ratingSubmittedEvent = new RatingSubmitted(
            BookingId: request.BookingId,
            MasterId: booking.MasterId,
            ClientId: booking.ClientId,
            Value: request.Value,
            Comment: request.Comment,
            SubmittedAt: DateTime.UtcNow
        );

        var ratingId = commandRepository.StartStream<RatingAggregate>(ratingSubmittedEvent);

        return new CreateRatingResponse(ratingId);
    }
}
