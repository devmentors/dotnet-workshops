using Shop.Correlation;

namespace Shop.Middleware;

public sealed class CorrelationMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, CorrelationAccessor correlation)
    {
        await next(context);
    }
}
