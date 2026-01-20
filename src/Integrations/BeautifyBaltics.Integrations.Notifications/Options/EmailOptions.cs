namespace BeautifyBaltics.Integrations.Notifications.Options;

public record EmailOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = "BeautifyBaltics";
    public bool Enabled { get; set; } = true;

    public EmailTemplates Templates { get; set; } = new();
}

public record EmailTemplates
{
    public string ClientBookingConfirmed { get; set; } = string.Empty;
    public string ClientBookingCancelled { get; set; } = string.Empty;
    public string MasterBookingConfirmed { get; set; } = string.Empty;
    public string MasterBookingCancelled { get; set; } = string.Empty;
}
