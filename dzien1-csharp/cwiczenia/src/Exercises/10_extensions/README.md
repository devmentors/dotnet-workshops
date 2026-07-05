# 10_extensions - Metody i właściwości rozszerzające

Cel sekcji: dopisać zachowanie do istniejącego typu bez jego modyfikacji.
Metoda rozszerzająca (`static` + `this`), rozszerzenie na `IEnumerable<T>` (na czym
stoi LINQ) oraz blok `extension` z C# 14 (właściwość rozszerzająca).

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Tablica menu** (`MenuBoardExtensions.cs`, ~10 min): blok
   `extension(string text)` (C# 14) z `Shorten` (obcięcie przez
   `Substring` + „…") i `OrPlaceholder` (zamiennik pustych opisów).

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Extensions.MenuBoardExtensionsTests"
dotnet run --project src/Exercises -- 10
```
