# Dzień 3 — Narzędzia i developer experience (ćwiczenia)

Stack: **.NET 10 / C# 14**, **xUnit** (natywne `Assert.*`). Solucja: `Dzien3.sln`.
Wspólny subject to sklep `src/Shop` — odchudzone lustro aplikacji z Dnia 2, z celowo
zasianymi defektami, które wykrywasz narzędziami.

**Szczegółowe instrukcje każdego ćwiczenia — w aplikacji warsztatowej.** Ten plik to mapa i
komendy.

## Model

Dzień 2 był test-first (dostawałeś czerwone testy). Dzień 3 jest **empiryczny**: dowodem jest
to, co widzisz w narzędziu — debugger, profiler, IL, log, flame graph, diff gcdump, `.nupkg`.
W sekcji `05_TESTY` odwracamy Dzień 2: **testy piszesz sam**.

Dwa typy ćwiczeń:
- **tool-driven** — robisz coś w terminalu / debuggerze / profilerze i obserwujesz wynik.
- **test-backed RED → GREEN** — startujesz z czerwonym testem, poprawiasz kod, zieleń to dowód.

## Mapa

| Katalog | Temat | Typ |
|---|---|---|
| `00_RECAP` | recap flow Dnia 2: middleware → `CorrelationAccessor` (Scoped) → `AuditService` (DI) → EF Core | RED → GREEN |
| `01_CLI` | pętla developera + brakująca `ProjectReference` (projekt **poza** `Dzien3.sln`) | kompilacja RED → GREEN |
| `02_IL` | co kompilator dopisuje (record vs class, domknięcie) — SharpLab / ILSpy / IL Viewer | tool-driven |
| `03_DEBUG` | zła kwota faktury — breakpoint + **F11 w cudzą `.dll` bez źródeł** (dekompilacja) | RED → GREEN + obserwacja |
| `04_DIAG` | wolny `/orders-report` (N+1 po HTTP, bramka czasu) + pomiar: `dotnet-trace` / `gcdump` / benchmark | RED → GREEN + narzędzie |
| `05_TESTY` | sam piszesz: `[Theory]`, mock (NSubstitute), WAF, wyścig na Singletonie, cache Redis (Testcontainers) | RED → GREEN |
| `06_NUGET` | multi-targeting + `dotnet pack` + konsumpcja z lokalnego feedu | build + RED → GREEN |

## Jak uruchomić

```bash
# narzędzia diagnostyczne (raz na maszynę; w .NET 10 też przez `dnx` bez instalacji)
dotnet tool install -g dotnet-trace
dotnet tool install -g dotnet-gcdump
dotnet tool install -g dotnet-counters

dotnet test                              # część testów CELOWO czerwona = lista zadań; wzorce w examples/ zielone
dotnet run --project src/Shop            # host; GET /orders-report jest wolny (N+1), GET /invoice?net=199.99&quantity=100 = defekt hurtu

# 04_DIAG — profiler CPU (NAJPIERW build, traceuj .dll, NIE „dotnet run" → inaczej pusty speedscope)
dotnet build src/TraceDemo -c Release
dotnet-trace collect --format Speedscope -- dotnet src/TraceDemo/bin/Release/net10.0/TraceDemo.dll

dotnet run --project src/LeakDemo                 # 04_DIAG — wyciek: 2× gcdump + diff / counters
dotnet run --project src/Benchmarks -c Release    # 04_DIAG — BenchmarkDotNet (KONIECZNIE Release)
dotnet pack src/Packable -c Release -o ./local-feed   # 06_NUGET — własna paczka .nupkg
```

`01_CLI` jest poza solucją — uruchamiasz z jego katalogu (`src/01_cli`, patrz `README-cwiczenie.md`).

### Logowanie (pod N+1 w `04_DIAG`)

W `src/Shop/appsettings.json` domyślnie `Default` i `Shop.Loyalty` są na `Warning` (cicho),
`Microsoft.EntityFrameworkCore.Database.Command` na `Information` (widać SQL). Żeby namierzyć
N+1, **sam podnieś `Shop.Loyalty` na `Information`** — w logu zobaczysz N wychodzących żądań w
pętli (po fixie jedno wsadowe).

## Docker

Domyślny `dotnet test` **nie wymaga Dockera** — poziom integracyjny to `WebApplicationFactory`
(host w pamięci, środowisko `"Testing"` → SQLite `:memory:`). Testy na realnej infrastrukturze
przez **Testcontainers** (`05_TESTY/testcontainers`: Postgres, Redis) **wymagają uruchomionego
Dockera** — bez niego padają (Redis: stub jest `[Fact(Skip)]` do zdjęcia).

## Struktura

```
cwiczenia/
├── Dzien3.sln, global.json           # .NET 10
├── libs/Contoso.Legacy.dll           # 03_DEBUG — obca biblioteka BEZ źródeł/PDB (wymusza dekompilację)
├── src/
│   ├── Shop/                         # subject: sklep (lustro Dnia 2)
│   │   ├── Correlation/CorrelationAccessor.cs   # 00_RECAP — Scoped, GOTOWY
│   │   ├── Middleware/CorrelationMiddleware.cs  # 00_RECAP — pusty szkielet (student wypełnia)
│   │   ├── Audit/AuditService.cs                # 00_RECAP — stub (student implementuje)
│   │   ├── Loyalty/RedisPointsCache.cs          # 05_TESTY — stub cache-aside (Redis)
│   │   ├── Pricing/InvoiceRounding.cs           # 03_DEBUG — zasiany defekt hurtu
│   │   ├── Counter/VisitCounter.cs              # 05_TESTY — niesynchronizowany Singleton (wyścig)
│   │   └── Program.cs                           # host + endpointy (POST /audit = stub 501)
│   ├── 01_cli/                       # POZA Dzien3.sln — uruchamiasz osobno
│   ├── 02_il/IlDemo/                 # demo record vs class + domknięcie
│   ├── TraceDemo/, LeakDemo/, Benchmarks/       # 04_DIAG
│   ├── Packable/, 06_nuget/Consumer/            # 06_NUGET
│   └── ThreadSafeDemo/               # demo thread-safe (ConcurrentDictionary + Interlocked)
├── .vscode/                          # launch.json (F11 w cudzy kod — 03_DEBUG)
└── tests/Exercises.Tests/            # examples/ = wzorce GREEN; stubs/ = RED do napisania
```
