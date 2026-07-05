# 05_encapsulation - Hermetyzacja

Cel sekcji: różnica między surowym polem a właściwością jako punktem kontroli;
pilnowanie inwariantów przez właściwości (`set` z walidacją, get-only / private set)
i metody. Po drodze słowo kluczowe `field` (C# 14).

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Karta prepaid** (`PrepaidCard.cs`, ~10 min): właściwość `Owner`
   z walidacją w set (magazyn w `field`, C# 14), `Balance` z prywatnym set
   oraz `TopUp`/`Pay` pilnujące inwariantów (bez ujemnych kwot i debetu).

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Encapsulation.PrepaidCardTests"
dotnet run --project src/Exercises -- 05
```
