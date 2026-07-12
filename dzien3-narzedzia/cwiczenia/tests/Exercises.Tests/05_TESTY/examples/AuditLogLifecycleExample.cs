using Shop.Counter;
using Xunit;

namespace Exercises.Tests._05_TESTY.examples;

public class AuditLogLifecycleExample
{
    private readonly AuditLog _log = new();

    [Fact]
    public void starts_empty()
    {
        Assert.Empty(_log.Snapshot());
    }

    [Fact]
    public void records_isolated()
    {
        _log.Record("checkout");

        Assert.Single(_log.Snapshot());
    }
}
