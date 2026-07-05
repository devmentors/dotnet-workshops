namespace Exercises.Null.Examples;

// PRZYKŁAD (sekcja 4, slajdy 24-25): nullable reference types -
// znak ? włącza statyczną analizę kompilatora, nic nie zmienia w runtime.
public static class NullableReferenceTypesExample
{
    public static void Run()
    {
        Console.WriteLine("== 04: nullable reference types (slajdy 24-25) ==");

        string? maybe = Find(42);

        // string name = null;      // CS8600: null do typu non-nullable
        // Console.WriteLine(maybe.Length); // CS8602: dereferencja możliwego null

        int length = maybe?.Length ?? 0;
        Console.WriteLine($"maybe?.Length ?? 0 -> {length}");

        maybe ??= "brak";
        string sure = maybe!;  // ! = null-forgiving: "wiem lepiej" (na odpowiedzialność autora)
        Console.WriteLine($"po ??= : \"{sure}\"");

#nullable disable
        // Tak wyglądał C# przed NRT: to samo przypisanie, zero ostrzeżeń.
        string legacy = null;
        Console.WriteLine($"#nullable disable: legacy = {(legacy == null ? "null (kompilator milczy)" : legacy)}");
#nullable restore
    }

    private static string? Find(int id)
    {
        return id == 1 ? "Ada" : null;
    }
}
