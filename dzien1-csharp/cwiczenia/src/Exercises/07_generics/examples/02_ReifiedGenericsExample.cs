namespace Exercises.Generics.Examples;

// PRZYKŁAD (sekcja 7, slajd 37): generyki w .NET są reified -
// T istnieje w czasie wykonania, inaczej niż w TypeScript (type erasure).
public static class ReifiedGenericsExample
{
    public static void Run()
    {
        Console.WriteLine("== 07: generyki są reified - T istnieje w runtime (slajd 37) ==");

        // Dla ludzi z TS/PHP: tu typy generyczne NIE znikają po kompilacji.
        // typeof(T) w środku metody zna konkretny typ w czasie wykonania.
        WhoAmI(42);
        WhoAmI("tekst");
        WhoAmI(new List<decimal>());
    }

    private static void WhoAmI<T>(T value)
    {
        Console.WriteLine($"  T = {typeof(T).Name}");
    }
}
