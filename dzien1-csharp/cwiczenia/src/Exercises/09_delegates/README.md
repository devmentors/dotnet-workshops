# 09_delegates - Delegaty, Func/Action, lambdy

Cel sekcji: zobaczyć delegat jako typowaną referencję do metody, którą można
przekazywać jak każdą inną wartość. Po drodze `Func`/`Action`, lambdy z target
typingiem i kompozycja funkcji.

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Silnik rabatów** (`Discounts.cs`, ~10 min): reguła rabatu jako
   `Func<decimal,decimal>` - `Apply` (wywołanie), `PercentOff` (lambda
   z domknięciem) i `BestPrice` (tablica reguł, najniższa cena).

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Delegates.DiscountsTests"
dotnet run --project src/Exercises -- 09
```
