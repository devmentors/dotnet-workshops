namespace Exercises.Generics.Examples;

// PRZYKŁAD (sekcja 7, slajd 38): parametr typu na KLASIE obowiązuje
// w polach, właściwościach i metodach.
public static class GenericTypesExample
{
    public static void Run()
    {
        Console.WriteLine("== 07: typ generyczny (slajd 38) ==");

        var pair = new Pair<string>("lewy", "prawy").Swap();
        Console.WriteLine($"Pair<string>.Swap() -> ({pair.First}, {pair.Second})");
    }
}

public class Pair<T>
{
    public T First { get; }
    public T Second { get; }

    public Pair(T first, T second)
    {
        First = first;
        Second = second;
    }

    public Pair<T> Swap()
    {
        return new Pair<T>(Second, First);
    }
}
