using BeautifyBaltics.Domain.Aggregates.SeedWork.Files;

namespace BeautifyBaltics.Domain.Aggregates.Client
{
    public partial class ClientAggregate
    {
        public class ClientProfileImage(
            Guid clientProfileImageId,
            string blobName,
            string fileName,
            string fileMimeType,
            long fileSize
        ) : FileEntity(blobName, fileName, fileMimeType, fileSize)
        {
            public Guid ClientProfileImageId { get; init; } = clientProfileImageId;
        }
    }
}
