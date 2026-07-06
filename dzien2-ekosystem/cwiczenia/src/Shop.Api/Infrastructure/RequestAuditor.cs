namespace Shop.Api.Infrastructure;

public class RequestAuditor
{
    private readonly IHttpContextAccessor _accessor;

    public RequestAuditor(IHttpContextAccessor accessor) => _accessor = accessor;

    public string Describe()
    {
        var http = _accessor.HttpContext;
        if (http is null) return "brak aktywnego żądania";
        return $"{http.Request.Method} {http.Request.Path}";
    }
}
