using BeautifyBaltics.Integrations.Notifications.Email;
using BeautifyBaltics.Integrations.Notifications.Options;
using BeautifyBaltics.Integrations.Notifications.Sms;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BeautifyBaltics.Integrations.Notifications;

public class NotificationService(
    ISmsService smsService,
    IEmailService emailService,
    IOptions<EmailOptions> emailOptions,
    ILogger<NotificationService> logger
) : INotificationService
{
    private static readonly TimeZoneInfo _balticsTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Tallinn");
    private readonly EmailTemplates _templates = emailOptions.Value.Templates;
    private readonly string _adminEmail = emailOptions.Value.AdminEmail;

    private static string FormatLocalTime(DateTime scheduledAt) =>
        TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(scheduledAt, DateTimeKind.Utc), _balticsTimeZone)
            .ToString("dd.MM.yyyy HH:mm");

    public Task NotifyBookingRequestedAsync(BookingNotificationContext context, CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Sending booking request notification for {ServiceName} scheduled at {ScheduledAt}",
            context.ServiceName,
            context.ScheduledAt
        );

        return SendMasterBookingRequestSmsAsync(context);
    }

    public async Task NotifyBookingConfirmedAsync(BookingNotificationContext context, CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Sending booking confirmation notifications for {ServiceName} scheduled at {ScheduledAt}",
            context.ServiceName,
            context.ScheduledAt
        );

        var tasks = new List<Task>
        {
            SendClientConfirmationSmsAsync(context),
            SendMasterConfirmationSmsAsync(context),
            SendClientConfirmationEmailAsync(context, cancellationToken),
            SendMasterConfirmationEmailAsync(context, cancellationToken)
        };

        await Task.WhenAll(tasks);
    }

    public async Task NotifyBookingCancelledAsync(BookingNotificationContext context, CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Sending booking cancellation notifications for {ServiceName} scheduled at {ScheduledAt}",
            context.ServiceName,
            context.ScheduledAt
        );

        var tasks = new List<Task>
        {
            SendClientCancellationSmsAsync(context),
            SendMasterCancellationSmsAsync(context),
            SendClientCancellationEmailAsync(context, cancellationToken),
            SendMasterCancellationEmailAsync(context, cancellationToken)
        };

        await Task.WhenAll(tasks);
    }

    private Task SendMasterBookingRequestSmsAsync(BookingNotificationContext context)
    {
        var message = $"Uus broneering! {context.ClientName} soovib {context.ServiceName} {FormatLocalTime(context.ScheduledAt)}. Palun kinnita või tühista.{BuildLocationSnippet(context)}";
        return smsService.SendSmsAsync(context.MasterPhone, message);
    }

    private Task SendClientConfirmationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Tere, {context.ClientName}! Teie broneering on kinnitatud: {context.ServiceName} {FormatLocalTime(context.ScheduledAt)}. Meister: {context.MasterName}.{BuildLocationSnippet(context)} Aitäh!";
        return smsService.SendSmsAsync(context.ClientPhone, message);
    }

    private Task SendMasterConfirmationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Uus kinnitus! {context.ClientName} broneeris {context.ServiceName} {FormatLocalTime(context.ScheduledAt)}. Hind: {context.Price}€.{BuildLocationSnippet(context)}";
        return smsService.SendSmsAsync(context.MasterPhone, message);
    }

    private Task SendClientCancellationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Teie broneering {context.ServiceName} {FormatLocalTime(context.ScheduledAt)} on tühistatud.{BuildLocationSnippet(context)} Vabandame ebamugavuste pärast.";
        return smsService.SendSmsAsync(context.ClientPhone, message);
    }

    private Task SendMasterCancellationSmsAsync(BookingNotificationContext context)
    {
        var message = $"Broneering tühistatud: {context.ClientName}, {context.ServiceName} {FormatLocalTime(context.ScheduledAt)}.{BuildLocationSnippet(context)}";
        return smsService.SendSmsAsync(context.MasterPhone, message);
    }

    private Task SendClientConfirmationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            client_name = context.ClientName,
            client_phone = context.ClientPhone,
            service_name = context.ServiceName,
            booking_date = FormatLocalTime(context.ScheduledAt),
            duration = context.Duration.TotalMinutes,
            price = context.Price,
            master_name = context.MasterName,
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.ClientEmail,
            _templates.ClientBookingConfirmed,
            templateData,
            cancellationToken
        );
    }

    private Task SendMasterConfirmationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            master_name = context.MasterName,
            client_name = context.ClientName,
            client_phone = context.ClientPhone,
            client_email = context.ClientEmail,
            service_name = context.ServiceName,
            booking_date = FormatLocalTime(context.ScheduledAt),
            duration = context.Duration.TotalMinutes,
            price = context.Price,
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.MasterEmail,
            _templates.MasterBookingConfirmed,
            templateData,
            cancellationToken
        );
    }

    private Task SendClientCancellationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            client_name = context.ClientName,
            service_name = context.ServiceName,
            booking_date = FormatLocalTime(context.ScheduledAt),
            master_name = context.MasterName,
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.ClientEmail,
            _templates.ClientBookingCancelled,
            templateData,
            cancellationToken
        );
    }

    private Task SendMasterCancellationEmailAsync(BookingNotificationContext context, CancellationToken cancellationToken)
    {
        var templateData = new
        {
            booking_id = context.BookingId.ToString(),
            master_name = context.MasterName,
            client_name = context.ClientName,
            service_name = context.ServiceName,
            booking_date = FormatLocalTime(context.ScheduledAt),
            location_name = context.LocationName ?? string.Empty,
            location_address = context.LocationAddress ?? string.Empty
        };

        return emailService.SendWithTemplateAsync(
            context.MasterEmail,
            _templates.MasterBookingCancelled,
            templateData,
            cancellationToken
        );
    }

    public async Task NotifyKycApprovedAsync(KycNotificationContext context, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Sending KYC approval notification to master {MasterEmail}", context.MasterEmail);

        if (string.IsNullOrWhiteSpace(_templates.MasterKycApproved))
        {
            logger.LogWarning("KYC approved email template not configured — skipping email.");
            return;
        }

        var templateData = new
        {
            master_name = context.MasterName,
        };

        await emailService.SendWithTemplateAsync(
            context.MasterEmail,
            _templates.MasterKycApproved,
            templateData,
            cancellationToken
        );
    }

    public async Task NotifyKycRejectedAsync(KycNotificationContext context, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Sending KYC rejection notification to master {MasterEmail}", context.MasterEmail);

        if (string.IsNullOrWhiteSpace(_templates.MasterKycRejected))
        {
            logger.LogWarning("KYC rejected email template not configured — skipping email.");
            return;
        }

        var templateData = new
        {
            master_name = context.MasterName,
            rejection_reason = context.RejectionReason ?? string.Empty,
        };

        await emailService.SendWithTemplateAsync(
            context.MasterEmail,
            _templates.MasterKycRejected,
            templateData,
            cancellationToken
        );
    }

    private static string BuildLocationSnippet(BookingNotificationContext context)
    {
        if (string.IsNullOrWhiteSpace(context.LocationName) && string.IsNullOrWhiteSpace(context.LocationAddress))
        {
            return string.Empty;
        }

        var parts = new List<string>();

        if (!string.IsNullOrWhiteSpace(context.LocationName))
        {
            parts.Add(context.LocationName);
        }

        if (!string.IsNullOrWhiteSpace(context.LocationAddress))
        {
            parts.Add(context.LocationAddress);
        }

        return parts.Count == 0 ? string.Empty : $" Asukoht: {string.Join(", ", parts)}.";
    }
}
