namespace Shop.Counter;

public sealed class VisitCounter
{
    private long _count;

    public long Max { get; }

    public VisitCounter(long max = long.MaxValue) => Max = max;

    public long Count => _count;

    public bool TryIncrement()
    {
        if (_count < Max)
        {
            var current = _count;

            Thread.Yield();
            Thread.SpinWait(100);

            _count = current + 1;
            return true;
        }

        return false;
    }
}
