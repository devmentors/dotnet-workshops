namespace Exercises.Generics.Examples;

// PRZYKŁAD (sekcja 7, slajd 37): metoda generyczna + type inference.
public static class GenericMethodsExample
{
    public static void Run()
    {
        Console.WriteLine("== 07: metoda generyczna + inference (slajd 37) ==");

        // Jawny argument typu...
        int x = First<int>(new[] { 3, 7, 9 });
        // ...ale zwykle zbędny: kompilator wnioskuje T z argumentów.
        string s = First(new[] { "a", "b" });
        Console.WriteLine($"First<int> -> {x}, First (inference) -> \"{s}\"");
    }

    private static T First<T>(IReadOnlyList<T> items)
    {
        return items[0];
    }
}
