using System.Diagnostics;

namespace Shop.Api.Infrastructure;

public sealed class TimedMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.GetEndpoint() is null || !context.Request.Path.StartsWithSegments("/timed"))
        {
            await next(context);
            return;
        }

        var sw = Stopwatch.StartNew();
        context.Response.Headers["X-Request-Id"] = Guid.NewGuid().ToString("n");
        await Task.Delay(100); // Wylacznie zeby bylo cos w elapsed
        context.Response.OnStarting(() =>
        {
            context.Response.Headers["X-Elapsed-Ms"] = sw.ElapsedMilliseconds.ToString();
            return Task.CompletedTask;
        });
        await next(context);
    }
}

public static class TimedMiddlewareExtensions
{
    public static IApplicationBuilder UseTimed(this IApplicationBuilder app)
        => app.UseMiddleware<TimedMiddleware>();
}
