namespace BeautifyBaltics.Integrations.BlobStorage
{
    public interface IBlobStorageService<TFile> where TFile : notnull
    {
        /// <summary>
        /// Uploads a file to the specified blob storage container.
        /// </summary>
        /// <param name="containerId">Container ID where the file will be uploaded.</param>
        /// <param name="file">File to be uploaded.</param>
        /// <param name="tenantId">Tenant ID for multi-tenancy support.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>URL of the uploaded file.</returns>
        Task<string> UploadAsync(Guid containerId, BlobFileDTO file, string tenantId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Uploads a file without tenant metadata.
        /// </summary>
        /// <param name="containerId">Container ID where the file will be uploaded.</param>
        /// <param name="file">File to be uploaded.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>URL of the uploaded file.</returns>
        Task<string> UploadAsync(Guid containerId, BlobFileDTO file, CancellationToken cancellationToken = default);

        /// <summary>
        /// Downloads a file from the blob storage by its name.
        /// </summary>
        /// <param name="blobName">Name of the blob to download.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Byte array of the downloaded file.</returns>
        Task<byte[]> DownloadAsync(string blobName, CancellationToken cancellationToken = default);

        /// <summary>
        /// Deletes a file from the blob storage by its name.
        /// </summary>
        /// <param name="blobName">Name of the blob to download.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>>True if the file was successfully deleted; otherwise, false.</returns>
        Task<bool> DeleteAsync(string blobName, CancellationToken cancellationToken = default);
    }
}
