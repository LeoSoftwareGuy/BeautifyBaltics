namespace BeautifyBaltics.Domain.Exceptions;

public class DomainException : Exception
{
    /// <summary>
    /// Creates a domain exception with the specified error message
    /// </summary>
    /// <param name="message">The error details</param>
    public DomainException(string message) : base(message)
    {
    }

    /// <summary>
    /// Creates a typed domain exception for a specific domain entity
    /// </summary>
    /// <param name="message">The error details</param>
    /// <returns>A new domain exception</returns>
    public static DomainException WithMessage(string message) => new(message);
}
