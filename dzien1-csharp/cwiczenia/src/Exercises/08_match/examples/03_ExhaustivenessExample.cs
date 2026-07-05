namespace Exercises.Match.Examples;

// PRZYKŁAD (sekcja 8, slajd 43): exhaustiveness - kompilator pilnuje,
// żeby switch expression obsłużył komplet przypadków.
public static class ExhaustivenessExample
{
    public static void Run()
    {
        Console.WriteLine("== 08: exhaustiveness - kompilator pilnuje kompletu (slajd 43) ==");

        foreach (var status in Enum.GetValues<InvoiceStatus>())
            Console.WriteLine($"  {status} -> {Describe(status)}");
    }

    // CS8524 wyciszone: dotyczy tylko rzutowanych, NIEnazwanych wartości enuma.
    // Właściwe demo to CS8509: usuń poniżej dowolny case i przebuduj.
#pragma warning disable CS8524
    private static string Describe(InvoiceStatus status) => status switch
    {
        InvoiceStatus.Draft => "szkic",
        InvoiceStatus.Sent  => "wysłana",
        InvoiceStatus.Paid  => "opłacona"
        // Usuń dowolny przypadek ALBO dodaj wartość do enuma:
        // kompilator natychmiast ostrzeże CS8509 - błąd łapany w kompilacji, nie na produkcji.
    };
#pragma warning restore CS8524
}

public enum InvoiceStatus
{
    Draft,
    Sent,
    Paid
}
