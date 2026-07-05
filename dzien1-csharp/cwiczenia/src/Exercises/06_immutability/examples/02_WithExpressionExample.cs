namespace Exercises.Immutability.Examples;

// PRZYKŁAD (sekcja 6, slajd 34): wyrażenie `with` - kopia z modyfikacją,
// oryginał zostaje nietknięty.
public static class WithExpressionExample
{
    public static void Run()
    {
        Console.WriteLine("== 06: with - kopia z modyfikacją (slajd 34) ==");

        var basic = new Subscription("Basic", 29m);
        var pro = basic with { Plan = "Pro", Price = 49m };
        Console.WriteLine($"oryginał nietknięty: {basic}");
        Console.WriteLine($"kopia po with:       {pro}");

        // Niemutowalność pilnowana w kompilacji:
        // basic.Price = 999m;   // CS8852: init-only poza inicjalizacją
    }
}

public record Subscription(string Plan, decimal Price);
