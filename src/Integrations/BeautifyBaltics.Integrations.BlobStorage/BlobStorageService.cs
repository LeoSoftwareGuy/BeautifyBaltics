using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Integrations.BlobStorage
{
    public class BlobStorageService<TFile>(
        IHttpClientFactory httpClientFactory,
        IOptions<BlobStorageOptions<TFile>> options,
        IOptions<SupabaseBlobStorageOptions> supabaseOptions,
        ILogger<BlobStorageService<TFile>> logger
    ) : IBlobStorageService<TFile>
        where TFile : notnull
    {
        private readonly string _bucket = options.Value.ContainerName;
        private readonly string? _baseUrl = supabaseOptions.Value.Url?.TrimEnd('/');
        private readonly string? _serviceKey = supabaseOptions.Value.ServiceRoleKey;

        public Task<string> UploadAsync(Guid containerId, BlobFileDTO file, string tenantId, CancellationToken cancellationToken = default)
            => UploadInternalAsync(containerId, file, cancellationToken);

        public Task<string> UploadAsync(Guid containerId, BlobFileDTO file, CancellationToken cancellationToken = default)
            => UploadInternalAsync(containerId, file, cancellationToken);

        private async Task<string> UploadInternalAsync(Guid containerId, BlobFileDTO file, CancellationToken cancellationToken)
        {
            var path = $"{containerId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            try
            {
                var client = httpClientFactory.CreateClient("supabase-storage");

                using var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/storage/v1/object/{_bucket}/{path}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
                request.Headers.Add("apikey", _serviceKey);
                request.Headers.Add("x-upsert", "true");
                request.Content = new ByteArrayContent(file.Content);
                request.Content.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

                var response = await client.SendAsync(request, cancellationToken);
                response.EnsureSuccessStatusCode();

                return path;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error uploading blob {FileName} to bucket {Bucket}", file.FileName, _bucket);
                throw;
            }
        }

        public async Task<byte[]> DownloadAsync(string blobName, CancellationToken cancellationToken = default)
        {
            try
            {
                var client = httpClientFactory.CreateClient("supabase-storage");

                using var request = new HttpRequestMessage(HttpMethod.Get, $"{_baseUrl}/storage/v1/object/{_bucket}/{blobName}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
                request.Headers.Add("apikey", _serviceKey);

                var response = await client.SendAsync(request, cancellationToken);
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    throw new FileNotFoundException($"Blob {blobName} not found in bucket {_bucket}");
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadAsByteArrayAsync(cancellationToken);
            }
            catch (Exception ex) when (ex is not FileNotFoundException)
            {
                logger.LogError(ex, "Error downloading blob {BlobName} from bucket {Bucket}", blobName, _bucket);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(string blobName, CancellationToken cancellationToken = default)
        {
            try
            {
                var client = httpClientFactory.CreateClient("supabase-storage");

                using var request = new HttpRequestMessage(HttpMethod.Delete, $"{_baseUrl}/storage/v1/object/{_bucket}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
                request.Headers.Add("apikey", _serviceKey);
                request.Content = new StringContent(
                    JsonSerializer.Serialize(new { prefixes = new[] { blobName } }),
                    Encoding.UTF8, "application/json");

                var response = await client.SendAsync(request, cancellationToken);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting blob {BlobName} from bucket {Bucket}", blobName, _bucket);
                throw;
            }
        }

        public string? GetBlobUrl(string? blobName, TimeSpan? expiresIn = null)
        {
            if (string.IsNullOrEmpty(blobName)) return null;
            return $"{_baseUrl}/storage/v1/object/public/{_bucket}/{blobName}";
        }
    }
}
