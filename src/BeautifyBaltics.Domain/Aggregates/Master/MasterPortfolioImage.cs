using BeautifyBaltics.Domain.Aggregates.SeedWork.Files;

namespace BeautifyBaltics.Domain.Aggregates.Master;

public partial class MasterAggregate
{
    public class MasterPortfolioImage(
        Guid masterPortfolioImageId,
        string blobName,
        string fileName,
        string fileMimeType,
        long fileSize
    ) : FileEntity(blobName, fileName, fileMimeType, fileSize)
    {
        public Guid MasterPortfolioImageId { get; } = masterPortfolioImageId;
    }
}
