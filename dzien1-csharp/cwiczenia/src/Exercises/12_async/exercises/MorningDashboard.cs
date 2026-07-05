namespace Exercises.Async;

// =====================================================================
// ZADANIE (12_async) - Poranny panel kawiarni „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Rano, przed otwarciem, aplikacja kawiarni „Ziarno" pobiera dane
//   z trzech miejsc: stan ziaren z magazynu, cenę mleka od dostawcy
//   i ocenę z portalu z opiniami. Każde źródło chwilę odpowiada
//   (symulują to metody Fetch* z Task.Delay). Czekanie po kolei marnuje
//   czas - źródła są niezależne, więc mają odpowiadać RÓWNOLEGLE.
//   A na spóźnionego dostawcę musi być bezpiecznik: anulowanie.
//
// ZADANIE - zaimplementuj trzy metody:
//   1) BeansLabelAsync(): pobierz stan ziaren (await FetchBeansKgAsync)
//      i zwróć tekst "Ziarna: 12 kg".
//   2) LoadSummaryAsync(): uruchom WSZYSTKIE trzy źródła naraz (najpierw
//      wywołania, potem Task.WhenAll), a z wyników złóż tekst
//      "Ziarna: 12 kg | Mleko: 3.20 zł | Ocena: 4.8".
//   3) WaitForDeliveryAsync(CancellationToken token): czekaj na dostawę
//      (Task.Delay(5000, token)) - przekazany token ma umieć przerwać
//      czekanie.
//
// OCZEKIWANY REZULTAT:
//   LoadSummaryAsync kończy się w czasie NAJWOLNIEJSZEGO źródła, nie sumy
//   wszystkich (test mierzy czas), a anulowanie tokenu przerywa
//   WaitForDeliveryAsync wyjątkiem OperationCanceledException.

public class MorningDashboard
{
    // Symulowane źródła danych (dane, nie zmieniaj).
    public async Task<int> FetchBeansKgAsync()
    {
        await Task.Delay(50);
        return 12;
    }

    public async Task<string> FetchMilkPriceAsync()
    {
        await Task.Delay(50);
        return "3.20";
    }

    public async Task<string> FetchRatingAsync()
    {
        await Task.Delay(50);
        return "4.8";
    }

    // TODO: await pojedynczego źródła + interpolacja.
    public async Task<string> BeansLabelAsync()
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Pobierz stan ziaren i złóż etykietę.");
    }

    // TODO: trzy wywołania naraz, Task.WhenAll, złóż wynik.
    public async Task<string> LoadSummaryAsync()
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Źródła mają odpowiadać równolegle.");
    }

    // TODO: Task.Delay z przekazanym tokenem.
    public async Task WaitForDeliveryAsync(CancellationToken token)
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Czekaj z możliwością anulowania.");
    }
}
