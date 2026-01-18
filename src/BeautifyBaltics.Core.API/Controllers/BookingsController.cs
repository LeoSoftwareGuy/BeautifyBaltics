using BeautifyBaltics.Core.API.Application.Booking.Commands.CancelBooking;
using BeautifyBaltics.Core.API.Application.Booking.Commands.ConfirmBooking;
using BeautifyBaltics.Core.API.Application.Booking.Commands.CreateBooking;
using BeautifyBaltics.Core.API.Application.Booking.Commands.RescheduleBooking;
using BeautifyBaltics.Core.API.Application.Booking.Queries.FindBookings;
using BeautifyBaltics.Core.API.Application.Booking.Queries.GetBookingId;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("bookings")]
public class BookingsController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Find bookings
    /// </summary>
    /// <param name="request">Find bookings request</param>
    /// <returns>Paged response of bookings</returns>
    [HttpGet(Name = "FindBookings")]
    [ProducesResponseType(typeof(PagedResponse<FindBookingsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<FindBookingsResponse>>> Find([FromQuery] FindBookingsRequest request)
    {
        var response = await bus.InvokeAsync<PagedResponse<FindBookingsResponse>>(request);
        return Ok(response);
    }

    /// <summary>
    /// Get booking by id
    /// </summary>
    /// <param name="id">Booking id</param>
    /// <param name="request">Request parameters</param>
    /// <returns>Booking or not found</returns>
    [HttpGet("{id:guid}", Name = "GetBookingById")]
    [ProducesResponseType(typeof(GetBookingByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetBookingByIdResponse>> Get([FromRoute] Guid id, [FromQuery] GetBookingByIdRequest request)
    {
        var response = await bus.InvokeAsync<GetBookingByIdResponse>(request with { Id = id });
        return Ok(response);
    }

    /// <summary>
    /// Create booking
    /// </summary>
    /// <param name="request">Create booking request</param>
    /// <returns>Created booking id</returns>
    [HttpPost(Name = "CreateBooking")]
    [ProducesResponseType(typeof(CreateBookingResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<CreatedAtActionResult> Create(CreateBookingRequest request)
    {
        var response = await bus.InvokeAsync<CreateBookingResponse>(request);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }

    /// <summary>
    /// Reschedule booking
    /// </summary>
    /// <param name="id">Booking id</param>
    /// <param name="request">Reschedule booking request</param>
    /// <returns>Rescheduled booking id</returns>
    [HttpPost("{id:guid}/reschedule")]
    [ProducesResponseType(typeof(RescheduleBookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> Reschedule(Guid id, [FromBody] RescheduleBookingRequest request)
    {
        var response = await bus.InvokeAsync<RescheduleBookingResponse>(request with { BookingId = id });
        return Ok(response);
    }

    /// <summary>
    /// Cancel booking
    /// </summary>
    /// <param name="id">Booking id</param>
    /// <param name="request">Cancel booking request</param>
    /// <returns>Cancelled booking id</returns>
    /// <remarks>
    /// Booking can be cancelled by either the master or the client.
    /// Booking cannot be cancelled if it's less than 24 hours before the scheduled time.
    /// </remarks>
    [HttpPost("{id:guid}/cancel", Name = "CancelBooking")]
    [ProducesResponseType(typeof(CancelBookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<CancelBookingResponse>> Cancel(Guid id, [FromBody] CancelBookingRequest request)
    {
        var response = await bus.InvokeAsync<CancelBookingResponse>(request with { BookingId = id });
        return Ok(response);
    }

    /// <summary>
    /// Confirm booking
    /// </summary>
    /// <param name="id">Booking id</param>
    /// <param name="request">Confirm booking request</param>
    /// <returns>Confirmed booking id</returns>
    /// <remarks>
    /// Only the master can confirm a booking.
    /// </remarks>
    [HttpPost("{id:guid}/confirm", Name = "ConfirmBooking")]
    [ProducesResponseType(typeof(ConfirmBookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<ConfirmBookingResponse>> Confirm(Guid id, [FromBody] ConfirmBookingRequest request)
    {
        var response = await bus.InvokeAsync<ConfirmBookingResponse>(request with { BookingId = id });
        return Ok(response);
    }
}
