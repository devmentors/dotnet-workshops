using Exercises.ExternalLib;

namespace Exercises.Encapsulation.Examples;

// PRZYKŁAD (sekcja 5, slajd 30): modyfikatory dostępności PRZEZ GRANICĘ ASSEMBLY.
// WidgetBase żyje w INNYM assembly (src/Exercises.ExternalLib) - to nie dekoracja,
// tylko warunek konieczny tego demo.
public static class AccessModifiersExample
{
    public static void Run()
    {
        Console.WriteLine("== 05: modyfikatory dostępności PRZEZ GRANICĘ ASSEMBLY (slajd 30) ==");

        new Widget().Show();

        // A poza klasą pochodną protected internal działa już "zwyczajnie":
        var widget = new Widget();
        Console.WriteLine(widget.Describe());
        // Console.WriteLine(widget.ProtectedInternal()); // CS1540: spoza pochodnej, inny assembly - brak dostępu
    }
}

public class Widget : WidgetBase
{
    public void Show()
    {
        Console.WriteLine(Describe());
        Console.WriteLine(ProtectedOnly());

        // Sedno: protected internal to SUMA (OR). Jesteśmy w INNYM assembly,
        // ale klasa POCHODNA wystarczy - wbrew intuicji większości.
        Console.WriteLine(ProtectedInternal());

        // Iloczyn (AND) już nie przepuszcza - pochodna, ale złe assembly:
        // Console.WriteLine(PrivateProtected()); // CS0122: niedostępne
        // Console.WriteLine(InternalOnly());     // CS0122: internal = tylko tamten assembly
    }
}
