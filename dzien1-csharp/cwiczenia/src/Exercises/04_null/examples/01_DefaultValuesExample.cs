namespace Exercises.Null.Examples;

// PRZYKŁAD (sekcja 4, slajd 21): wartości domyślne - "pusto = 0" vs "pusto = null".
public static class DefaultValuesExample
{
    public static void Run()
    {
        Console.WriteLine("== 04: wartości domyślne (slajd 21) ==");

        // Typy proste (value types): "pusto" to 0/false - nigdy null.
        int number = default;
        bool flag = default;
        DateTime date = default;   // DateTime to też value type - defaultem jest 01.01.0001
        // Typy referencyjne: "pusto" to null - i tylko one ryzykują NullReferenceException.
        string? text = default;
        Console.WriteLine($"int: {number}, bool: {flag}, DateTime: {date:d}, string: {text ?? "null"}");
    }
}
