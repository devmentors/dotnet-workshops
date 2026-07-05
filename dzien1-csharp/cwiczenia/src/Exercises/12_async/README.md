# 12_async - Asynchroniczność (async/await, Task)

Cel sekcji: poczuć podstawowy schemat asynchroniczny .NET: `async`/`await` i
`Task<T>`, równoległe oczekiwanie przez `Task.WhenAll` oraz anulowanie przez
`CancellationToken`.

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Poranny panel** (`MorningDashboard.cs`, ~10 min): `BeansLabelAsync`
   (await), `LoadSummaryAsync` (trzy źródła równolegle + Task.WhenAll,
   test mierzy czas) i `WaitForDeliveryAsync` (CancellationToken).

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Async.MorningDashboardTests"
dotnet run --project src/Exercises -- 12
```
