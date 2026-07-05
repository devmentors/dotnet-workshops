namespace Exercises.ExternalLib;

// Ten typ ŻYJE W INNYM ASSEMBLY niż reszta przykładów - właśnie po to,
// żeby modyfikatory dostępności pokazać przez realną granicę assembly.
// Kto może wywołać którą metodę - patrz 05_encapsulation/Examples.cs.
public class WidgetBase
{
    // public: dostępne wszędzie, także z innych assembly.
    public string Describe() => "public: widzi mnie każdy";

    // internal: TYLKO ten sam assembly (Exercises.ExternalLib).
    internal string InternalOnly() => "internal: tylko moje assembly";

    // protected: tylko typy pochodne (dowolny assembly).
    protected string ProtectedOnly() => "protected: tylko klasy pochodne";

    // protected internal = SUMA (OR): ten sam assembly LUB typ pochodny.
    // Zaskoczenie: klasa pochodna W INNYM assembly ma dostęp.
    protected internal string ProtectedInternal() => "protected internal: pochodna z INNEGO assembly też może";

    // private protected = ILOCZYN (AND): typ pochodny, ale tylko w TYM assembly.
    // Klasa pochodna w innym assembly NIE ma dostępu.
    private protected string PrivateProtected() => "private protected: pochodna, ale tylko u mnie";
}
