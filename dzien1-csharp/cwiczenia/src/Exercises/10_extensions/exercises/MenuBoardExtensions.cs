namespace Exercises.Extensions;

// =====================================================================
// ZADANIE (10_extensions) - Tablica menu kawiarni „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Nad ladą kawiarni „Ziarno" wisi ekran z menu. Nazwy bywają za długie
//   ("Sernik baskijski z konfiturą malinową" nie mieści się na kafelku),
//   a opisy bywają puste. Tego typu poprawki chcemy wywoływać jak metody
//   samego stringa: nazwa.Shorten(12), opis.OrPlaceholder("wkrótce") -
//   mimo że string to typ wbudowany i nie możemy go edytować. Dokładnie
//   po to są metody rozszerzające; piszemy je w bloku `extension` (C# 14).
//
// ZADANIE - wypełnij dwie metody w bloku extension(string text):
//   1) Shorten(int max): tekst mieszczący się w max znakach zwróć bez
//      zmian; dłuższy obetnij do max-1 znaków i doklej "…" (wynik ma
//      dokładnie max znaków).
//   2) OrPlaceholder(string placeholder): tekst pusty lub złożony
//      z białych znaków zamień na placeholder; inny zwróć bez zmian
//      (przyda się string.IsNullOrWhiteSpace).
//
// OCZEKIWANY REZULTAT:
//   "Sernik baskijski z konfiturą malinową".Shorten(12) daje "Sernik bask…",
//   a "".OrPlaceholder("wkrótce") daje "wkrótce" - wywołania wyglądają jak
//   metody stringa, choć string nie ma o nich pojęcia.

public static class MenuBoardExtensions
{
    extension(string text)
    {
        // TODO: za długi tekst obetnij przez text.Substring(0, max - 1) i doklej "…".
        public string Shorten(int max)
        {
            throw new NotImplementedException("Za długi tekst obetnij i doklej \"…\".");
        }

        // TODO: pusty/białe znaki -> placeholder.
        public string OrPlaceholder(string placeholder)
        {
            throw new NotImplementedException("Użyj string.IsNullOrWhiteSpace.");
        }
    }
}
