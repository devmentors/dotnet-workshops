# 11_linq - LINQ (deferred execution, operatory, iterator)

Cel sekcji: wyrazić przekształcenia danych przez łańcuch operatorów zamiast pętli,
przepisywać pozycje na osobne DTO (Select) i zrozumieć leniwą naturę LINQ
(deferred execution). Iterator `yield return` pokazujemy w demo (Playground).

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Raport dnia** (`SalesReport.cs`, ~10 min): `BestSellers` jednym
   łańcuchem `Where` -> `OrderByDescending` -> `Select` przepisującym
   pozycje na gotowe DTO `ProductSummary`.

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Linq.SalesReportTests"
dotnet run --project src/Exercises -- 11
```
