namespace Shop.Api.Infrastructure;

public class SingletonProbe { public Guid Id { get; } = Guid.NewGuid(); }
public class ScopedProbe { public Guid Id { get; } = Guid.NewGuid(); }
public class TransientProbe { public Guid Id { get; } = Guid.NewGuid(); }

public class CaptiveConsumer(ScopedProbe scoped)
{
    public Guid CapturedScopedId { get; } = scoped.Id;
}

public class ScopeSafeConsumer(IServiceScopeFactory scopes)
{
    public Guid FreshScopedId()
    {
        using var scope = scopes.CreateScope();
        return scope.ServiceProvider.GetRequiredService<ScopedProbe>().Id;
    }
}

public static class LifetimeDemoEndpoints
{
    public static void MapLifetimeDemo(this WebApplication app)
    {
        app.MapGet("/di-lifetimes", (
            SingletonProbe s1, SingletonProbe s2,
            ScopedProbe r1, ScopedProbe r2,
            TransientProbe t1, TransientProbe t2) => Results.Ok(new
        {
            singleton = new[] { s1.Id, s2.Id },
            scoped = new[] { r1.Id, r2.Id },
            transient = new[] { t1.Id, t2.Id }
        }));

        app.MapGet("/di-captive", (CaptiveConsumer captive, ScopeSafeConsumer safe, ScopedProbe fresh) => Results.Ok(new
        {
            captiveCaptured = captive.CapturedScopedId,
            scopeSafeFresh = safe.FreshScopedId(),
            requestScoped = fresh.Id,
        }));
    }
}
