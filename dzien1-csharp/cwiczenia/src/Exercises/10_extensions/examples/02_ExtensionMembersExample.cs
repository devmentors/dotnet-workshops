namespace Exercises.Extensions.Examples;

// PRZYKŁAD (sekcja 10, slajdy 49-50): blok extension (C# 14) -
// typ podany RAZ, w środku metody I properties.
public static class ExtensionMembersExample
{
    public static void Run()
    {
        Console.WriteLine("== 10: blok extension - C# 14 (slajdy 49-50) ==");

        var numbers = new[] { 1, 2, 3 };
        var empty = Array.Empty<int>();

        // Extension PROPERTY (C# 14): czytana bez nawiasów, jakby była w typie.
        Console.WriteLine($"[1,2,3].IsEmpty -> {numbers.IsEmpty}, [].IsEmpty -> {empty.IsEmpty}");
        Console.WriteLine($"[].FirstOrDefaultSafe() -> {empty.FirstOrDefaultSafe()} (default(int) = 0)");
    }
}

// NOWY zapis (C# 14): blok extension zamiast powtarzania `this T` w każdej sygnaturze.
public static class EnumerableDemos
{
    extension<T>(IEnumerable<T> source)
    {
        public bool IsEmpty => !source.Any();
        public T? FirstOrDefaultSafe() => source.FirstOrDefault();
    }
}
