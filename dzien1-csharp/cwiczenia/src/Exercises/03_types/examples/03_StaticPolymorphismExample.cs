namespace Exercises.Types.Examples;

// PRZYKŁAD (sekcja 3, slajdy 18-19): polimorfizm statyczny -
// przeciążenie operatora i przeciążenie metody, oba rozstrzygane w kompilacji.
public static class StaticPolymorphismExample
{
    public static void Run()
    {
        Console.WriteLine("== 03: polimorfizm statyczny (slajd 19) ==");

        // Przeciążenie OPERATORA: kompilator wybiera wariant po typach operandów.
        var total = new Distance(1500) + new Distance(500);
        Console.WriteLine($"operator +: 1500 m + 500 m = {total.Meters} m");

        // Przeciążenie METODY: ten sam zapis wywołania, warianty rozstrzygnięte
        // w czasie KOMPILACJI po typie argumentu.
        Print(7);
        Print("saldo");
    }

    private static void Print(int value)
    {
        Console.WriteLine($"Print(int):    liczba {value}");
    }

    private static void Print(string text)
    {
        Console.WriteLine($"Print(string): tekst \"{text}\"");
    }
}

public class Distance
{
    public double Meters;

    public Distance(double meters)
    {
        Meters = meters;
    }

    public static Distance operator +(Distance a, Distance b)
    {
        return new Distance(a.Meters + b.Meters);
    }
}
