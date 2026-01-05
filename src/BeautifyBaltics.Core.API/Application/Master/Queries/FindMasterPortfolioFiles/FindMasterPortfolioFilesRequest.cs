using BeautifyBaltics.Core.API.Application.SeedWork;
using Swashbuckle.AspNetCore.Annotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.FindMasterPortfolioFiles
{
    public record FindMasterPortfolioFilesRequest : PagedRequest
    {
        /// <summary>
        /// Master id
        /// </summary>
        [SwaggerIgnore]
        public Guid MasterId { get; init; }

        /// <summary>
        /// Filter by file name
        /// </summary>
        public string? FileName { get; init; }
    }
}
