using System.ComponentModel.DataAnnotations;

namespace BeautifyBaltics.Core.API.Application.Rating.Queries.Shared
{
    public record RatingDTO
    {
        /// <summary>
        /// Rating ID
        /// </summary>
        [Required]
        public Guid Id { get; init; }

        /// <summary>
        /// Booking ID
        /// </summary>
        [Required]
        public Guid BookingId { get; init; }

        /// <summary>
        /// Client ID who submitted the rating
        /// </summary>
        [Required]
        public Guid ClientId { get; init; }

        /// <summary>
        /// Client name
        /// </summary>
        [Required]
        public required string ClientName { get; init; }

        /// <summary>
        /// Master name
        /// </summary>
        [Required]
        public required string MasterName { get; init; }

        /// <summary>
        /// Rating value (1-5)
        /// </summary>
        [Required]
        public int Value { get; init; }

        /// <summary>
        /// Optional comment
        /// </summary>
        public string? Comment { get; init; }

        /// <summary>
        /// When the rating was submitted
        /// </summary>
        [Required]
        public DateTime SubmittedAt { get; init; }
    }
}
