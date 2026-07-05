namespace Exercises.Async.Examples;

// PRZYKŁAD (sekcja 12, slajd 63): async bez await = metoda wykonuje się
// W PEŁNI SYNCHRONICZNIE. Słowo async samo niczego nie przyspiesza.
public static class AsyncWithoutAwaitExample
{
    public static async Task Run()
    {
        Console.WriteLine("== 12: async bez await = synchronicznie (slajd 63) ==");
        Console.WriteLine($"ComputeAsync() = {await ComputeAsync()} (żadnego punktu zawieszenia po drodze)");
    }

#pragma warning disable CS1998 // celowo: async bez await -> kompilator ostrzega CS1998
    private static async Task<int> ComputeAsync()
    {
        return 2 + 2;
    }
#pragma warning restore CS1998
}
