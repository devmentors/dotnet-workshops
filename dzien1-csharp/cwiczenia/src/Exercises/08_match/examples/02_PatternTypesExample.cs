namespace Exercises.Match.Examples;

// PRZYKŁAD (sekcja 8, slajd 42): pięć rodzajów patternów na jednym obiekcie.
public static class PatternTypesExample
{
    public static void Run()
    {
        Console.WriteLine("== 08: typy patternów na jednym obiekcie (slajd 42) ==");

        var order = new Order(OrderStatus.Paid, 250m);
        object boxed = order;

        // is pattern: test typu + przypisanie w jednym kroku.
        if (boxed is Order matched)
            Console.WriteLine($"is:         to Order na {matched.Total} zł");

        // property pattern: dopasowanie po wartościach składowych.
        if (order is { Status: OrderStatus.Paid, Total: > 100m })
            Console.WriteLine("property:   opłacone i > 100 zł -> darmowa dostawa");

        // relational + logical: porównania i and/or/not wprost we wzorcu.
        string size = order.Total switch
        {
            >= 1m and <= 99m => "małe",
            >= 100m and < 1000m => "średnie",
            _ => "inne"
        };
        Console.WriteLine($"relational: zamówienie {size}");

        // positional pattern: MOST WSTECZ do sekcji 6 - to ta sama dekonstrukcja
        // (metoda Deconstruct), tylko użyta jako wzorzec dopasowania.
        var point = new Coord(0, 5);
        string location = point switch
        {
            (0, 0)      => "początek układu",
            (0, var y)  => $"na osi Y (y={y})",
            var (x, y)  => $"punkt ({x},{y})"
        };
        Console.WriteLine($"positional: {location}");
    }
}

public enum OrderStatus
{
    New,
    Paid,
    Shipped
}

public record Order(OrderStatus Status, decimal Total);

public record Coord(int X, int Y);
