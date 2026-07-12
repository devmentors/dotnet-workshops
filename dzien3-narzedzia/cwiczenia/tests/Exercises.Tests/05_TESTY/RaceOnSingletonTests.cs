using Shop.Counter;
using Xunit;

namespace Exercises.Tests._05_TESTY;

public class RaceOnSingletonTests
{
    private const long Max = 200_000;

    private static readonly int Threads = Math.Max(8, Environment.ProcessorCount * 2);

    private const int PerThread = 100_000;

    [Fact]
    public void tryincrement_under_limit_holds_compound_invariant_under_parallelism()
    {
        var counter = new VisitCounter(Max);

        var acceptedPerThread = new long[Threads];

        using var gate = new Barrier(Threads + 1);
        var workers = new Thread[Threads];
        for (var t = 0; t < Threads; t++)
        {
            var index = t;
            workers[t] = new Thread(() =>
            {
                gate.SignalAndWait();
                long accepted = 0;
                for (var i = 0; i < PerThread; i++)
                {
                    if (counter.TryIncrement())
                    {
                        accepted++;
                    }
                }

                acceptedPerThread[index] = accepted;
            });
            workers[t].Start();
        }

        gate.SignalAndWait();
        foreach (var w in workers)
        {
            w.Join();
        }

        long totalAccepted = 0;
        foreach (var accepted in acceptedPerThread)
        {
            totalAccepted += accepted;
        }

        Assert.Equal(counter.Count, totalAccepted);

        Assert.True(
            counter.Count <= Max,
            $"licznik {counter.Count} przekroczył limit {Max} — check+inkrement nie był niepodzielny");

        Assert.Equal(Max, totalAccepted);
    }
}
