using System.Net.Http.Json;
using BeautifyBaltics.Integrations.Notifications.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Integrations.Notifications.Sms;

public class TelnyxSmsService(
    IHttpClientFactory httpClientFactory,
    IOptions<SmsOptions> settings,
    ILogger<TelnyxSmsService> logger
) : ISmsService
{
    private readonly SmsOptions _settings = settings.Value;
    private readonly HttpClient _httpClient = httpClientFactory.CreateClient(nameof(TelnyxSmsService));
    private readonly ILogger<TelnyxSmsService> _logger = logger;

    public Task<bool> SendSmsAsync(string toPhoneNumber, string message) => SendSmsAsync(toPhoneNumber, message, null);

    public async Task<bool> SendSmsAsync(string toPhoneNumber, string message, string? mediaUrl)
    {
        if (!string.IsNullOrEmpty(mediaUrl))
        {
            _logger.LogWarning("Telnyx alphanumeric sender does not support MMS — sending plain SMS to {PhoneNumber}", toPhoneNumber);
        }

        try
        {
            var payload = new
            {
                from = _settings.SenderId,
                to = toPhoneNumber,
                text = message,
                messaging_profile_id = _settings.MessagingProfileId
            };

            var response = await _httpClient.PostAsJsonAsync("https://api.telnyx.com/v2/messages", payload);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("SMS sent successfully to {PhoneNumber}", toPhoneNumber);
                return true;
            }

            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("Telnyx SMS failed. Status: {StatusCode}, Body: {Body}", (int)response.StatusCode, errorBody);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending SMS to {PhoneNumber}", toPhoneNumber);
            return false;
        }
    }
}
