using BeautifyBaltics.Domain.Aggregates.SeedWork.Files;

namespace BeautifyBaltics.Domain.Aggregates.Master
{
    public partial class MasterAggregate
    {
        public class MasterKycDocument(
            string blobName,
            string fileName,
            string fileMimeType,
            long fileSize
        ) : FileEntity(blobName, fileName, fileMimeType, fileSize);
    }
}
