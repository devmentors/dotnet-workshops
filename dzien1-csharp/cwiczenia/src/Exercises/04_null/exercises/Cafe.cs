namespace Exercises.Null;

// =====================================================================
// ZADANIE (04_null) - Karta stałego klienta kawiarni „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Kawiarnia „Ziarno" prowadzi karty stałego klienta: za każdą kawę
//   pieczątka, za komplet - nagroda. Dane bywają niekompletne: klient
//   z ulicy nie ma karty (Card jest null), a karta może nie mieć wpisanego
//   imienia (OwnerName jest null). Kod musi to przeżyć bez
//   NullReferenceException - do tego służą operatory ?. ?? i ??= z tej sekcji.
//
// ZADANIE - zaimplementuj trzy metody w klasie Cafe:
//   1) OwnerLabel(Order? order): zwróć imię właściciela karty
//      (order -> Card -> OwnerName). Jeśli czegokolwiek po drodze brakuje,
//      zwróć "gość". Użyj łańcucha ?. i domknij go przez ??.
//   2) EnsureOwner(LoyaltyCard card): jeśli karta nie ma imienia, wpisz
//      "gość"; wpisane imię zostaw bez zmian. Użyj ??=.
//   3) ClaimReward(LoyaltyCard card): wyczyść kartę po odebraniu nagrody -
//      ustaw wszystkie właściwości literałem `default`, bez wpisywania
//      0 / false / null z palca.
//
// OCZEKIWANY REZULTAT:
//   Aplikacja nie wybucha na brakujących danych: zamówienie bez karty daje
//   "gość", karta bez imienia dostaje je przed wydrukiem, a po nagrodzie
//   pieczątki wracają do 0, flaga do false, imię do null.

public sealed class LoyaltyCard
{
    public string? OwnerName { get; set; }
    public int Stamps { get; set; }
    public bool RewardReady { get; set; }
}

public sealed class Order
{
    public LoyaltyCard? Card { get; init; }
}

public static class Cafe
{
    // TODO: łańcuch ?. (order -> Card -> OwnerName) domknięty przez ?? "gość".
    public static string OwnerLabel(Order? order)
    {
        throw new NotImplementedException("Zejdź łańcuchem ?. i domknij przez ??.");
    }

    // TODO: uzupełnij brakujące imię przez ??= (wpisane zostaje).
    public static void EnsureOwner(LoyaltyCard card)
    {
        throw new NotImplementedException("Użyj ??= - przypisze tylko przy null.");
    }

    // TODO: przywróć właściwości karty literałem `default`.
    public static void ClaimReward(LoyaltyCard card)
    {
        throw new NotImplementedException("Ustaw właściwości literałem `default`.");
    }
}
