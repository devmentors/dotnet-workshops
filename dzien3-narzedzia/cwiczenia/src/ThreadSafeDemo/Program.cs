using System.Collections.Concurrent;

const int Workers = 50;
const int PerWorker = 1_000;
const int Expected = Workers * PerWorker;

Console.WriteLine($"Startuję {Workers} wątków × {PerWorker} operacji = {Expected} oczekiwanych.\n");

long interlockedCounter = 0;

long runningMax = 0;

var hits = new ConcurrentDictionary<string, int>();
var keys = new[] { "pl", "en", "de" };

Parallel.For(0, Workers, worker =>
{
    for (var i = 0; i < PerWorker; i++)
    {
        Interlocked.Increment(ref interlockedCounter);

        UpdateMax(ref runningMax, worker * PerWorker + i);

        var key = keys[i % keys.Length];
        hits.AddOrUpdate(key, addValue: 1, updateValueFactory: (_, n) => n + 1);
    }
});

var totalInDictionary = hits.Values.Sum();

Console.WriteLine($"Interlocked.Increment       → {interlockedCounter,7:N0}   (oczekiwane {Expected:N0})");
Console.WriteLine($"Interlocked.CompareExchange → max = {runningMax,4:N0}   (oczekiwane {Expected - 1:N0})");
Console.WriteLine($"ConcurrentDictionary suma   → {totalInDictionary,7:N0}   (oczekiwane {Expected:N0})");
Console.WriteLine("  per klucz: " + string.Join(", ", hits.Select(kv => $"{kv.Key}={kv.Value}")));

var ok = interlockedCounter == Expected
         && runningMax == Expected - 1
         && totalInDictionary == Expected;
Console.WriteLine(ok
    ? "\n✔ Wszystko zgadza się bez ani jednego własnego locka."
    : "\n✘ Rozjazd — to nie powinno się zdarzyć dla tych typów.");

static void UpdateMax(ref long target, long candidate)
{
    while (true)
    {
        var seen = Interlocked.Read(ref target);
        if (candidate <= seen)
        {
            return;
        }

        if (Interlocked.CompareExchange(ref target, candidate, seen) == seen)
        {
            return;
        }
    }
}
