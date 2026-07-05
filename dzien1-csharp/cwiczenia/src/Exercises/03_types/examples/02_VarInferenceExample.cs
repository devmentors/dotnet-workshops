namespace Exercises.Types.Examples;

// PRZYKŁAD (sekcja 3, slajd 17): var to inferencja typu, nie dynamic.
public static class VarInferenceExample
{
    public static void Run()
    {
        Console.WriteLine("== 03: var to inferencja, nie dynamic (slajd 17) ==");

        // Typ wywnioskowany w KOMPILACJI - to nadal typ statyczny.
        var name = "Ada";
        var builder = new System.Text.StringBuilder();
        Console.WriteLine($"var name -> {name.GetType().Name}, var builder -> {builder.GetType().Name}");

        // var to nie dynamic - zmiana typu się nie kompiluje:
        // name = 5;   // CS0029: Cannot implicitly convert type 'int' to 'string'
    }
}
