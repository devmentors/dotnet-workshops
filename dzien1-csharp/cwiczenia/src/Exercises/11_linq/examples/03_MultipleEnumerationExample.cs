namespace Exercises.Linq.Examples;

// PRZYKŁAD (sekcja 11, slajd 56): multiple enumeration - każdy odczyt
// odroczonego zapytania to osobne pełne wykonanie.
public static class MultipleEnumerationExample
{
    public static void Run()
    {
        Console.WriteLine("== 11: multiple enumeration - pułapka (slajd 56) ==");

        var executions = 0;
        var active = new[] { "Ada", "Bob", "Ela" }
            .Where(name =>
            {
                executions++; 
                return name != "Bob";
            });

        // Trzy odczyty tego samego "przepisu" = trzy osobne wykonania.
        _ = active.Any();
        _ = active.Count();
        _ = active.ToArray();
        Console.WriteLine($"3 odczyty zapytania -> predykat wykonany {executions} razy, nie 3 (Any() ucina po 1. trafieniu; na IQueryable to 3 SELECTY!)");

        // Lekarstwo: zmaterializuj RAZ, potem czytaj gotową listę.
        executions = 0;
        var list = new[] { "Ada", "Bob", "Ela" }
            .Where(name => { executions++; return name != "Bob"; })
            .ToList();
        _ = list.Any();
        _ = list.Count;
        Console.WriteLine($"ToList() raz -> predykat wykonany {executions} razy");
    }
}
