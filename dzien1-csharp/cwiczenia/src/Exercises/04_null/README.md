# 04_null - null i wartości domyślne

Cel sekcji: ogarnąć, skąd bierze się `null`, czemu tylko typy referencyjne grożą
`NullReferenceException`, oraz jak bezpiecznie czytać dane operatorami `?.`, `??`, `??=`.

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Karta lojalnościowa** (`Cafe.cs`, ~10 min): łańcuch `?.` domknięty `??`
   (`OwnerLabel`), leniwe uzupełnienie imienia `??=` (`EnsureOwner`)
   i reset karty literałem `default` (`ClaimReward`).

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Null.CafeTests"
dotnet run --project src/Exercises -- 04
```
