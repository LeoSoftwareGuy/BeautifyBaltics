namespace BeautifyBaltics.Domain.Exceptions;

public class NotFoundException : Exception
{
    private NotFoundException(string typeName, string id) : base($"{typeName} with id '{id}' was not found") { }

    public NotFoundException(string message) : base(message) { }

    public static NotFoundException For<T>(Guid id) => For<T>(id.ToString());

    public static NotFoundException For<T>(string id) => new(typeof(T).Name, id);
}
