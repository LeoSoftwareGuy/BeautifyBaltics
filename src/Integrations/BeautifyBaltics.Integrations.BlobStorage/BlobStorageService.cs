using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Integrations.BlobStorage
{
    public class BlobStorageService<TFile>(
        IOptions<BlobStorageOptions<TFile>> options,
        BlobServiceClient blobServiceClient,
        ILogger<BlobStorageService<TFile>> logger
    ) : IBlobStorageService<TFile>
        where TFile : notnull
    {
        public async Task<string> UploadAsync(Guid containerId, BlobFileDTO file, string tenantId, CancellationToken cancellationToken = default)
            => await UploadInternalAsync(containerId, file, tenantId, cancellationToken);

        public async Task<string> UploadAsync(Guid containerId, BlobFileDTO file, CancellationToken cancellationToken = default)
            => await UploadInternalAsync(containerId, file, tenantId: null, cancellationToken);

        private async Task<string> UploadInternalAsync(Guid containerId, BlobFileDTO file, string? tenantId, CancellationToken cancellationToken)
        {
            try
            {
                var containerClient = await GetContainerClientAsync(cancellationToken);

                var blobName = $"{containerId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var blobClient = containerClient.GetBlobClient(blobName);

                var blobUploadOptions = new BlobUploadOptions
                {
                    HttpHeaders = new BlobHttpHeaders { ContentType = file.ContentType },
                    Metadata = tenantId is null ? null : new Dictionary<string, string> { { "tenantId", tenantId } },
                    TransferOptions = new StorageTransferOptions { MaximumConcurrency = 8, MaximumTransferSize = 4 * 1024 * 1024 }
                };

                var binaryData = BinaryData.FromBytes(file.Content);
                await blobClient.UploadAsync(binaryData, blobUploadOptions, cancellationToken);
                return blobName;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error uploading blob {FileName} to container {ContainerName}", file.FileName, options.Value.ContainerName);
                throw;
            }
        }

        public async Task<byte[]> DownloadAsync(string blobName, CancellationToken cancellationToken = default)
        {
            try
            {
                var containerClient = await GetContainerClientAsync(cancellationToken);
                var blobClient = containerClient.GetBlobClient(blobName);

                if (!await blobClient.ExistsAsync(cancellationToken))
                {
                    throw new FileNotFoundException($"Blob {blobName} not found in {options.Value.ContainerName}");
                }

                var downloadInfo = await blobClient.DownloadContentAsync(cancellationToken);

                return downloadInfo.Value.Content.ToArray();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error downloading blob {BlobName} from container {ContainerName}", blobName, options.Value.ContainerName);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(string blobName, CancellationToken cancellationToken = default)
        {
            try
            {
                var containerClient = await GetContainerClientAsync(cancellationToken);
                var blobClient = containerClient.GetBlobClient(blobName);
                return await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting blob {BlobName} from container {ContainerName}", blobName, options.Value.ContainerName);
                throw;
            }
        }

        private async Task<BlobContainerClient> GetContainerClientAsync(CancellationToken cancellationToken = default)
        {
            var containerClient = blobServiceClient.GetBlobContainerClient(options.Value.ContainerName);
            await containerClient.CreateIfNotExistsAsync(cancellationToken: cancellationToken);
            return containerClient;
        }
    }

}
