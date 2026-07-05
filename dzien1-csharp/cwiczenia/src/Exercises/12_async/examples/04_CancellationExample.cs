using System.Diagnostics;

namespace Exercises.Async.Examples;

// PRZYKŁAD (sekcja 12, slajd 68): CancellationToken - kooperacyjne,
// czyste anulowanie; nikt nie zabija wątku siłą.
public static class CancellationExample
{
    public static async Task Run()
    {
        Console.WriteLine("== 12: CancellationToken - czyste anulowanie (slajd 68) ==");

        // Token z timeoutem: po 1 s żąda anulowania (ręcznie: cts.Cancel()).
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(1));
        var stopwatch = Stopwatch.StartNew();
        try
        {
            // Framework honoruje token - Delay/HTTP/EF przerwą się same.
            await Task.Delay(TimeSpan.FromSeconds(30), cts.Token);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine($"operacja '30 s' anulowana czysto po {stopwatch.ElapsedMilliseconds} ms - żaden wątek nie zginął");
        }
    }

    // ⛔ ANTYWZORZEC (slajd 67): async void = fire & forget, wyjątek zabija proces.
    // Odkomentuj, wywołaj z Run() i patrz jak aplikacja umiera mimo try/catch u wołającego:
    // private static async void BoomAsync()
    // {
    //     await Task.Delay(100);
    //     throw new InvalidOperationException("nikt mnie nie złapie");
    // }
}
