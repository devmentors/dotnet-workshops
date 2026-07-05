namespace Exercises.Generics.Examples;

// PRZYKŁAD (sekcja 7, slajd 39): constraints `where T` odblokowują operacje na T.
public static class ConstraintsExample
{
    public static void Run()
    {
        Console.WriteLine("== 07: constraints odblokowują operacje (slajd 39) ==");

        Console.WriteLine($"IsSorted([1,2,3]) -> {IsSorted(new[] { 1, 2, 3 })}");
        Console.WriteLine($"IsSorted([\"b\",\"a\"]) -> {IsSorted(new[] { "b", "a" })}");
        Console.WriteLine($"Spawn<List<int>>() -> {Spawn<List<int>>().GetType().Name}");

        // A bez spełnionego constraintu wywołanie w ogóle się nie kompiluje:
        // Spawn<string>();   // CS0310: string nie ma konstruktora bezparametrowego
    }

    // Bez constraintu T jest "czymkolwiek" - CompareTo się nie skompiluje.
    // `where T : IComparable<T>` to umowa, która ODBLOKOWUJE porównanie.
    private static bool IsSorted<T>(T[] items) where T : IComparable<T>
    {
        for (var i = 1; i < items.Length; i++)
        {
            if (items[i - 1].CompareTo(items[i]) > 0) return false;
        }

        return true;
    }

    // `where T : new()` odblokowuje `new T()`.
    private static T Spawn<T>() where T : new()
    {
        return new T();
    }
}
