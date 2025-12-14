using BeautifyBaltics.Domain.SeedWork;

namespace BeautifyBaltics.Domain.ValueObjects;

public class ContactInformation(string email, string phoneNumber) : ValueObject
{
    public string Email { get; } = email;
    public string PhoneNumber { get; } = phoneNumber;

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Email;
        yield return PhoneNumber;
    }
}
