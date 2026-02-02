using BeautifyBaltics.Core.API.Application.Rating.Commands.SubmitRating;
using BeautifyBaltics.Core.API.Application.Rating.Queries.FindMasterRatings;
using BeautifyBaltics.Core.API.Application.Rating.Queries.GetMasterRatings;
using BeautifyBaltics.Core.API.Application.SeedWork;
using BeautifyBaltics.Core.API.Controllers.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace BeautifyBaltics.Core.API.Controllers;

[Route("ratings")]
public class RatingsController(IMessageBus bus) : ApiController
{
    /// <summary>
    /// Create a rating for a completed booking
    /// </summary>
    /// <param name="request">Create rating request</param>
    /// <returns>Created rating id</returns>
    /// <remarks>
    /// Only clients can Create ratings for their completed bookings.
    /// Each booking can only be rated once.
    /// </remarks>
    [HttpPost(Name = "CreateRating")]
    [ProducesResponseType(typeof(CreateRatingResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<CreateRatingResponse>> Create([FromBody] CreateRatingRequest request)
    {
        var response = await bus.InvokeAsync<CreateRatingResponse>(request);
        return CreatedAtAction(nameof(GetMasterRatings), new { masterId = response.Id }, response);
    }

    /// <summary>
    /// Find ratings
    /// </summary>
    /// <param name="request">Find ratings request</param>
    /// <returns>Paged response of ratings</returns>
    [HttpGet(Name = "FindRatings")]
    [ProducesResponseType(typeof(PagedResponse<FindMasterRatingsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<FindMasterRatingsResponse>>> Find([FromQuery] FindMasterRatingsRequest request)
    {
        var response = await bus.InvokeAsync<PagedResponse<FindMasterRatingsResponse>>(request);
        return Ok(response);
    }

    /// <summary>
    /// Get ratings for a master
    /// </summary>
    /// <param name="masterId">Master ID</param>
    /// <param name="request">Request parameters</param>
    /// <returns>Paged response of ratings</returns>
    [HttpGet("master/{masterId:guid}", Name = "GetMasterRatings")]
    [ProducesResponseType(typeof(PagedResponse<GetMasterRatingsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<PagedResponse<GetMasterRatingsResponse>>> GetMasterRatings(
        [FromRoute] Guid masterId,
        [FromQuery] GetMasterRatingsRequest request
    )
    {
        var response = await bus.InvokeAsync<PagedResponse<GetMasterRatingsResponse>>(request with { MasterId = masterId });
        return Ok(response);
    }
}
