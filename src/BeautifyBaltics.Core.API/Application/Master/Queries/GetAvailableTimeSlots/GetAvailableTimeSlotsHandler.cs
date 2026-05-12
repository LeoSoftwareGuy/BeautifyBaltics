using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.Master;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetAvailableTimeSlots;

public class GetAvailableTimeSlotsHandler(
    IBookingRepository bookingRepository,
    IMasterRepository masterRepository
)
{
    public async Task<GetAvailableTimeSlotsResponse> Handle(GetAvailableTimeSlotsRequest request, CancellationToken cancellationToken)
    {
        var date = DateTime.SpecifyKind(request.Date.Date, DateTimeKind.Utc);
        var dayStart = date;
        var dayEnd = date.AddDays(1);

        var master = await masterRepository.GetByIdAsync(request.MasterId, cancellationToken);
        var bufferTime = TimeSpan.FromMinutes(master?.BufferMinutes ?? 0);

        var availabilityWindows = master?.Availabilities
            .Where(s => s.StartAt < dayEnd && s.EndAt > dayStart)
            .ToList() ?? [];

        var existingBookings = await bookingRepository.GetListAsync(
            new BookingSearchDTO
            {
                MasterId = request.MasterId,
                ScheduledDateRange = [DateOnly.FromDateTime(dayStart), DateOnly.FromDateTime(dayStart)]
            },
            cancellationToken
        );

        var activeBookings = existingBookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .ToList();

        // Filter out break slots — only use Available windows for generating candidate time slots
        var availableWindows = availabilityWindows
            .Where(w => w.SlotType == AvailabilitySlotType.Available)
            .ToList();

        // Break slots block time just like bookings
        var breakWindows = availabilityWindows
            .Where(w => w.SlotType == AvailabilitySlotType.Break)
            .ToList();

        // Calculate available slots
        var serviceDuration = TimeSpan.FromMinutes(request.ServiceDurationMinutes);
        var slotInterval = TimeSpan.FromMinutes(request.SlotIntervalMinutes);
        var availableSlots = new List<AvailableTimeSlotDTO>();

        foreach (var window in availableWindows)
        {
            var currentSlotStart = window.StartAt;

            while (currentSlotStart + serviceDuration <= window.EndAt)
            {
                var currentSlotEnd = currentSlotStart + serviceDuration;

                // Check if this slot conflicts with any existing booking (with buffer) or break
                var hasConflict = activeBookings.Any(b =>
                {
                    var bookingStart = b.ScheduledAt - bufferTime;
                    var bookingEnd = b.ScheduledAt + b.Duration + bufferTime;
                    return currentSlotStart < bookingEnd && currentSlotEnd > bookingStart;
                }) || breakWindows.Any(brk =>
                    currentSlotStart < brk.EndAt && currentSlotEnd > brk.StartAt
                );

                if (!hasConflict)
                {
                    availableSlots.Add(new AvailableTimeSlotDTO
                    {
                        StartAt = DateTime.SpecifyKind(currentSlotStart, DateTimeKind.Utc),
                        EndAt = DateTime.SpecifyKind(currentSlotEnd, DateTimeKind.Utc)
                    });
                }

                currentSlotStart = currentSlotStart.Add(slotInterval);
            }
        }

        return new GetAvailableTimeSlotsResponse
        {
            Slots = [.. availableSlots.OrderBy(s => s.StartAt)],
        };
    }
}
