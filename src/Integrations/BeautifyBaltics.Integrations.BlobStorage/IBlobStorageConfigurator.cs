namespace BeautifyBaltics.Integrations.BlobStorage
{
    public interface IBlobStorageConfigurator
    {
        /// <summary>
        /// Configure blob storage options for a specific file type.
        /// </summary>
        void Configure<TFile>(Action<BlobStorageOptions<TFile>> configure) where TFile : notnull;
    }
}
