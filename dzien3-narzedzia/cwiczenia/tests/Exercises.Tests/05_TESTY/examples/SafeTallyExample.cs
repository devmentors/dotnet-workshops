using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Exercises.Tests._05_TESTY.examples;

public class SafeTallyExample
{
    private const int Iterations = 100_000;

    private sealed class SafeTally
    {
        private long _n;

        public long Count => Volatile.Read(ref _n);

        public void Increment() => Interlocked.Increment(ref _n);
    }

    [Fact]
    public void interlocked_increment_keeps_every_update_under_parallelism()
    {
        var tally = new SafeTally();

        Parallel.For(0, Iterations, _ => tally.Increment());

        Assert.Equal((long)Iterations, tally.Count);
    }
}
