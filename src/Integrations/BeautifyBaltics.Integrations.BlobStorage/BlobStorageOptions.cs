namespace BeautifyBaltics.Integrations.BlobStorage
{
    public class BlobStorageOptions<TFile> where TFile : notnull
    {
        /// <summary>
        /// Name of the blob storage container where files will be stored.
        /// </summary>
        public required string ContainerName { get; set; }
    }
}
