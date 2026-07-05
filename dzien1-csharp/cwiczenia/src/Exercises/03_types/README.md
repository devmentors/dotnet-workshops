# 03_types - System typów (fundament)

Cel sekcji: poczuć fundament systemu typów C# i **polimorfizm statyczny**
(rozstrzygany przez kompilator po typie - przeciążenie metody i operatora).
Różnica typ wartościowy vs referencyjny (semantyka kopiowania) jest pokazana
**na żywo w demo**, nie jako zadanie - lepiej ją zobaczyć niż „implementować".
Uwaga: `record` i równość przez wartość są dopiero w sekcji 6 (Niemutowalność) -
tu ich nie używamy.

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Kasa** (`CashRegister.cs`, ~10 min): zadeklaruj od zera operator `+`
   (Money + Money, różne waluty -> wyjątek), operator `*` (Money * int)
   i dwa przeciążenia `Scan` w kasie. Polimorfizm statyczny w praktyce.

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Types.CashRegisterTests"
dotnet run --project src/Exercises -- 03
```
