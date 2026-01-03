using Microsoft.IdentityModel.Tokens;

namespace BeautifyBaltics.Core.API.Authentication;

public interface ISupabaseSigningKeysProvider
{
    Task<IReadOnlyCollection<SecurityKey>> GetSigningKeysAsync(CancellationToken cancellationToken = default);
}

internal sealed class SupabaseSigningKeysProvider(
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    ILogger<SupabaseSigningKeysProvider> logger
) : ISupabaseSigningKeysProvider
{
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
    private readonly IConfiguration _configuration = configuration;
    private readonly ILogger<SupabaseSigningKeysProvider> _logger = logger;
    private readonly SemaphoreSlim _refreshLock = new(1, 1);

    private IReadOnlyCollection<SecurityKey>? _cachedKeys;
    private DateTimeOffset _refreshAt = DateTimeOffset.MinValue;

    public async Task<IReadOnlyCollection<SecurityKey>> GetSigningKeysAsync(CancellationToken cancellationToken = default)
    {
        if (_cachedKeys is { Count: > 0 } && DateTimeOffset.UtcNow < _refreshAt)
        {
            return _cachedKeys ?? Array.Empty<SecurityKey>();
        }

        await _refreshLock.WaitAsync(cancellationToken).ConfigureAwait(false);

        try
        {
            if (_cachedKeys is { Count: > 0 } && DateTimeOffset.UtcNow < _refreshAt)
            {
                return _cachedKeys ?? Array.Empty<SecurityKey>();
            }

            var supabaseUrl = _configuration["Authentication:SupabaseUrl"];
            if (string.IsNullOrWhiteSpace(supabaseUrl))
            {
                throw new InvalidOperationException("Missing Authentication:SupabaseUrl configuration value.");
            }

            var keysEndpoint = $"{supabaseUrl.TrimEnd('/')}/auth/v1/.well-known/jwks.json";
            var client = _httpClientFactory.CreateClient(nameof(SupabaseSigningKeysProvider));

            _logger.LogInformation("Refreshing Supabase JWKS from {Endpoint}", keysEndpoint);
            using var response = await client.GetAsync(keysEndpoint, cancellationToken).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);
            var jwks = new JsonWebKeySet(json);

            _cachedKeys = (IReadOnlyCollection<SecurityKey>?)jwks.GetSigningKeys();
            _refreshAt = DateTimeOffset.UtcNow.Add(CacheDuration);

            return _cachedKeys ?? Array.Empty<SecurityKey>();
        }
        finally
        {
            _refreshLock.Release();
        }
    }
}
