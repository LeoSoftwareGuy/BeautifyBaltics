using BeautifyBaltics.Domain.Enumerations;
using BeautifyBaltics.Persistence.Projections;
using BeautifyBaltics.Persistence.Repositories.Booking;
using BeautifyBaltics.Persistence.Repositories.Booking.DTOs;
using BeautifyBaltics.Persistence.Repositories.Master;
using BeautifyBaltics.Persistence.Repositories.Master.DTOs;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetAvailableTimeSlots;

public class GetAvailableTimeSlotsHandler(
    IMasterAvailabilitySlotRepository masterAvailabilitySlotRepository,
    IBookingRepository bookingRepository
)
{
    public async Task<GetAvailableTimeSlotsResponse> Handle(GetAvailableTimeSlotsRequest request, CancellationToken cancellationToken)
    {
        var date = DateTime.SpecifyKind(request.Date.Date, DateTimeKind.Utc);
        var dayStart = date;
        var dayEnd = date.AddDays(1);

        // Get availability windows for the master on the requested date
        var availabilityWindows = await masterAvailabilitySlotRepository.GetListAsync(
            new MasterAvailabilitySlotSearchDTO
            {
                MasterId = request.MasterId,
                StartAt = dayStart,
                EndAt = dayEnd
            },
            cancellationToken
        );

        // Get existing bookings for that day (exclude cancelled)
        var existingBookings = await bookingRepository.GetListAsync(
            new BookingSearchDTO
            {
                MasterId = request.MasterId,
                From = dayStart,
                To = dayEnd
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

                // Check if this slot conflicts with any existing booking or break
                var hasConflict = activeBookings.Any(b =>
                {
                    var existingEndAt = b.ScheduledAt + b.Duration;
                    return currentSlotStart < existingEndAt && currentSlotEnd > b.ScheduledAt;
                }) || breakWindows.Any(brk =>
                    currentSlotStart < brk.EndAt && currentSlotEnd > brk.StartAt
                );

                if (!hasConflict)
                {
                    availableSlots.Add(new AvailableTimeSlotDTO
                    {
                        StartAt = currentSlotStart,
                        EndAt = currentSlotEnd
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
