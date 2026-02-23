namespace BeautifyBaltics.Domain.Documents;

public class EmailVerificationToken
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string Token { get; init; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; init; }
    public bool Used { get; private set; }

    private EmailVerificationToken() { }

    public EmailVerificationToken(Guid id, Guid userId, string token, DateTimeOffset expiresAt)
    {
        Id = id;
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
        Used = false;
    }

    public bool IsValid() => !Used && ExpiresAt > DateTimeOffset.UtcNow;

    public void MarkUsed() => Used = true;
}
