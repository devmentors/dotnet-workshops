# 06_immutability - Niemutowalność (record)

Cel sekcji: poczuć, jak `record` kodyfikuje niemutowalność: równość przez wartość,
kopia z modyfikacją (`with`), dekonstrukcja oraz właściwości `init`-only zamrażane
po utworzeniu obiektu.

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Rezerwacja** (`Reservation.cs`, ~10 min): przerób klasę na positional
   record (równość przez wartość), `MoveTo` przez wyrażenie `with`
   i `Summary` z dekonstrukcją.

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Immutability.ReservationTests"
dotnet run --project src/Exercises -- 06
```
