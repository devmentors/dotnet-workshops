namespace Shop.Middleware;

public static class RequestIdMiddleware
{
    public static IApplicationBuilder UseRequestId(this IApplicationBuilder app) =>
        app.Use(async (context, next) =>
        {
            var id = Guid.NewGuid().ToString("n");
            context.Response.Headers["X-Request-Id"] = id;
            await next(context);
        });
}
