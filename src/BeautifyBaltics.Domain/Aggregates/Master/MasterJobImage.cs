using BeautifyBaltics.Domain.Aggregates.SeedWork.Files;

namespace BeautifyBaltics.Domain.Aggregates.Master
{
    public class MasterJobImage(
        Guid masterJobImageId,
        string blobName,
        string fileName,
        string fileMimeType,
        long fileSize
    ) : FileEntity(blobName, fileName, fileMimeType, fileSize)
    {
        public Guid MasterJobImageId { get; } = masterJobImageId;
    }
}
