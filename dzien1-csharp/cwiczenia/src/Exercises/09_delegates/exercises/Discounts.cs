namespace Exercises.Delegates;

// =====================================================================
// ZADANIE (09_delegates) - Silnik rabatów aplikacji „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Aplikacja kawiarni nalicza rabaty na zamówienia. Reguła rabatu to po
//   prostu FUNKCJA: podajesz cenę, dostajesz cenę po rabacie. Skoro reguła
//   jest funkcją (Func<decimal, decimal>), można ją trzymać w zmiennej,
//   przekazać do metody, stworzyć lambdą i wybrać najlepszą. To materiał
//   tej sekcji: Func jako wartość, lambda i domknięcie (closure).
//
// ZADANIE - trzy metody w klasie Discounts:
//   1) Apply(decimal price, Func<decimal, decimal> rule): zastosuj jedną
//      regułę do ceny (wywołaj funkcję jak metodę) i zwróć wynik.
//   2) PercentOff(decimal percent): zwróć Func<decimal, decimal> (lambdę),
//      która zdejmuje z ceny `percent` procent. Lambda ma zapamiętać
//      `percent` z argumentu - to domknięcie.
//   3) BestPrice(decimal price, Func<decimal, decimal>[] rules): zastosuj
//      każdą regułę do ceny i zwróć NAJNIŻSZĄ z wyników (najlepszy deal
//      dla klienta). Gdy reguł brak, zwróć wyjściową cenę.
//
// OCZEKIWANY REZULTAT:
//   PercentOff(20) daje funkcję zdejmującą 20%: dla 100 zwraca 80.
//   BestPrice(100, [PercentOff(10), PercentOff(25), PercentOff(5)]) = 75
//   (25% off wygrywa). Reguła to zwykła wartość - stąd tablica reguł.

public static class Discounts
{
    // TODO: wywołaj regułę na cenie i zwróć wynik.
    public static decimal Apply(decimal price, Func<decimal, decimal> rule)
    {
        throw new NotImplementedException("Wywołaj regułę na cenie.");
    }

    // TODO: zwróć lambdę zdejmującą percent procent (domknięcie na percent).
    public static Func<decimal, decimal> PercentOff(decimal percent)
    {
        throw new NotImplementedException("Zwróć funkcję zdejmującą percent procent.");
    }

    // TODO: zastosuj każdą regułę, zwróć najniższą cenę.
    public static decimal BestPrice(decimal price, Func<decimal, decimal>[] rules)
    {
        throw new NotImplementedException("Zwróć najniższą cenę spośród reguł.");
    }
}
