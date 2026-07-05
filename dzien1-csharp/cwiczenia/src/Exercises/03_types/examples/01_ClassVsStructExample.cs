namespace Exercises.Types.Examples;

// PRZYKŁAD (sekcja 3, slajd 16): class vs struct - co stanie się z a?
public static class ClassVsStructExample
{
    public static void Run()
    {
        Console.WriteLine("== 03: class vs struct - co stanie się z a? (slajd 16) ==");

        // class: b = a kopiuje REFERENCJĘ - dwie zmienne, jeden obiekt na stercie.
        var a = new PointClass();
        a.X = 1;
        var b = a;
        b.X = 99;
        Console.WriteLine($"class:  a.X = {a.X}   (b to ten sam obiekt)");

        // struct: d = c kopiuje CAŁĄ WARTOŚĆ - dwie niezależne kopie.
        var c = new PointStruct();
        c.X = 1;
        var d = c;
        d.X = 99;
        Console.WriteLine($"struct: c.X = {c.X}    (d to osobna kopia)");

        // To samo dotyczy przekazania do metody: struct wchodzi jako kopia.
        Mutate(a);
        var e = new PointStruct();
        e.X = 1;
        Mutate(e);
        Console.WriteLine($"po metodzie: class a.X = {a.X}, struct e.X = {e.X}");
    }

    private static void Mutate(PointClass point)
    {
        point.X = -1;
    }

    private static void Mutate(PointStruct point)
    {
        point.X = -1;
    }
}

// Dwa "takie same" typy - różni je tylko class vs struct. O to chodzi w demie.
public class PointClass
{
    public int X;
}

public struct PointStruct
{
    public int X;
}
