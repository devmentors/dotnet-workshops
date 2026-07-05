# 08_match

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Cennik** (`Menu.cs`, ~10 min): `Price` jako jedno wyrażenie switch
   (type + property + wzorce relacyjne + `_`) i `HasCaffeine` jako
   wyrażenie `is` z wzorcem `not`.

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Match.MenuTests"
dotnet run --project src/Exercises -- 08
```
