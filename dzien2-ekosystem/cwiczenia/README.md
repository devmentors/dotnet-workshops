# Dzień 2 — Ekosystem .NET (ASP.NET Core, EF Core) — zadania RED → GREEN

Zadania do Dnia 2 szkolenia (GetResponse × DevMentors). Stack: **.NET 10 / C# 14**,
**xUnit** (natywne `Assert.*`, bez FluentAssertions).

Jedna aplikacja ASP.NET Core: host `Shop.Api` + domena `Shop.Core`, foldery =
**capabilities** (Catalog / Ordering / Shipping). Większość działa (`dotnet run`) —
to Twój żywy wzór. Zadania to **stuby (RED)** rozsiane po aplikacji; każdy ma obok
**działające rodzeństwo**, na którym się wzorujesz.

## Model ćwiczeń
- Startujesz z czerwonymi testami; uzupełniasz stub (`NotImplementedException` / `// TODO`) aż zazielenieje.
- Wzorujesz się na **działającym rodzeństwie obok** (nie ma osobnych `Example.cs`).
- Kod po angielsku, komentarze i komunikaty po polsku. Testy: natywne `Assert.*`, `snake_case`.

## Struktura
```
cwiczenia/
├── Dzien2.sln
├── docker-compose.yml              # Postgres (docker compose up -d)
├── global.json                     # SDK 10.0.100
├── src/
│   ├── Shop.Core/                  # domena + aplikacja + EF (bez ASP.NET)
│   │   ├── Catalog/ · Ordering/ · Shipping/
│   │   └── Persistence/            # ShopContext, ShopContextFactory, Migrations/ (Npgsql)
│   └── Shop.Api/                   # host web (cienki): DI + endpointy
│       ├── Program.cs · appsettings.json
│       ├── Catalog/ · Ordering/ · Shipping/
│       └── Infrastructure/         # TimedMiddleware, ExceptionHandlingMiddleware*, LifetimeProbes, ...
└── tests/Exercises.Tests/          # xUnit, foldery per capability
```
`*` = plik ze stubem zadania.

## Mapa zadań
| # | Temat | Co uzupełniasz (plik) | Test (filtr) |
|---|-------|-----------------------|--------------|
| 1 | Host (pusty katalog) | tool-driven: `dotnet new web` → `dotnet run` | - |
| 2 | Endpoint POST | `Shop.Api/Catalog/CatalogEndpoints.cs` → POST `/products` | `ProductEndpointTests` |
| 3 | Global exception → ProblemDetails | `Shop.Api/Infrastructure/ExceptionHandlingMiddleware.cs` → `InvokeAsync` | `ExceptionHandlingMiddlewareTests` |
| 4 | DI (rejestracja + użycie) | `Shop.Core/Ordering/OrderPricing.cs` + `PricingRegistration.cs` → `AddPricing` | `OrderPricingTests` |
| 5 | Options pattern | `Shop.Core/Shipping/ShippingService.cs` → `IsFree` | `FreeShippingTests` |
| 6 | Feature flag (config) | `Shop.Api/Catalog/FeatureFlagEndpoints.cs` → bramka `Feature:Enabled` | `FeatureFlagTests` |
| 7 | EF Core — LINQ | `Shop.Core/Catalog/ProductQueries.cs` → `Available` | `ProductQueryTests` |
| 8 | LINQ→SQL (projekcja→JOIN) | `Shop.Core/Ordering/OrderQueries.cs` → `ByCustomer` | `OrderQueriesTests` |
| 9 | Stronicowanie + filtry | `Shop.Core/Catalog/ProductQueries.cs` → `Browse` (wzór: `Page`) | `ProductPagingTests` |
| 10 | Worker w tle | `Shop.Api/Ordering/QueueWorker.cs` → `ExecuteAsync` | `OrderQueueTests` |
| 11 | Cache (cache-aside) | `Shop.Core/Catalog/CachedProductService.cs` → `GetAsync` | `CachedProductServiceTests` |
| 12 | Migracje EF Core (opcjonalne) | `Shop.Core/Catalog/Product.cs` (+`Sku`) + `dotnet ef migrations add` | `MigrationsTests` (Skip, Docker) |

> N+1 (`GET /orders-report`) omawiamy jako slajd-koncept; hands-on z diagnostyką SQL → Dzień 3.
> Migracje (#12): `dotnet ef migrations add <Nazwa> --project src/Shop.Core --output-dir Persistence/Migrations`, potem `dotnet ef database update`.

## Jak uruchomić
```bash
docker compose up -d                # Postgres (localhost:55432, baza Shop) — potrzebny do `dotnet run`
dotnet test                         # 23 RED (stuby) + 1 skip (migracje) — graded na InMemory, bez Dockera
dotnet run --project src/Shop.Api   # żywa aplikacja (Postgres)
dotnet test --filter "FullyQualifiedName~Exercises.Tests.ProductEndpointTests"   # jedno zadanie
```

## Stan początkowy
Po `dotnet test` stuby są czerwone — to oczekiwane. Zadaniem jest doprowadzić każdy do GREEN.
