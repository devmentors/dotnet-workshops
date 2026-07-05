namespace Exercises.Extensions.Examples;

// PRZYKŁAD (sekcja 10, slajd 48): metoda rozszerzająca to zwykła metoda
// statyczna w wygodnym przebraniu.
public static class ExtensionMethodsExample
{
    public static void Run()
    {
        Console.WriteLine("== 10: metoda rozszerzająca to statyczna w przebraniu (slajd 48) ==");

        // Wygląda jak metoda stringa...
        Console.WriteLine("\"dzień dobry\".Shout() -> " + "dzień dobry".Shout());

        // ...ale to DOKŁADNIE to samo wywołanie, które kompilator i tak generuje:
        Console.WriteLine("StringDemos.Shout(...)  -> " + StringDemos.Shout("dzień dobry"));

        // Bonus: this string? - rozszerzenie można bezpiecznie wywołać nawet na null.
        string? missing = null;
        Console.WriteLine($"null.OrEmpty() -> \"{missing.OrEmpty()}\" (to statyczna metoda, null to tylko argument)");
    }
}

// KLASYCZNY zapis (C# 3, 2007): static class + this w pierwszym parametrze.
public static class StringDemos
{
    public static string Shout(this string text)
    {
        return text.ToUpperInvariant() + "!";
    }

    public static string OrEmpty(this string? text)
    {
        return text ?? "";
    }
}
