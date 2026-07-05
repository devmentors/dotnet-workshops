namespace Exercises.Async.Examples;

// PRZYKŁAD (sekcja 12, slajd 64): await ODDAJE wątek na czas oczekiwania -
// kontynuacja może wrócić na innym wątku z puli.
public static class ThreadHoppingExample
{
    public static async Task Run()
    {
        Console.WriteLine("== 12: await zwalnia wątek - dowód (slajd 64) ==");

        Console.WriteLine($"przed await: wątek {Environment.CurrentManagedThreadId}");
        await Task.Delay(100);  // "I/O": wątek ODDANY do puli na czas oczekiwania
        // Kontynuacja może wrócić na INNYM wątku - nikt nie stał i nie czekał.
        Console.WriteLine($"po await:    wątek {Environment.CurrentManagedThreadId}");
    }
}
