using BeautifyBaltics.Domain.Aggregates.SeedWork.Files;

namespace BeautifyBaltics.Domain.Aggregates.Master
{
    public partial class MasterAggregate
    {
        public class MasterProfileImage(
            Guid masterProfileImageId,
            string blobName,
            string fileName,
            string fileMimeType,
            long fileSize
        ) : FileEntity(blobName, fileName, fileMimeType, fileSize)
        {
            public Guid MasterProfileImageId { get; init; } = masterProfileImageId;
        }
    }
}
