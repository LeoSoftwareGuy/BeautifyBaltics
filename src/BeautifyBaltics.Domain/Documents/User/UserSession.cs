namespace BeautifyBaltics.Domain.Documents.User;

public class UserSession
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public byte[]? Ticket { get; private set; }
    public DateTime ExpirationTime { get; private set; }
    public string? IpAddress { get; private set; }
    public string? UserAgent { get; private set; }

    private UserSession() { }

    public UserSession(Guid id, Guid userId, byte[] ticket, DateTime expirationTime, string? ipAddress, string? userAgent)
    {
        Id = id;
        UserId = userId;
        Ticket = ticket;
        ExpirationTime = expirationTime;
        IpAddress = ipAddress;
        UserAgent = userAgent;
    }

    public void Extend(byte[] ticket, DateTime expirationTime, string? ipAddress, string? userAgent)
    {
        Ticket = ticket;
        ExpirationTime = expirationTime;
        IpAddress = ipAddress;
        UserAgent = userAgent;
    }
}
