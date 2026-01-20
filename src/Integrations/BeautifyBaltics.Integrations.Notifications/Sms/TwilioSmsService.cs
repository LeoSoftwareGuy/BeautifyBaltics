using BeautifyBaltics.Integrations.Notifications.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace BeautifyBaltics.Integrations.Notifications.Sms
{
    public class TwilioSmsService : ISmsService
    {
        private readonly SmsOptions _settings;
        private readonly ILogger<TwilioSmsService> _logger;

        public TwilioSmsService(
            IOptions<SmsOptions> settings,
            ILogger<TwilioSmsService> logger)
        {
            _settings = settings.Value;
            _logger = logger;

            // Initialize Twilio client
            TwilioClient.Init(_settings.AccountSid, _settings.AuthToken);
        }

        public async Task<bool> SendSmsAsync(string toPhoneNumber, string message)
        {
            return await SendSmsAsync(toPhoneNumber, message, null);
        }

        public async Task<bool> SendSmsAsync(string toPhoneNumber, string message, string? mediaUrl)
        {
            try
            {
                var messageOptions = new CreateMessageOptions(new PhoneNumber(toPhoneNumber))
                {
                    From = new PhoneNumber(_settings.PhoneNumber),
                    Body = message
                };

                if (!string.IsNullOrEmpty(mediaUrl))
                {
                    messageOptions.MediaUrl = new List<Uri> { new Uri(mediaUrl) };
                }

                var messageResource = await MessageResource.CreateAsync(messageOptions);

                _logger.LogInformation(
                    "SMS sent successfully. SID: {MessageSid}, Status: {Status}",
                    messageResource.Sid,
                    messageResource.Status
                );

                return messageResource.Status != MessageResource.StatusEnum.Failed;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending SMS to {PhoneNumber}", toPhoneNumber);
                return false;
            }
        }
    }
}