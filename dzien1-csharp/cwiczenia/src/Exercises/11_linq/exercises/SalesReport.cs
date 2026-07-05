namespace Exercises.Linq;

// =====================================================================
// ZADANIE (11_linq) - Raport dnia aplikacji „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Koniec dnia w kawiarni. Kasa oddaje listę pozycji sprzedaży (produkt,
//   cena, ilość), a właścicielka chce raport bestsellerów: tylko to, co
//   faktycznie się sprzedało, od największego utargu, w postaci gotowej do
//   pokazania. Zamiast pętli z listami pomocniczymi składasz to jednym
//   łańcuchem LINQ: filtr, sortowanie i przepisanie na osobną klasę wyniku.
//
// ZADANIE - zaimplementuj BestSellers(lines) jednym łańcuchem LINQ:
//   1) Where  - zostaw tylko pozycje faktycznie sprzedane (Quantity > 0).
//   2) OrderByDescending - posortuj po utargu (Price * Quantity) malejąco.
//   3) Select - przepisz każdą pozycję na gotowe DTO ProductSummary
//      (nazwa produktu + policzony utarg).
//
// OCZEKIWANY REZULTAT:
//   Dla przykładowego dnia raport pomija pozycje niesprzedane, ustawia
//   bestsellery od najwyższego utargu i oddaje listę ProductSummary
//   z policzonym utargiem - gotową do wyświetlenia.

// Pozycja sprzedaży z kasy (dane wejściowe, nie zmieniaj).
public record OrderLine(string Product, decimal Price, int Quantity);

// Gotowe DTO wyniku - to na nie przepisujesz pozycje w Select (nie zmieniaj).
public record ProductSummary(string Product, decimal Revenue);

public static class SalesReport
{
    // TODO: Where (Quantity > 0) -> OrderByDescending (Price * Quantity) -> Select (ProductSummary).
    public static IEnumerable<ProductSummary> BestSellers(IEnumerable<OrderLine> lines)
    {
        throw new NotImplementedException("Złóż łańcuch Where -> OrderByDescending -> Select.");
    }
}
