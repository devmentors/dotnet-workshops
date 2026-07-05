namespace Exercises.Linq.Examples;

// PRZYKŁAD (sekcja 11, slajd 54): łańcuch operatorów -
// filtr -> grupowanie -> projekcja -> sortowanie, wszystko leniwe aż do ToList().
public static class OperatorChainExample
{
    public static void Run()
    {
        Console.WriteLine("== 11: łańcuch operatorów (slajd 54) ==");

        var sales = new[]
        {
            new Sale("GetResponse", 1200m, Paid: true),
            new Sale("Acme",         300m, Paid: true),
            new Sale("GetResponse",  800m, Paid: true),
            new Sale("Acme",         999m, Paid: false),
        };

        var report = sales
            .Where(s => s.Paid)
            .GroupBy(s => s.Client)
            .Select(g => new ClientTotal(g.Key, g.Sum(s => s.Amount)))
            .OrderByDescending(x => x.Total)
            .ToList();

        foreach (var row in report)
            Console.WriteLine($"  {row.Client}: {row.Total} zł");
    }
}

public record Sale(string Client, decimal Amount, bool Paid);

public record ClientTotal(string Client, decimal Total);
