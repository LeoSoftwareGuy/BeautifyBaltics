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
        ConfigureSmsOptions(services, configuration);
        ConfigureEmailOptions(services, configuration);

        services.AddSingleton<ISmsService, TwilioSmsService>();
        services.AddSingleton<IEmailService, SendGridEmailService>();
        services.AddScoped<INotificationService, NotificationService>();

        return services;
    }

    private static void ConfigureSmsOptions(IServiceCollection services, IConfiguration configuration)
    {
        var smsSection = configuration.GetSection($"{NotificationOptions.SectionName}:Sms");
        var twilioSection = configuration.GetSection($"{NotificationOptions.SectionName}:Twilio");

        if (smsSection.Exists())
        {
            services.Configure<SmsOptions>(smsSection);
        }

        if (twilioSection.Exists())
        {
            services.Configure<SmsOptions>(twilioSection);
        }
    }

    private static void ConfigureEmailOptions(IServiceCollection services, IConfiguration configuration)
    {
        var emailSection = configuration.GetSection($"{NotificationOptions.SectionName}:Email");
        var sendGridSection = configuration.GetSection($"{NotificationOptions.SectionName}:SendGrid");

        if (emailSection.Exists())
        {
            services.Configure<EmailOptions>(emailSection);
        }

        if (sendGridSection.Exists())
        {
            services.Configure<EmailOptions>(sendGridSection);
        }
    }
}
