using BeautifyBaltics.Core.API.Application.Booking.Commands.CreateBooking;
using BeautifyBaltics.Core.API.Application.Booking.Commands.RescheduleBooking;
using BeautifyBaltics.Core.API.Application.Booking.Commands.UpdateBooking;
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
        var response = await bus.InvokeForTenantAsync<PagedResponse<FindBookingsResponse>>(TenantId, request);
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
        var response = await bus.InvokeForTenantAsync<GetBookingByIdResponse>(TenantId, request with { Id = id });
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
        var response = await bus.InvokeForTenantAsync<CreateBookingResponse>(TenantId, request);
        return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
    }

    /// <summary>
    /// Update booking
    /// </summary>
    /// <param name="id">Booking id</param>
    /// <param name="request">Update booking request</param>
    /// <returns>Updated booking id</returns>
    [HttpPut("{id:guid}", Name = "UpdateBooking")]
    [ProducesResponseType(typeof(UpdateBookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> Update([FromRoute] Guid id, UpdateBookingRequest request)
    {
        var response = await bus.InvokeForTenantAsync<UpdateBookingResponse>(TenantId, request with { BookingId = id });
        return Ok(response);
    }

    /// <summary>
    /// Update status of booking
    /// </summary>
    /// <param name="id">Booking id</param>
    /// <param name="request">Update status booking request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated booking id</returns>
    [HttpPost("{id:guid}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateBookingRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeForTenantAsync<UpdateBookingResponse>(TenantId, request with { BookingId = id });
        return Ok(response);
    }

    /// <summary>
    /// Reschedule booking
    /// </summary>
    /// <param name="id">Booking id</param>
    /// <param name="request">Reschedule booking request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Rescheduled booking id</returns>
    [HttpPost("{id:guid}/reschedule")]
    [ProducesResponseType(typeof(RescheduleBookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult> Reschedule(Guid id, [FromBody] RescheduleBookingRequest request, CancellationToken cancellationToken)
    {
        var response = await bus.InvokeForTenantAsync<RescheduleBookingResponse>(TenantId, request with { BookingId = id }, cancellationToken);
        return Ok(response);
    }
}
