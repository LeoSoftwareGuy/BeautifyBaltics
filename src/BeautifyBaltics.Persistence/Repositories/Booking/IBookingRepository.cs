using BeautifyBaltics.Persistence.Repositories.SeedWork;

namespace BeautifyBaltics.Persistence.Repositories.Booking;

public interface IBookingRepository : IQueryRepository<Projections.Booking, BookingSearchDTO>;
