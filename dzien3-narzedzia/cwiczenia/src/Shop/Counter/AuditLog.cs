namespace Shop.Counter;

public sealed class AuditLog
{
    private readonly object _gate = new();
    private readonly List<string> _audit = [];
    private int _count;

    public int Count => _count;

    public int RecordUnsafe(string line)
    {
        var seen = _count;
        Thread.Yield();
        Thread.SpinWait(50);
        _count = seen + 1;
        return _count;
    }

    public void Record(string line)
    {
        lock (_gate)
        {
            _audit.Add(line);
            _count++;
        }
    }

    public IReadOnlyList<string> Snapshot()
    {
        lock (_gate)
        {
            return _audit.ToArray();
        }
    }
}
