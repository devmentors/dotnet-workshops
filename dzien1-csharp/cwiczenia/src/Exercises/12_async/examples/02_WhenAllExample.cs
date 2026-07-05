using System.Diagnostics;

namespace Exercises.Async.Examples;

// PRZYKŁAD (sekcja 12): trzy niezależne operacje I/O - po kolei vs Task.WhenAll.
public static class WhenAllExample
{
    public static async Task Run()
    {
        Console.WriteLine("== 12: sekwencyjnie vs Task.WhenAll ==");

        var stopwatch = Stopwatch.StartNew();
        await FetchAsync("A");
        await FetchAsync("B");
        await FetchAsync("C");
        Console.WriteLine($"3x await po kolei:  {stopwatch.ElapsedMilliseconds} ms");

        stopwatch.Restart();
        // Start wszystkich NARAZ, potem jedno czekanie na komplet.
        await Task.WhenAll(FetchAsync("A"), FetchAsync("B"), FetchAsync("C"));
        Console.WriteLine($"Task.WhenAll:       {stopwatch.ElapsedMilliseconds} ms");
    }

    private static async Task<string> FetchAsync(string name)
    {
        await Task.Delay(200);  // symulacja wywołania HTTP/bazy ~200 ms
        return name;
    }
}
