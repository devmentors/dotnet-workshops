namespace Shop.Core;

// Wyjątek domenowy — złamana reguła biznesowa.
public sealed class DomainException(string message, int statusCode = 409) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}
