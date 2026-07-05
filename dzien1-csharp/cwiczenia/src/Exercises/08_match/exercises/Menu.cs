namespace Exercises.Match;

// =====================================================================
// ZADANIE (08_match) - Cennik napojów kawiarni „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Kasa kawiarni „Ziarno" musi wycenić napój. Napoje to mała hierarchia
//   typów: espresso (liczba shotów), latte (rozmiar w ml) i herbata
//   (ziołowa albo nie). Zamiast drabinki if-ów z rzutowaniem piszesz
//   JEDNO wyrażenie switch, które rozpoznaje typ i właściwości naraz -
//   to materiał tej sekcji: type pattern, property pattern, wzorce
//   relacyjne i odrzutnik `_`.
//
// ZADANIE:
//   1) Zaimplementuj Price(Drink drink) jako WYRAŻENIE switch z regułami:
//      - Espresso z co najmniej 2 shotami -> 12
//      - Espresso                          -> 9
//      - Latte od 400 ml w górę            -> 16
//      - Latte                             -> 13
//      - Tea                               -> 8
//      - cokolwiek innego (`_`)            -> rzuć ArgumentException
//   2) Zaimplementuj HasCaffeine(Drink drink) jednym wyrażeniem `is`:
//      kofeinę ma wszystko POZA herbatą ziołową (wzorzec `not` +
//      property pattern).
//
// OCZEKIWANY REZULTAT:
//   Podwójne espresso kosztuje 12, latte 450 ml - 16, herbata - 8,
//   a nieznany napój kończy się wyjątkiem. HasCaffeine zwraca false
//   tylko dla ziołowej herbaty.

// Hierarchia napojów (dane, nie zmieniaj).
public abstract class Drink;

public sealed class Espresso : Drink
{
    public int Shots { get; init; } = 1;
}

public sealed class Latte : Drink
{
    public int SizeMl { get; init; } = 300;
}

public sealed class Tea : Drink
{
    public bool Herbal { get; init; }
}

public static class Menu
{
    // TODO: wyrażenie switch (type + property + wzorce relacyjne + _).
    public static decimal Price(Drink drink)
    {
        throw new NotImplementedException("Wyceń napój jednym wyrażeniem switch.");
    }

    // TODO: jedno wyrażenie `is` z wzorcem not + property pattern.
    public static bool HasCaffeine(Drink drink)
    {
        throw new NotImplementedException("Kofeina: wszystko poza ziołową herbatą.");
    }
}
