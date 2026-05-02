using System.Net.Http.Headers;
using System.Text;
using System.Xml.Linq;
using BeautifyBaltics.Integrations.BlobStorage;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Core.API.Infrastructure.DataProtection;

public sealed class SupabaseDataProtectionXmlRepository : IXmlRepository, IDisposable
{
    private const string Bucket = "data-protection-keys";
    private const string BlobName = "keys.xml";

    // Own HttpClient with a hard timeout — bypasses the global AddStandardResilienceHandler
    // pipeline (retries + circuit breaker) which would block the calling thread via sync Send().
    private readonly HttpClient _httpClient = new() { Timeout = TimeSpan.FromSeconds(10) };

    private readonly string _baseUrl;
    private readonly string _serviceKey;
    private readonly ILogger<SupabaseDataProtectionXmlRepository> _logger;

    public SupabaseDataProtectionXmlRepository(
        IOptions<SupabaseBlobStorageOptions> supabaseOptions,
        ILogger<SupabaseDataProtectionXmlRepository> logger)
    {
        _baseUrl = supabaseOptions.Value.Url.TrimEnd('/');
        _serviceKey = supabaseOptions.Value.ServiceRoleKey;
        _logger = logger;
    }

    public IReadOnlyCollection<XElement> GetAllElements()
    {
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Get,
                $"{_baseUrl}/storage/v1/object/{Bucket}/{BlobName}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);

            using var response = _httpClient.Send(request);

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return [];

            response.EnsureSuccessStatusCode();

            using var stream = response.Content.ReadAsStream();
            var doc = XDocument.Load(stream);
            return doc.Root?.Elements().ToList() ?? [];
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load DataProtection keys from Supabase Storage — starting with empty key set");
            return [];
        }
    }

    public void StoreElement(XElement element, string friendlyName)
    {
        try
        {
            var existing = GetAllElements();

            var merged = existing
                .Where(e => e.Attribute("id")?.Value != element.Attribute("id")?.Value)
                .Append(element);

            var doc = new XDocument(new XElement("repository", merged));
            var xml = doc.ToString();

            using var request = new HttpRequestMessage(HttpMethod.Post,
                $"{_baseUrl}/storage/v1/object/{Bucket}/{BlobName}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
            request.Headers.Add("x-upsert", "true");
            request.Content = new StringContent(xml, Encoding.UTF8, "application/xml");

            using var response = _httpClient.Send(request);
            response.EnsureSuccessStatusCode();

            _logger.LogInformation("DataProtection key '{FriendlyName}' persisted to Supabase Storage", friendlyName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to persist DataProtection key '{FriendlyName}' to Supabase Storage", friendlyName);
            throw;
        }
    }

    public void Dispose() => _httpClient.Dispose();
}
