using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Master.Queries.GetMasterPortfolioFileById
{
    public record GetMasterPortfolioFileByIdRequest
    {
        /// <summary>
        /// Master id
        /// </summary>
        [Required]
        public Guid MasterId { get; init; }

        /// <summary>
        /// Master portfolio file id
        /// </summary>
        [Required]
        public Guid MasterPortfolioFileId { get; init; }
    }
}
