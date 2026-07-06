using System.ComponentModel;

// [Description] czyta model — po tym wie, kiedy wywołać funkcję.
internal static class SupportTools
{
    [Description("Zwraca status ticketa o podanym identyfikatorze.")]
    public static string GetTicketStatus(
        [Description("Identyfikator ticketa, np. T-100")] string ticketId) =>
        new Dictionary<string, string>
        {
            ["T-100"] = "W toku (przypisany do agentki Anna Nowak)",
            ["T-101"] = "Oczekuje na klienta (sprawa rozliczeniowa)",
            ["T-102"] = "Zamknięty",
        }.GetValueOrDefault(ticketId, "Nie znaleziono ticketa o takim identyfikatorze.");

    [Description("Zwraca stan rozliczenia/faktury powiązanej z ticketem.")]
    public static string GetInvoiceStatus(
        [Description("Identyfikator ticketa, np. T-101")] string ticketId) =>
        new Dictionary<string, string>
        {
            ["T-101"] = "Faktura FV/2026/07/017 wystawiona, nieopłacona (termin 2026-07-20).",
        }.GetValueOrDefault(ticketId, "Brak powiązanej faktury dla tego ticketa.");
}
