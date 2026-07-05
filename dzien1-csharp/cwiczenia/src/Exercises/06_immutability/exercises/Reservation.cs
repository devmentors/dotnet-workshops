namespace Exercises.Immutability;

// =====================================================================
// ZADANIE (06_immutability) - Rezerwacje stolików w kawiarni „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Kawiarnia „Ziarno" przyjmuje rezerwacje stolików na wieczory
//   z planszówkami. Rezerwacja to czyste dane: gość, stolik, liczba osób.
//   Dziś to zwykła mutowalna klasa i przez to dwie identyczne rezerwacje
//   są dla programu „różne", a zmiana stolika grzebie w istniejącym
//   obiekcie. Materiał tej sekcji: record daje równość przez wartość,
//   a `with` - kopię z modyfikacją zamiast mutacji.
//
// ZADANIE:
//   1) Przerób klasę Reservation na positional record:
//      public record Reservation(string Guest, string Table, int Seats);
//      Równość przez wartość i ToString dostaniesz za darmo.
//   2) Zaimplementuj MoveTo(string newTable): zwróć KOPIĘ rezerwacji
//      z nowym stolikiem (wyrażenie `with`); oryginał ma zostać bez zmian.
//   3) Zaimplementuj Summary(): zdekonstruuj record do trzech zmiennych
//      (var (guest, table, seats) = this;) i zwróć tekst
//      "Darek - stolik W2, 4 os.".
//
// OCZEKIWANY REZULTAT:
//   Dwie rezerwacje z tymi samymi danymi są równe (==), przeniesienie na
//   inny stolik tworzy nową rezerwację i nie zmienia starej, a Summary
//   składa czytelny opis z rozpakowanych pól.

public class Reservation
{
    public string Guest { get; set; }
    public string Table { get; set; }
    public int Seats { get; set; }

    public Reservation(string guest, string table, int seats)
    {
        Guest = guest;
        Table = table;
        Seats = seats;
    }

    // TODO: kopia z modyfikacją przez `with` (po zamianie na record).
    public Reservation MoveTo(string newTable)
    {
        throw new NotImplementedException("Zwróć kopię rezerwacji z nowym stolikiem (with).");
    }

    // TODO: zdekonstruuj record i złóż opis.
    public string Summary()
    {
        throw new NotImplementedException("Zdekonstruuj rezerwację i zwróć opis.");
    }
}
