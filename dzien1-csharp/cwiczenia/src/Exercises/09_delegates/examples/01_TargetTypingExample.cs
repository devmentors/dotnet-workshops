namespace Exercises.Delegates.Examples;

// PRZYKŁAD (sekcja 9, slajd 45): lambda nie ma własnego typu - dostaje go
// od typu docelowego przypisania (target typing).
public static class TargetTypingExample
{
    public static void Run()
    {
        Console.WriteLine("== 09: lambda nie ma własnego typu - target typing (slajd 45) ==");

        // TA SAMA lambda, trzy różne typy - o typie decyduje lewa strona przypisania.
        Func<string?> a = () => null;
        Func<int?> b = () => null;
        Func<object?> c = () => null;
        Console.WriteLine($"() => null przyjęte jako: {a.GetType()}, {b.GetType()}, {c.GetType()}");

        // Od C# 10: typ naturalny, gdy sygnatura jest jednoznaczna.
        var f = () => 1;
        Console.WriteLine($"var f = () => 1 -> {f.GetType().Name} (typ naturalny: Func<int>)");

        // var g = () => null;   // CS8917: niejednoznaczne - null nie wskazuje typu
    }
}
