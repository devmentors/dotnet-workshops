# Dzień 1 — Idiomatyczny C# (zadania RED → GREEN)

Zadania do Dnia 1 szkolenia „Idiomatyczny C#”. Stack: **.NET 10 / C# 14**, **xUnit**.

Każdy temat domykany jest zadaniem w formacie **RED → GREEN**: startujesz z czerwonymi
testami, uzupełniasz lukę w kodzie w `src/Exercises/<sekcja>/exercises/`, aż testy są zielone.

## Model ćwiczeń
- Foldery numerowane **wg numeru sekcji decku** (np. `03_types` = SEKCJA 3 slajdów,
  `08_match` = SEKCJA 8). Numer folderu = numer sekcji na slajdzie.
- Testy: **xUnit + natywne `Assert.*`** (bez FluentAssertions).
- Każdy temat ma dwa podfoldery: `examples/` (działające przykłady 1:1 ze slajdami,
  jedna klasa = jeden przykład) i `exercises/` (stuby zadań RED -> GREEN).
- Każde zadanie to mały stub z opisem po polsku (`CEL` / `ZADANIE`).
  Kod po angielsku, komentarze po polsku. Stan startowy = RED.
- Przykłady sekcji odpalasz przez `dotnet run --project src/Exercises -- 0X`.
- Wskazówki naprowadzające (osobno od stubów) zebrane są w `HINTS.md` -
  jedna sekcja na zadanie, z filtrem testu w nagłówku.

## Struktura
```
cwiczenia/
├── Dzien1.sln
├── global.json
├── HINTS.md                      # wskazówki do każdego zadania (filtr testu w nagłówku)
├── src/Exercises.ExternalLib/    # OSOBNE assembly - demo modyfikatorów dostępności (sekcja 5)
├── src/Exercises/                # aplikacja konsolowa (Exe) + kod zadań
│   ├── Program.cs                # dispatcher przykładów: -- 03..12
│   │                             # każdy temat: examples/ (pokazy) + exercises/ (stuby) + README.md
│   ├── 03_types/         examples/ ClassVsStruct, VarInference, StaticPolymorphism · exercises/ CashRegister
│   ├── 04_null/          examples/ DefaultValues, NullOperators, NullableReferenceTypes · exercises/ Cafe
│   ├── 05_encapsulation/ examples/ FieldVsProperty, AccessModifiers, PrimaryConstructor · exercises/ PrepaidCard
│   ├── 06_immutability/  examples/ RecordVsClass, WithExpression, Deconstruction · exercises/ Reservation
│   ├── 07_generics/      examples/ GenericMethods, ReifiedGenerics, GenericTypes, Constraints · exercises/ Repository
│   ├── 08_match/         examples/ SwitchExpression, PatternTypes, Exhaustiveness · exercises/ Menu
│   ├── 09_delegates/     examples/ TargetTyping, FuncVsExpression · exercises/ Discounts
│   ├── 10_extensions/    examples/ ExtensionMethods, ExtensionMembers · exercises/ MenuBoardExtensions
│   ├── 11_linq/          examples/ DeferredExecution, YieldReturn, MultipleEnumeration, OperatorChain · exercises/ SalesReport
│   └── 12_async/         examples/ ThreadHopping, WhenAll, AsyncWithoutAwait, Cancellation · exercises/ MorningDashboard
└── tests/Exercises.Tests/        # testy xUnit
    ├── 03_types/          CashRegisterTests
    ├── 04_null/          CafeTests
    ├── 05_encapsulation/  PrepaidCardTests
    ├── 06_immutability/  ReservationTests
    ├── 07_generics/      RepositoryTests
    ├── 08_match/         MenuTests
    ├── 09_delegates/     DiscountsTests
    ├── 10_extensions/  MenuBoardExtensionsTests
    ├── 11_linq/          SalesReportTests
    └── 12_async/         MorningDashboardTests
```

## Tematy
| Folder            | Sekcja | Temat            | Sedno zadań                                                  |
|-------------------|--------|------------------|--------------------------------------------------------------|
| `03_types`         | 3      | System typów     | polimorfizm statyczny: przeciążenie operatora i przeciążenie metody |
| `04_null`         | 4      | null i defaulty  | wartości domyślne (`default`), `?.` / `??` / `??=`, łańcuch nawigacji |
| `05_encapsulation` | 5      | Hermetyzacja     | właściwość z walidacją, private set + inwariant, `field`, computed |
| `06_immutability` | 6      | Niemutowalność   | `record` (value equality, `with`), dekonstrukcja, `init`-only |
| `07_generics`      | 7      | Generyki         | metoda generyczna + inference, typ generyczny, constraint `where T` |
| `08_match`        | 8      | Pattern matching | switch expression po wadze, type + property pattern, `is` z przypisaniem |
| `09_delegates`    | 9      | Delegaty         | `Func`/`Action`, własny delegat + lambda, kompozycja funkcji |
| `10_extensions` | 10     | Rozszerzenia     | metoda rozszerzająca, rozszerzenie na `IEnumerable`, blok `extension` (C# 14) |
| `11_linq`         | 11     | LINQ             | łańcuch Where/OrderBy, projekcja `Select` do DTO, deferred execution |
| `12_async`        | 12     | Asynchroniczność | `async`/`await`/`Task`, `Task.WhenAll`, `CancellationToken` |

## Jak uruchomić
Wszystkie testy:
```bash
dotnet test
```
Jedna sekcja (filtr po przestrzeni nazw):
```bash
dotnet test --filter "FullyQualifiedName~Tests.Types"          # 03_types
dotnet test --filter "FullyQualifiedName~Tests.Null"          # 04_null
dotnet test --filter "FullyQualifiedName~Tests.Encapsulation"  # 05_encapsulation
dotnet test --filter "FullyQualifiedName~Tests.Immutability"  # 06_immutability
dotnet test --filter "FullyQualifiedName~Tests.Generics"       # 07_generics
dotnet test --filter "FullyQualifiedName~Tests.Match"         # 08_match
dotnet test --filter "FullyQualifiedName~Tests.Delegates"     # 09_delegates
dotnet test --filter "FullyQualifiedName~Tests.Extensions"    # 10_extensions
dotnet test --filter "FullyQualifiedName~Tests.Linq"          # 11_linq
dotnet test --filter "FullyQualifiedName~Tests.Async"         # 12_async
```
Przykłady na żywo (examples danej sekcji):
```bash
dotnet run --project src/Exercises -- 03   # System typów
dotnet run --project src/Exercises -- 04   # null i wartości domyślne
dotnet run --project src/Exercises -- 05   # Hermetyzacja
dotnet run --project src/Exercises -- 06   # Niemutowalność (record)
dotnet run --project src/Exercises -- 07   # Generyki
dotnet run --project src/Exercises -- 08   # Pattern matching
dotnet run --project src/Exercises -- 09   # Delegaty, Func/Action
dotnet run --project src/Exercises -- 10   # Metody rozszerzające
dotnet run --project src/Exercises -- 11   # LINQ
dotnet run --project src/Exercises -- 12   # Asynchroniczność
```

## Stan początkowy
Po `dotnet test` sekcje są czerwone (stuby rzucają `NotImplementedException` lub nie
pilnują inwariantu) — to oczekiwane. Zadaniem jest doprowadzić każdą do GREEN.
Szczegóły i „dopisek dla szybkich” w `README.md` każdego folderu zadania.
