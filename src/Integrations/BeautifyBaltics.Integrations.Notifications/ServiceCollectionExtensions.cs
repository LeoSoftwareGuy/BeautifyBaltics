using BeautifyBaltics.Integrations.Notifications.Email;
using BeautifyBaltics.Integrations.Notifications.Options;
using BeautifyBaltics.Integrations.Notifications.Sms;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BeautifyBaltics.Integrations.Notifications;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddNotificationsIntegration(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<NotificationOptions>(configuration.GetSection(NotificationOptions.SectionName));
        services.Configure<SmsOptions>(configuration.GetSection($"{NotificationOptions.SectionName}:Twilio"));
        services.Configure<EmailOptions>(configuration.GetSection($"{NotificationOptions.SectionName}:SendGrid"));

        services.AddSingleton<ISmsService, TwilioSmsService>();
        services.AddSingleton<IEmailService, SendGridEmailService>();
        services.AddScoped<INotificationService, NotificationService>();

        return services;
    }
}
