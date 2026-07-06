import type { Exercise } from '../types/Exercise';

// Dzień 2 - Ekosystem .NET (ASP.NET Core, EF Core).
// Zadania idą po warstwach aplikacji z decku: host -> endpoint -> middleware ->
// DI -> konfiguracja -> EF Core -> background -> caching.
// Model: sekcje, które da się sprawdzić testem, to prawdziwe RED->GREEN xUnit
// (auto-zalicza TestRunner). Host i pułapka N+1 są tool-driven (uruchom i obserwuj),
// kończone przyciskiem "Ukończono zadanie".

export const dzien2Exercises: Exercise[] = [
  // SEKCJA 1 - Host
  {
    id: 'd2-exercise-01',
    sequenceNumber: 1,
    title: 'A web app from an empty folder',
    titlePl: 'Aplikacja web z pustego katalogu',
    category: 'Host: web app',
    categoryPl: 'Host: aplikacja web',
    timeMinutes: 7,
    descriptionPl: `
## Po co to

Zanim dołożymy endpointy i bazę, warto poczuć, jak mało potrzeba, żeby ASP.NET Core zaczął nasłuchiwać na HTTP. Host (\`WebApplication\`) i serwer \`Kestrel\` startują kilkoma linijkami, bez konfiguracji serwera z zewnątrz.

## Zadanie

W pustym katalogu zbuduj i uruchom minimalną aplikację web:

\`\`\`bash
dotnet new web -o Shop      # szablon minimal API
cd Shop
dotnet run                  # Kestrel zaczyna nasłuchiwać
\`\`\`

Otwórz wypisany adres (np. \`http://localhost:5xxx\`) i zobacz odpowiedź z \`MapGet("/")\`. Zajrzyj do \`Program.cs\` i znajdź trzy kroki: \`CreateBuilder\`, \`Build\`, \`Run\`.

## Co zaobserwujesz

Cała działająca aplikacja to kilka linii. \`var builder\` to \`WebApplicationBuilder\` (faza rejestracji), \`var app\` to \`WebApplication\` (faza pipeline), a \`Run\` uruchamia Kestrela i utrzymuje proces.
    `,
    description: `
## Why it matters

Before adding endpoints and a database, it helps to feel how little it takes for ASP.NET Core to start listening on HTTP. The host (\`WebApplication\`) and the \`Kestrel\` server start in a few lines, with no external server config.

## Task

In an empty folder build and run a minimal web app:

\`\`\`bash
dotnet new web -o Shop
cd Shop
dotnet run
\`\`\`

Open the printed address and see the response from \`MapGet("/")\`. Open \`Program.cs\` and find three steps: \`CreateBuilder\`, \`Build\`, \`Run\`.

## What you will observe

The whole running app is a few lines. \`var builder\` is a \`WebApplicationBuilder\` (registration phase), \`var app\` is a \`WebApplication\` (pipeline phase), and \`Run\` starts Kestrel and keeps the process alive.
    `,
    hintPl: '\`dotnet new web\` tworzy minimal API (jeden \`Program.cs\`), a nie pusty projekt. \`dotnet run\` od razu buduje i podnosi Kestrela; adres z portem zobaczysz w konsoli.',
    hint: '\`dotnet new web\` creates a minimal API (a single \`Program.cs\`), not an empty project. \`dotnet run\` builds and starts Kestrel; the address and port are printed to the console.',
    solutionExplanationPl: '\`WebApplication.CreateBuilder\` przygotowuje host (DI, konfiguracja, logowanie), \`Build\` zamyka fazę rejestracji w gotowy \`WebApplication\`, a \`Run\` startuje serwer Kestrel i blokuje proces na nasłuchu. To punkt startu, do którego przez cały dzień dokładamy kolejne warstwy.',
    solutionExplanation: '\`WebApplication.CreateBuilder\` prepares the host (DI, configuration, logging), \`Build\` closes the registration phase into a ready \`WebApplication\`, and \`Run\` starts the Kestrel server and blocks the process. This is the starting point we keep adding layers to all day.',
    externalLink: 'https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis/overview',
    externalLinkLabel: 'Minimal APIs overview',
    externalLinkLabelPl: 'Minimal APIs - przegląd',
  },
  // SEKCJA 2 - Endpoint
  {
    id: 'd2-exercise-02',
    sequenceNumber: 2,
    title: 'POST endpoint in Minimal API',
    titlePl: 'Endpoint POST w Minimal API',
    category: 'Endpoints',
    categoryPl: 'Endpointy',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

Minimal API pozwala opisać endpoint jedną linijką: ścieżka, metoda HTTP i lambda, która go obsługuje. Dwie rzeczy dzieją się w niej „za darmo": ciało żądania (JSON) trafia do parametru złożonego (\`model binding\`), a usługi z kontenera wstrzykują się przez kolejne parametry (\`DI\`). Ale endpoint zapisujący dane (write-path) ma gałąź, której odczyt nie ma: WALIDACJĘ wejścia PRZED zapisem. Tu dopisujesz taki endpoint od zera.

## Zadanie

W \`Shop.Api/Catalog/CatalogEndpoints.cs\` (metoda \`MapCatalog\`, przy \`// ZADANIE\`) dopisz obsługę \`POST /products\`, która tworzy produkt. GET-y obok to wzór wiązania (lambda + DI), ale write-path ma dwie gałęzie:

- **wejście niepoprawne** - puste/białe \`Name\` LUB \`Price\` <= 0 - zwróć **400** (\`Results.BadRequest\`, świadomie prosty wariant, bez ProblemDetails),
- **wejście poprawne** - dopiero wtedy zapisz do bazy (\`ShopContext\`) i zwróć **201** z lokalizacją nowego zasobu (\`Results.Created\`).

Body jest zmapowane na rekord \`CreateProductRequest\` (\`Name\`, \`Price\`), a \`ShopContext\` wstrzykujesz jak w \`GET\` obok - produkt dokładasz przez \`db.Products.Add\` + \`SaveChangesAsync\`. Ponieważ lambda ma dwie ścieżki wyjścia (400 i 201), potrzebny jest wspólny typ zwrotny \`IResult\`.

Stan startowy (RED): stub rzuca \`NotImplementedException\`, więc happy-path (201) i oba testy walidacji (400) są czerwone.

## Co zaobserwujesz

Test integracyjny (\`WebApplicationFactory\`) sprawdza cztery rzeczy naraz: poprawny \`POST\` daje 201 z utworzonym produktem, który da się potem pobrać przez \`GET\`; puste \`Name\` daje 400; a \`Price\` = 0 daje 400. Sam happy-path nie wystarczy - walidacja musi odciąć złe wejście przed zapisem.
    `,
    description: `
## Why it matters

Minimal API lets you describe an endpoint in one line: route, HTTP method and the lambda handling it. Two things happen "for free" inside it: the request body (JSON) binds into a complex parameter (\`model binding\`), and container services inject through further parameters (\`DI\`). But a data-writing endpoint (write-path) has a branch a read does not: VALIDATING the input BEFORE the write. Here you write such an endpoint from scratch.

## Task

In \`Shop.Api/Catalog/CatalogEndpoints.cs\` (the \`MapCatalog\` method, at \`// ZADANIE\`) add the \`POST /products\` handler that creates a product. The GETs next to it are the binding template (lambda + DI), but the write-path has two branches:

- **invalid input** - blank/whitespace \`Name\` OR \`Price\` <= 0 - return **400** (\`Results.BadRequest\`, deliberately the simple variant, no ProblemDetails),
- **valid input** - only then store it in the database (\`ShopContext\`) and return **201** with the location of the new resource (\`Results.Created\`).

The body is bound to the \`CreateProductRequest\` record (\`Name\`, \`Price\`), and you inject \`ShopContext\` like the \`GET\` next to it - add the product via \`db.Products.Add\` + \`SaveChangesAsync\`. Because the lambda has two exit paths (400 and 201), it needs a common \`IResult\` return type.

Starting state (RED): the stub throws \`NotImplementedException\`, so the happy path (201) and both validation tests (400) are red.

## What you will observe

The integration test (\`WebApplicationFactory\`) checks four things at once: a valid \`POST\` returns 201 with the created product, which can then be fetched via \`GET\`; a blank \`Name\` returns 400; and \`Price\` = 0 returns 400. The happy path alone is not enough - validation must reject bad input before the write.
    `,
    hintPl: 'Zacznij od strażnika: jeśli \`Name\` jest puste/białe LUB \`Price\` nie jest dodatnie, wyjdź wcześnie z odpowiedzią 400 - zanim cokolwiek zapiszesz. Dopiero po przejściu walidacji dodaj produkt (\`db.Products.Add\` + \`await db.SaveChangesAsync()\`) i zwróć 201 z nagłówkiem lokalizacji nowego zasobu. Body (\`CreateProductRequest\`) i \`ShopContext\` bierzesz jak w \`GET\` obok; przy dwóch ścieżkach wyjścia zadeklaruj wspólny typ zwrotny \`IResult\`.',
    hint: 'Start with a guard: if \`Name\` is blank/whitespace OR \`Price\` is not positive, return early with a 400 response - before writing anything. Only after validation passes add the product (\`db.Products.Add\` + \`await db.SaveChangesAsync()\`) and return 201 with the location header of the new resource. Take the body (\`CreateProductRequest\`) and \`ShopContext\` like the \`GET\` next to it; with two exit paths declare a common \`IResult\` return type.',
    solution: `app.MapPost("/products", async (CreateProductRequest req, ShopContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Name) || req.Price <= 0)
        return Results.BadRequest();

    var product = new Product { Name = req.Name, Price = req.Price, Available = true };
    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/products/{product.Id}", product);
});`,
    solutionExplanationPl: 'Write-path zaczyna się od walidacji: strażnik odrzuca puste \`Name\` lub niedodatnie \`Price\` przez \`Results.BadRequest()\` (400) i wychodzi PRZED zapisem - nigdy nie tworzymy produktu ze złych danych. Parametr \`CreateProductRequest\` jest typem złożonym, więc Minimal API czyta go z JSON-a w body, a \`ShopContext\` wstrzykuje z kontenera bez adnotacji (jak w \`GET\` obok). Po walidacji \`db.Products.Add\` + \`SaveChangesAsync\` zapisuje produkt do bazy, a \`Results.Created\` zwraca 201 z nagłówkiem \`Location\`. Dwie ścieżki wyjścia (400 i 201) wymagają wspólnego typu \`IResult\` w sygnaturze lambdy.',
    solutionExplanation: 'The write-path starts with validation: a guard rejects a blank \`Name\` or a non-positive \`Price\` via \`Results.BadRequest()\` (400) and exits BEFORE the write - we never create a product from bad data. The \`CreateProductRequest\` parameter is a complex type, so Minimal API reads it from the JSON body, and \`ShopContext\` is injected from the container with no annotation (like the \`GET\` next to it). After validation, \`db.Products.Add\` + \`SaveChangesAsync\` stores the product in the database and \`Results.Created\` returns 201 with a \`Location\` header. The two exit paths (400 and 201) require a common \`IResult\` type in the lambda signature.',
    testFilter: 'FullyQualifiedName~Exercises.Tests.ProductEndpointTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Catalog/CatalogEndpoints.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Ordering/OrderingEndpoints.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Catalog/ProductEndpointTests.cs',
    ],
  },
  // SEKCJA 3 - Middleware
  {
    id: 'd2-exercise-03',
    sequenceNumber: 3,
    title: 'Global exception handler → ProblemDetails',
    titlePl: 'Globalny handler wyjątków → ProblemDetails',
    category: 'Pipeline and middleware',
    categoryPl: 'Pipeline i middleware',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Zamiast powtarzać \`try/catch\` w każdym endpoincie, jeden middleware łapie wyjątki domenowe i zamienia je na spójną odpowiedź \`ProblemDetails\` (RFC 9457). To wzorzec cross-cutting: logika wspólna dla wszystkich żądań siedzi w jednym ogniwie pipeline'u. Wszystkie klocki już znasz — middleware (jak \`TimedMiddleware\`, wpięty globalnie tuż obok) i \`Results.Problem\` (jak w POST /products).

## Zadanie

W \`Shop.Api/Infrastructure/ExceptionHandlingMiddleware.cs\` napisz ciało \`InvokeAsync\`:

1. Owiń \`await next(context)\` w \`try/catch (DomainException ex)\`.
2. W \`catch\` zwróć \`ProblemDetails\`: \`await Results.Problem(detail: ex.Message, statusCode: ex.StatusCode).ExecuteAsync(context)\`.

Rejestracja i wpięcie są gotowe (\`Program.cs\`, \`app.UseDomainExceptionHandling()\` — najbardziej zewnętrzne ogniwo, żeby łapać wyjątki ze wszystkich endpointów). Wzór globalnego middleware masz obok: \`TimedMiddleware\` (\`X-Elapsed-Ms\` + \`X-Request-Id\` na każdej odpowiedzi).

Stan startowy (RED): middleware tylko przepuszcza żądanie → \`DomainException\` z \`/demo/domain-error\` leci jako niezłapane 500.

## Co zaobserwujesz

Test uderza w \`/demo/domain-error\` (zawsze rzuca \`DomainException\`) i sprawdza, że odpowiedź to \`409 Conflict\` z typem \`application/problem+json\` (a nie surowe 500). Jeden middleware mapuje każdy \`DomainException\` w aplikacji — endpointy nie muszą już same łapać i formatować błędu.
    `,
    description: `
## Why it matters

Instead of repeating \`try/catch\` in every endpoint, one middleware catches domain exceptions and turns them into a consistent \`ProblemDetails\` response (RFC 9457). A cross-cutting pattern: logic common to all requests lives in one pipeline link. You already know every building block — middleware (like \`TimedMiddleware\`, wired globally right next to it) and \`Results.Problem\` (like in POST /products).

## Task

In \`Shop.Api/Infrastructure/ExceptionHandlingMiddleware.cs\` write the body of \`InvokeAsync\`:

1. Wrap \`await next(context)\` in \`try/catch (DomainException ex)\`.
2. In the \`catch\` return \`ProblemDetails\`: \`await Results.Problem(detail: ex.Message, statusCode: ex.StatusCode).ExecuteAsync(context)\`.

Registration and wiring are done (\`Program.cs\`, \`app.UseDomainExceptionHandling()\` — the outermost link, so it catches exceptions from all endpoints). The global-middleware reference is next to it: \`TimedMiddleware\` (\`X-Elapsed-Ms\` + \`X-Request-Id\` on every response).

Starting state (RED): the middleware only forwards the request → the \`DomainException\` from \`/demo/domain-error\` surfaces as an uncaught 500.

## What you will observe

The test hits \`/demo/domain-error\` (always throws \`DomainException\`) and checks the response is \`409 Conflict\` with \`application/problem+json\` (not a raw 500). One middleware maps every \`DomainException\` in the app — endpoints no longer catch and format the error themselves.
    `,
    hintPl: 'Kształt: \`try { await next(context); } catch (DomainException ex) { await Results.Problem(detail: ex.Message, statusCode: ex.StatusCode).ExecuteAsync(context); }\`. \`Results.Problem\` (jak w POST /products) zwraca \`IResult\`, a \`ExecuteAsync(context)\` zapisuje go do odpowiedzi. Rejestracja i wpięcie są gotowe — piszesz tylko ciało \`InvokeAsync\`. Wzór globalnego middleware: \`TimedMiddleware\` obok.',
    hint: 'Shape: \`try { await next(context); } catch (DomainException ex) { await Results.Problem(detail: ex.Message, statusCode: ex.StatusCode).ExecuteAsync(context); }\`. \`Results.Problem\` (like in POST /products) returns an \`IResult\`, and \`ExecuteAsync(context)\` writes it to the response. Registration and wiring are done — you only write the \`InvokeAsync\` body. Global-middleware reference: \`TimedMiddleware\` next to it.',
    solution: `public async Task InvokeAsync(HttpContext context, RequestDelegate next)
{
    try
    {
        await next(context);
    }
    catch (DomainException ex)
    {
        await Results.Problem(detail: ex.Message, statusCode: ex.StatusCode).ExecuteAsync(context);
    }
}`,
    solutionExplanationPl: 'Middleware owija resztę pipeline\'u (\`next\`) w \`try/catch\`, więc łapie wyjątki ze WSZYSTKICH endpointów za nim (dlatego wpięty jest najbardziej zewnętrznie). Łapiemy wyłącznie \`DomainException\` (znany błąd biznesowy), a jego \`StatusCode\` (domyślnie 409) staje się statusem odpowiedzi. \`Results.Problem(...).ExecuteAsync(context)\` zapisuje standardowe \`ProblemDetails\` (\`application/problem+json\`, RFC 9457) — jedno miejsce zamiast \`try/catch\` w każdym handlerze. Nieznane wyjątki celowo NIE są łapane (niech zadziała domyślny handler/500).',
    solutionExplanation: 'The middleware wraps the rest of the pipeline (\`next\`) in \`try/catch\`, so it catches exceptions from ALL endpoints behind it (hence wired outermost). We catch only \`DomainException\` (a known business error), and its \`StatusCode\` (409 by default) becomes the response status. \`Results.Problem(...).ExecuteAsync(context)\` writes a standard \`ProblemDetails\` (\`application/problem+json\`, RFC 9457) — one place instead of \`try/catch\` in every handler. Unknown exceptions are deliberately NOT caught (let the default handler/500 kick in).',
    testFilter: 'FullyQualifiedName~Exercises.Tests.ExceptionHandlingMiddlewareTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Infrastructure/ExceptionHandlingMiddleware.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/DomainException.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Infrastructure/TimedMiddleware.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Program.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Infrastructure/ExceptionHandlingMiddlewareTests.cs',
    ],
  },
  // SEKCJA 4 - Dependency Injection
  {
    id: 'd2-exercise-04',
    sequenceNumber: 4,
    title: 'Dependency Injection: register, inject, use',
    titlePl: 'Dependency Injection: rejestracja, wstrzyknięcie, użycie',
    category: 'Dependency Injection',
    categoryPl: 'Dependency Injection',
    timeMinutes: 10,
    descriptionPl: `
## Po co to

Dependency Injection to nie tylko wstrzyknięcie jednej metody - to cykl: rejestrujesz usługę POD ABSTRAKCJĄ, kontener tworzy konkretną implementację i podaje ją przez konstruktor tam, gdzie zadeklarowano zależność od abstrakcji. To właśnie odróżnia DI od zwykłego \`new\`: usługa zależy od interfejsu, a to, która implementacja pod nim stoi, decyduje się przy rejestracji. W tym zadaniu przechodzisz cały ten cykl.

## Zadanie

Masz gotową politykę rabatu \`DiscountService\`, która implementuje interfejs \`IDiscountPolicy\`. Trzy elementy:

1. \`OrderPricing\` (\`OrderPricing.cs\`): zależność wstrzyknij przez konstruktor jako ABSTRAKCJĘ \`IDiscountPolicy\` (nie jako konkretną klasę), zapamiętaj w polu, a w \`NetTotal(price, quantity)\` zwróć wynik delegując do wstrzykniętej polityki.
2. \`AddPricing\` (\`PricingRegistration.cs\`): metoda rozszerzająca na \`IServiceCollection\`, która wiąże \`IDiscountPolicy\` z jego implementacją \`DiscountService\` oraz rejestruje \`OrderPricing\` (\`Scoped\`) i zwraca \`services\`.
3. Testy - Ty tego nie ruszasz.

Stan startowy (RED): konstruktor \`OrderPricing\` nie zapamiętuje zależności, \`NetTotal\` i \`AddPricing\` rzucają \`NotImplementedException\`.

## Co zaobserwujesz

Test buduje realny kontener, woła \`AddPricing()\` i rozwiązuje \`OrderPricing\` - to dowodzi, że rejestracja pod abstrakcją i wstrzyknięcie przez konstruktor działają. Osobny test PODMIENIA rejestrację \`IDiscountPolicy\` na atrapę i sprawdza, że \`OrderPricing\` używa podmienionej polityki - co przechodzi TYLKO wtedy, gdy zależysz od interfejsu, a nie od konkretnej klasy. To namacalny powód, po co rejestrować pod abstrakcją.
    `,
    description: `
## Why it matters

Dependency Injection is not just injecting into one method - it is a cycle: you register a service UNDER AN ABSTRACTION, the container creates the concrete implementation and passes it through the constructor wherever a dependency on that abstraction is declared. That is exactly what separates DI from a plain \`new\`: a service depends on an interface, and which implementation stands behind it is decided at registration. In this exercise you go through that whole cycle.

## Task

You have a ready discount policy \`DiscountService\` that implements the \`IDiscountPolicy\` interface. Three parts:

1. \`OrderPricing\` (\`OrderPricing.cs\`): inject the dependency via the constructor as the ABSTRACTION \`IDiscountPolicy\` (not as the concrete class), store it in a field, and in \`NetTotal(price, quantity)\` return the result by delegating to the injected policy.
2. \`AddPricing\` (\`PricingRegistration.cs\`): an \`IServiceCollection\` extension method that binds \`IDiscountPolicy\` to its implementation \`DiscountService\` and registers \`OrderPricing\` (\`Scoped\`), returning \`services\`.
3. The tests - you do not touch them.

Starting state (RED): the \`OrderPricing\` constructor does not store the dependency, and \`NetTotal\` and \`AddPricing\` throw \`NotImplementedException\`.

## What you will observe

One test builds a real container, calls \`AddPricing()\` and resolves \`OrderPricing\` - proving registration under the abstraction and constructor injection work. A separate test SWAPS the \`IDiscountPolicy\` registration for a fake and checks that \`OrderPricing\` uses the swapped policy - which passes ONLY if you depend on the interface, not the concrete class. That is the tangible reason to register under an abstraction.
    `,
    hintPl: 'W \`OrderPricing\` typ pola i parametru konstruktora to ABSTRAKCJA \`IDiscountPolicy\` (nie \`DiscountService\`), a \`NetTotal\` deleguje rachunek do wstrzykniętej polityki. W \`AddPricing\` rejestrujesz implementację POD interfejsem - użyj wariantu \`AddScoped\` z DWOMA argumentami typu (serwis + implementacja), żeby ktokolwiek prosi o \`IDiscountPolicy\`, dostał \`DiscountService\`; osobno zarejestruj \`OrderPricing\` i zwróć \`services\`.',
    hint: 'In \`OrderPricing\` the field and constructor-parameter type is the ABSTRACTION \`IDiscountPolicy\` (not \`DiscountService\`), and \`NetTotal\` delegates the calculation to the injected policy. In \`AddPricing\` register the implementation UNDER the interface - use the two-type-argument \`AddScoped\` form (service + implementation), so whoever asks for \`IDiscountPolicy\` gets \`DiscountService\`; register \`OrderPricing\` separately and return \`services\`.',
    solution: `// OrderPricing.cs
public class OrderPricing
{
    private readonly IDiscountPolicy _discounts;

    public OrderPricing(IDiscountPolicy discounts) => _discounts = discounts;

    public decimal NetTotal(decimal price, int quantity)
        => _discounts.NetAfterDiscount(price, quantity);
}

// PricingRegistration.cs
public static IServiceCollection AddPricing(this IServiceCollection services)
{
    services.AddScoped<IDiscountPolicy, DiscountService>();
    services.AddScoped<OrderPricing>();
    return services;
}`,
    solutionExplanationPl: '\`OrderPricing\` deklaruje zależność od ABSTRAKCJI \`IDiscountPolicy\` w konstruktorze - nie tworzy jej przez \`new\` ani nie zna konkretnej klasy. \`AddScoped<IDiscountPolicy, DiscountService>()\` wiąże interfejs z implementacją, więc kontener rozwiązując \`OrderPricing\` tworzy \`DiscountService\` i podaje go pod interfejsem. Rejestracja pod abstrakcją to sedno DI: test może podmienić \`IDiscountPolicy\` na atrapę i \`OrderPricing\` użyje jej bez żadnej zmiany kodu. Grupowanie rejestracji w metodzie rozszerzającej na \`IServiceCollection\` to standardowa konwencja .NET (jak \`AddDbContext\`). \`Scoped\` oznacza jedną instancję na scope.',
    solutionExplanation: '\`OrderPricing\` declares its dependency on the ABSTRACTION \`IDiscountPolicy\` in the constructor - it does not \`new\` it and does not know the concrete class. \`AddScoped<IDiscountPolicy, DiscountService>()\` binds the interface to the implementation, so when the container resolves \`OrderPricing\` it creates \`DiscountService\` and passes it in under the interface. Registering under an abstraction is the essence of DI: a test can swap \`IDiscountPolicy\` for a fake and \`OrderPricing\` will use it with no code change. Grouping registrations in an \`IServiceCollection\` extension method is the standard .NET convention (like \`AddDbContext\`). \`Scoped\` means one instance per scope.',
    testFilter: 'FullyQualifiedName~Exercises.Tests.OrderPricingTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Ordering/OrderPricing.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Ordering/PricingRegistration.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Ordering/IDiscountPolicy.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Ordering/DiscountService.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Ordering/OrderPricingTests.cs',
    ],
  },
  // SEKCJA 5 - Konfiguracja i Options
  {
    id: 'd2-exercise-05',
    sequenceNumber: 5,
    title: 'Options pattern: from appsettings to usage',
    titlePl: 'Options pattern: od appsettings po użycie',
    category: 'Configuration and Options',
    categoryPl: 'Konfiguracja i Options',
    timeMinutes: 10,
    descriptionPl: `
## Po co to

Usługa nie powinna czytać surowego \`IConfiguration\` po kluczach - wiąże się sekcję ustawień z klasą i wstrzykuje przez \`IOptions<T>\`. W tym zadaniu przechodzisz PEŁNY łańcuch: wartość z \`appsettings.json\` -> związana z klasą \`ShippingOptions\` -> wstrzyknięta do \`ShippingService\` -> użyta w logice progu darmowej dostawy.

## Zadanie

Wiązanie sekcji \`Shipping\` z \`ShippingOptions\` i rejestracja \`ShippingService\` są już GOTOWE w \`Program.cs\` (wzór: metoda \`FlatRate\` obok czyta Options tak samo). Twoja robota to jedna metoda:

W \`Shop.Core/Shipping/ShippingService.cs\` zaimplementuj \`IsFree(decimal cartTotal)\`: zwróć \`true\`, gdy \`cartTotal >= _options.FreeShippingThreshold\`, inaczej \`false\`. Granica włącznie (dokładnie próg = już darmowa).

Stan startowy (RED): \`IsFree\` rzuca \`NotImplementedException\`. Próg \`200\` pochodzi z \`appsettings.json\`, nie z kodu.

## Co zaobserwujesz

Test podnosi host (\`WebApplicationFactory\`), który wczytuje \`appsettings.json\`, rozwiązuje \`ShippingService\` z kontenera i sprawdza brzeg (199 -> false, 200 -> true). Próg \`200\` pochodzi z pliku konfiguracyjnego, nie z kodu testu - dowód, że cały łańcuch działa.
    `,
    description: `
## Why it matters

A service should not read raw \`IConfiguration\` by keys - you bind a settings section to a class and inject it via \`IOptions<T>\`. In this exercise you go through the FULL chain: a value in \`appsettings.json\` -> bound to the \`ShippingOptions\` class -> injected into \`ShippingService\` -> used in the free-shipping threshold logic.

## Task

Binding the \`Shipping\` section to \`ShippingOptions\` and registering \`ShippingService\` are already DONE in \`Program.cs\` (reference: the \`FlatRate\` method next to it reads Options the same way). Your job is a single method:

In \`Shop.Core/Shipping/ShippingService.cs\` implement \`IsFree(decimal cartTotal)\`: return \`true\` when \`cartTotal >= _options.FreeShippingThreshold\`, otherwise \`false\`. Inclusive boundary (exactly the threshold = already free).

Starting state (RED): \`IsFree\` throws \`NotImplementedException\`. The \`200\` threshold comes from \`appsettings.json\`, not from code.

## What you will observe

The test starts the host (\`WebApplicationFactory\`), which loads \`appsettings.json\`, resolves \`ShippingService\` from the container and checks the boundary (199 -> false, 200 -> true). The \`200\` threshold comes from the configuration file, not from the test code - proof the whole chain works.
    `,
    hintPl: 'Wiązanie i rejestracja są już w \`Program.cs\` (wzór: \`FlatRate\` obok). \`IsFree\` w \`Shop.Core/Shipping/ShippingService.cs\` to jedno porównanie \`cartTotal >= _options.FreeShippingThreshold\` (\`>=\` daje brzeg włącznie).',
    hint: 'Binding and registration are already in \`Program.cs\` (reference: \`FlatRate\` next to it). \`IsFree\` in \`Shop.Core/Shipping/ShippingService.cs\` is a single comparison \`cartTotal >= _options.FreeShippingThreshold\` (\`>=\` gives the inclusive boundary).',
    solution: `// appsettings.json
"Shipping": { "FreeShippingThreshold": 200 }

// Program.cs
builder.Services.Configure<ShippingOptions>(builder.Configuration.GetSection("Shipping"));
builder.Services.AddSingleton<ShippingService>();

// ShippingService.cs
public bool IsFree(decimal cartTotal)
    => cartTotal >= _options.FreeShippingThreshold;`,
    solutionExplanationPl: '\`Configure<ShippingOptions>(GetSection("Shipping"))\` wiąże sekcję \`appsettings.json\` z klasą, a \`ShippingService\` dostaje \`IOptions<ShippingOptions>\` przez konstruktor i czyta \`.Value\` raz. Dzięki temu próg jest silnie typowany i pochodzi z konfiguracji, nie z magicznej liczby w kodzie. Dla ustawień zmiennych w czasie działania użyłbyś \`IOptionsSnapshot\` (świeża wartość raz na żądanie) lub \`IOptionsMonitor\` (z powiadomieniem o zmianie).',
    solutionExplanation: '\`Configure<ShippingOptions>(GetSection("Shipping"))\` binds the \`appsettings.json\` section to the class, and \`ShippingService\` receives \`IOptions<ShippingOptions>\` via the constructor and reads \`.Value\` once. This makes the threshold strongly typed and sourced from configuration, not a magic number in code. For settings that change at runtime you would use \`IOptionsSnapshot\` (a fresh value once per request) or \`IOptionsMonitor\` (with change notification).',
    testFilter: 'FullyQualifiedName~Exercises.Tests.FreeShippingTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Shipping/ShippingService.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Program.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/appsettings.json',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Shipping/FreeShippingTests.cs',
    ],
  },
  {
    id: 'd2-exercise-06',
    sequenceNumber: 6,
    title: 'Feature flag: gate an endpoint from configuration',
    titlePl: 'Feature flag: włącz/wyłącz endpoint z konfiguracji',
    category: 'Configuration and Options',
    categoryPl: 'Konfiguracja i Options',
    timeMinutes: 15,
    description: `## Why it matters
A feature flag turns behavior on/off **from config, without a redeploy** — a staple of real ASP.NET services. Different from the Options threshold exercise (a value): here a \`bool\` gates a whole endpoint.

## Task
The host already binds section \`Feature\` to \`FeatureOptions\` (sibling of \`Shipping\` → \`ShippingOptions\`). Gate the endpoint in \`Shop.Api/Catalog/FeatureFlagEndpoints.cs\`:
- \`Feature:Enabled\` == false → \`Results.NotFound()\` (feature off),
- true → return the payload (200).

Starting state (RED): the endpoint ignores the flag and always returns 200. Test: \`Exercises.Tests.FeatureFlagTests\`.

## What you will observe
The test flips \`Feature:Enabled\` via config (both branches): disabled → 404, enabled → 200. For no-restart changes, \`IOptionsMonitor\` reacts to config file edits at runtime.`,
    descriptionPl: `## Po co to
Feature flag włącza/wyłącza zachowanie **z configu, bez redeployu** — chleb powszedni realnych serwisów ASP.NET. Inaczej niż ćwiczenie Options z progiem (wartość): tu \`bool\` włącza lub wyłącza cały endpoint.

## Zadanie
Host już wiąże sekcję \`Feature\` z \`FeatureOptions\` (tak jak \`Shipping\` → \`ShippingOptions\`). Ukryj endpoint za flagą w \`Shop.Api/Catalog/FeatureFlagEndpoints.cs\`:
- \`Feature:Enabled\` == false → \`Results.NotFound()\` (funkcja wyłączona),
- true → zwróć zawartość (200).

Stan startowy (RED): endpoint ignoruje flagę i zawsze zwraca 200. Test: \`Exercises.Tests.FeatureFlagTests\`.

## Co zaobserwujesz
Test przełącza \`Feature:Enabled\` przez config (obie gałęzie): wyłączony → 404, włączony → 200. Do zmian bez restartu \`IOptionsMonitor\` reaguje na edycję pliku konfiguracji w locie.`,
    hint: 'The binding is done for you — read the flag via IOptions<FeatureOptions> (same as ShippingService reads IOptions<ShippingOptions>) and short-circuit with Results.NotFound() when disabled. The lambda already returns IResult, so adding the guard line is enough. For runtime reaction without restart, IOptionsMonitor is the "dla szybkich" upgrade.',
    hintPl: 'Wiązanie masz gotowe — odczytaj flagę przez IOptions<FeatureOptions> (jak ShippingService czyta IOptions<ShippingOptions>) i zrób short-circuit Results.NotFound(), gdy wyłączona. Lambda już zwraca IResult, więc wystarczy dołożyć linię strażnika. Reakcja bez restartu to IOptionsMonitor (dla szybkich).',
    testFilter: 'FullyQualifiedName~Exercises.Tests.FeatureFlagTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Catalog/FeatureFlagEndpoints.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Shipping/ShippingService.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Catalog/FeatureFlagTests.cs',
    ],
  },
  // SEKCJA 6 - EF Core
  {
    id: 'd2-exercise-07',
    sequenceNumber: 7,
    title: 'A query EF Core turns into SQL',
    titlePl: 'Zapytanie, które EF Core zamienia w SQL',
    category: 'EF Core',
    categoryPl: 'EF Core',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

Zapytanie piszemy w LINQ na \`DbSet\`, a EF Core tłumaczy je na SQL i wykonuje w bazie. Filtr i sortowanie powinny dziać się po stronie bazy, nie w pamięci po wciągnięciu całej tabeli.

## Zadanie

Zaimplementuj \`ProductQueries.Available(ShopContext db)\`: zwróć produkty z \`db.Products\`, w których \`Available == true\`, posortowane rosnąco po \`Name\`, jako \`List<Product>\` (\`await ... ToListAsync()\`).

Stan startowy (RED): metoda rzuca \`NotImplementedException\`. W teście dostawcą jest EF Core InMemory (bez bazy i Dockera).

## Co zaobserwujesz

Kolejność operatorów ma znaczenie: \`Where\` i \`OrderBy\` PRZED \`ToListAsync\` zostają przetłumaczone i wykonane przez providera. Gdybyś najpierw zmaterializował całą tabelę, filtrował w pamięci aplikacji.
    `,
    description: `
## Why it matters

You write the query in LINQ over a \`DbSet\`, and EF Core translates it to SQL and runs it in the database. Filtering and sorting should happen in the database, not in memory after pulling the whole table.

## Task

Implement \`ProductQueries.Available(ShopContext db)\`: return products from \`db.Products\` where \`Available == true\`, sorted ascending by \`Name\`, as a \`List<Product>\` (\`await ... ToListAsync()\`).

Starting state (RED): the method throws \`NotImplementedException\`. The test uses EF Core InMemory (no database, no Docker).

## What you will observe

Operator order matters: \`Where\` and \`OrderBy\` BEFORE \`ToListAsync\` are translated and run by the provider. If you materialized the whole table first, you would filter in app memory.
    `,
    hintPl: 'Złóż łańcuch \`db.Products.Where(p => p.Available).OrderBy(p => p.Name).ToListAsync()\`. \`ToListAsync\` jest na końcu - to ono wykonuje zapytanie (deferred execution z Dnia 1).',
    hint: 'Chain \`db.Products.Where(p => p.Available).OrderBy(p => p.Name).ToListAsync()\`. \`ToListAsync\` goes last - it executes the query (deferred execution from Day 1).',
    solution: `public static Task<List<Product>> Available(ShopContext db)
    => db.Products
        .Where(p => p.Available)
        .OrderBy(p => p.Name)
        .ToListAsync();`,
    solutionExplanationPl: 'Operatory LINQ budują wyrażenie, które EF Core tłumaczy na SQL i wykonuje dopiero przy \`ToListAsync\`. Filtr i sortowanie wykonuje provider bazy, więc po sieci wraca tylko wynik. Dla zapytania tylko do odczytu dodanie \`AsNoTracking()\` zdjęłoby narzut change trackera.',
    solutionExplanation: 'LINQ operators build an expression EF Core translates to SQL and runs only at \`ToListAsync\`. The database provider does the filtering and sorting, so only the result returns over the wire. For a read-only query, adding \`AsNoTracking()\` would remove the change tracker overhead.',
    testFilter: 'FullyQualifiedName~Exercises.Tests.ProductQueryTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Catalog/ProductQueries.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Catalog/ProductQueryTests.cs',
    ],
  },
  {
    id: 'd2-exercise-08',
    sequenceNumber: 8,
    title: 'A LINQ projection EF turns into a JOIN',
    titlePl: 'Projekcja LINQ, którą EF zamienia w JOIN',
    category: 'EF Core',
    categoryPl: 'EF Core',
    timeMinutes: 10,
    descriptionPl: `
## Po co to

Projekcja po właściwościach nawigacyjnych (\`Order.Customer\`, \`Order.Lines\`) każe EF Core dołożyć \`JOIN\` — jedno zapytanie zamiast dociągania relacji osobno. To realny sposób na zwięzły, szybki odczyt raportowy.

## Zadanie

Zaimplementuj \`OrderQueries.ByCustomer(ShopContext db, string customer)\`: zwróć zamówienia klienta o nazwie \`customer\` jako \`OrderSummary\` (Id, nazwa klienta, liczba pozycji). Wzór obok: \`All\` — ta sama projekcja bez filtra.

Stan startowy (RED): metoda rzuca \`NotImplementedException\`. Test na EF Core InMemory.

## Co zaobserwujesz

Z włączonym logiem SQL (\`Database.Command\`) zobaczysz \`INNER JOIN "Customers"\` — projekcja \`o.Customer.Name\` i \`o.Lines.Count\` została przetłumaczona na jedno zapytanie z JOIN-em, nie na N osobnych.
    `,
    description: `
## Why it matters

Projecting over navigation properties (\`Order.Customer\`, \`Order.Lines\`) makes EF Core add a \`JOIN\` — one query instead of loading relations separately. A real way to keep reporting reads terse and fast.

## Task

Implement \`OrderQueries.ByCustomer(ShopContext db, string customer)\`: return the orders of the customer named \`customer\` as \`OrderSummary\` (Id, customer name, item count). Sibling next to it: \`All\` — the same projection without the filter.

Starting state (RED): the method throws \`NotImplementedException\`. The test uses EF Core InMemory.

## What you will observe

With SQL logging on (\`Database.Command\`) you will see \`INNER JOIN "Customers"\` — the \`o.Customer.Name\` and \`o.Lines.Count\` projection was translated into a single query with a JOIN, not N separate ones.
    `,
    hintPl: 'Zacznij od wzoru \`All\`, dołóż \`.Where(o => o.Customer!.Name == customer)\` przed \`.Select(...)\`. Projekcja do \`OrderSummary\` (Id, Customer.Name, Lines.Count) daje JOIN.',
    hint: 'Start from the \`All\` sibling, add \`.Where(o => o.Customer!.Name == customer)\` before \`.Select(...)\`. Projecting into \`OrderSummary\` (Id, Customer.Name, Lines.Count) yields the JOIN.',
    solution: `public static Task<List<OrderSummary>> ByCustomer(ShopContext db, string customer)
    => db.Orders
        .Where(o => o.Customer!.Name == customer)
        .Select(o => new OrderSummary(o.Id, o.Customer!.Name, o.Lines.Count))
        .ToListAsync();`,
    solutionExplanationPl: 'Filtr po \`Customer.Name\` i projekcja po nawigacjach składają się na jedno wyrażenie, które EF tłumaczy na SELECT z INNER JOIN do \`Customers\` i podzapytaniem liczącym \`Lines\`. Całość leci jednym zapytaniem — stąd zwięzłość i brak N+1.',
    solutionExplanation: 'The filter on \`Customer.Name\` and the projection over navigations form one expression EF translates into a SELECT with an INNER JOIN to \`Customers\` and a subquery counting \`Lines\`. It all goes in one query — hence terse and no N+1.',
    testFilter: 'FullyQualifiedName~Exercises.Tests.OrderQueriesTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Ordering/OrderQueries.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Ordering/OrderQueriesTests.cs',
    ],
  },
  // SEKCJA 6 (c.d.) - EF Core: stronicowanie + filtry
  {
    id: 'd2-exercise-09',
    sequenceNumber: 9,
    title: 'Pagination + filters: one SQL, not the whole table',
    titlePl: 'Stronicowanie + filtry: jeden SQL zamiast całej tabeli',
    category: 'EF Core',
    categoryPl: 'EF Core',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Lista produktów w realnym API nie oddaje całej tabeli — filtruje, sortuje i oddaje JEDNĄ stronę. Klucz: te same operatory LINQ, które w Dniu 1 działały na kolekcji w pamięci (\`Where\`/\`OrderBy\`/\`Skip\`/\`Take\`), na \`IQueryable\` EF Core składają się w JEDEN SQL (filtr + sort + OFFSET/FETCH) — robotę robi baza, nie aplikacja.

## Zadanie

Zaimplementuj \`ProductQueries.Browse(db, name, minPrice, maxPrice, page, limit)\` (\`Shop.Core/Catalog/ProductQueries.cs\`) → \`PagedResult<Product>\`:
- nałóż filtry \`Where\`, GDY podane (\`name\` zawiera, \`minPrice\`/\`maxPrice\` — przedział ceny),
- posortuj po \`Name\`,
- policz WSZYSTKIE pasujące (\`CountAsync\`) → \`TotalCount\`,
- oddaj stronę: \`Skip((page-1)*limit).Take(limit)\`.

Wzór obok: \`Page\` (stronicowanie bez filtra). Zmień sygnaturę na \`async\` (jak \`Page\`).

Stan startowy (RED): \`Browse\` rzuca \`NotImplementedException\`.

## Co zaobserwujesz

Test (EF InMemory) sprawdza cztery rzeczy: strona 1 posortowana, \`TotalCount\` liczy WSZYSTKIE pasujące (nie rozmiar strony), strona 2 kontynuuje od miejsca przerwania, a filtry (cena, nazwa) zawężają wynik PRZED stronicowaniem. Z włączonym logiem SQL (Dzień 3) zobaczysz jeden SELECT z WHERE/ORDER BY/OFFSET.
    `,
    description: `
## Why it matters

A real API's product list does not return the whole table — it filters, sorts and returns ONE page. The point: the same LINQ operators that worked on an in-memory collection on Day 1 (\`Where\`/\`OrderBy\`/\`Skip\`/\`Take\`) compose, over EF Core \`IQueryable\`, into ONE SQL (filter + sort + OFFSET/FETCH) — the database does the work, not the app.

## Task

Implement \`ProductQueries.Browse(db, name, minPrice, maxPrice, page, limit)\` (\`Shop.Core/Catalog/ProductQueries.cs\`) → \`PagedResult<Product>\`:
- apply \`Where\` filters WHEN provided (\`name\` contains, \`minPrice\`/\`maxPrice\` price range),
- sort by \`Name\`,
- count ALL matches (\`CountAsync\`) → \`TotalCount\`,
- return the page: \`Skip((page-1)*limit).Take(limit)\`.

Sibling next to it: \`Page\` (pagination without a filter). Change the signature to \`async\` (like \`Page\`).

Starting state (RED): \`Browse\` throws \`NotImplementedException\`.

## What you will observe

The test (EF InMemory) checks four things: page 1 is sorted, \`TotalCount\` counts ALL matches (not the page size), page 2 continues where page 1 ended, and filters (price, name) narrow the result BEFORE paging. With SQL logging on (Day 3) you will see one SELECT with WHERE/ORDER BY/OFFSET.
    `,
    hintPl: 'Wzoruj się na \`Page\` obok (Count + Skip/Take). Zacznij od \`var query = db.Products.AsQueryable();\`, dokładaj \`query = query.Where(...)\` tylko dla podanych filtrów (\`!string.IsNullOrWhiteSpace(name)\`, \`minPrice is not null\`, \`maxPrice is not null\`), potem \`OrderBy(p => p.Name)\`, \`await ...CountAsync()\` na total i \`await ...Skip((page-1)*limit).Take(limit).ToListAsync()\` na stronę. Zmień sygnaturę na \`async\`.',
    hint: 'Follow \`Page\` next to it (Count + Skip/Take). Start with \`var query = db.Products.AsQueryable();\`, add \`query = query.Where(...)\` only for provided filters (\`!string.IsNullOrWhiteSpace(name)\`, \`minPrice is not null\`, \`maxPrice is not null\`), then \`OrderBy(p => p.Name)\`, \`await ...CountAsync()\` for the total and \`await ...Skip((page-1)*limit).Take(limit).ToListAsync()\` for the page. Change the signature to \`async\`.',
    solution: `public static async Task<PagedResult<Product>> Browse(
    ShopContext db, string? name, decimal? minPrice, decimal? maxPrice, int page, int limit)
{
    var query = db.Products.AsQueryable();
    if (!string.IsNullOrWhiteSpace(name))
        query = query.Where(p => p.Name.Contains(name));
    if (minPrice is not null)
        query = query.Where(p => p.Price >= minPrice);
    if (maxPrice is not null)
        query = query.Where(p => p.Price <= maxPrice);
    var ordered = query.OrderBy(p => p.Name);
    var total = await ordered.CountAsync();
    var items = await ordered.Skip((page - 1) * limit).Take(limit).ToListAsync();
    return new PagedResult<Product>(items, total, page, limit);
}`,
    solutionExplanationPl: '\`Browse\` składa filtry warunkowo (tylko dla podanych argumentów), więc jedno wyrażenie \`IQueryable\` obsługuje wszystkie kombinacje. EF tłumaczy je na jeden SELECT: \`WHERE\` (filtry) + \`ORDER BY Name\` + \`OFFSET/FETCH\` (Skip/Take). \`CountAsync\` PRZED stronicowaniem daje \`TotalCount\` wszystkich pasujących — potrzebny do policzenia stron w UI. Nic nie materializuje się do pamięci przed \`ToListAsync\`/\`CountAsync\` (deferred execution z Dnia 1): baza filtruje, sortuje i tnie stronę, a po sieci wraca tylko strona wyników.',
    solutionExplanation: '\`Browse\` composes filters conditionally (only for provided arguments), so a single \`IQueryable\` expression handles every combination. EF translates it into one SELECT: \`WHERE\` (filters) + \`ORDER BY Name\` + \`OFFSET/FETCH\` (Skip/Take). \`CountAsync\` BEFORE paging gives \`TotalCount\` of all matches — needed to compute page counts in the UI. Nothing materializes to memory before \`ToListAsync\`/\`CountAsync\` (deferred execution from Day 1): the database filters, sorts and slices the page, and only the page of results returns over the wire.',
    testFilter: 'FullyQualifiedName~Exercises.Tests.ProductPagingTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Catalog/ProductQueries.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Persistence/PagedResult.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Catalog/CatalogEndpoints.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Catalog/ProductPagingTests.cs',
    ],
  },
  // SEKCJA 7 - Background services
  {
    id: 'd2-exercise-10',
    sequenceNumber: 10,
    title: 'Background service: consume a channel with a scope',
    titlePl: 'Worker w tle: konsumpcja kanału ze scope',
    category: 'Background services',
    categoryPl: 'Background services',
    timeMinutes: 10,
    descriptionPl: `
## Po co to

Usługa w tle (\`BackgroundService\`) działa przez cały czas życia hosta i przetwarza pracę spoza cyklu żądanie-odpowiedź. **Po co?** \`POST /orders\` ma odpowiedzieć SZYBKO (201), więc wolny follow-up zamówienia (potwierdzenie mailem, płatność, rezerwacja) spychamy na kolejkę i robimy w tle. W tym zadaniu piszesz mechanikę workera, a nie tylko funkcję pomocniczą - trzy rzeczy, które definiują poprawny worker:

- **pętla konsumenta kanału** - czytanie wiadomości ze strumienia,
- **\`CreateScope\` (captive dependency)** - \`BackgroundService\` żyje jak singleton, a \`ShopContext\` jest scoped, więc DbContextu nie wolno wstrzyknąć wprost; dla każdej wiadomości otwierasz osobny scope,
- **idempotencja** - w kolejkach ta sama wiadomość potrafi przyjść dwa razy (at-least-once).

## Zadanie

Ciało w \`QueueWorker.ExecuteAsync\` (\`src/Shop.Api/Ordering/QueueWorker.cs\`):

1. Pętla: \`await foreach (var order in _queue.ReadAllAsync(stoppingToken))\`.
2. Dla każdego zamówienia otwórz scope i pobierz z niego \`ShopContext\`:
   \`using var scope = _scopeFactory.CreateScope();\` -> \`GetRequiredService<ShopContext>()\`.
3. Idempotentnie: jeśli nie ma jeszcze wpisu o tym \`OrderId\`, zrób follow-up (\`_logger.LogInformation(...)\` - tu symulacja pracy) i dodaj \`ProcessedOrder\` z \`order.Id\`.
4. **Rejestracja** (\`Program.cs\`): sam wepnij worker do hosta - \`builder.Services.AddHostedService<QueueWorker>();\` (zakomentowane przy \`OrderQueue\`). Bez rejestracji \`BackgroundService\` w ogóle nie wystartuje.

Stan startowy (RED): \`ExecuteAsync\` zwraca od razu, a rejestracja jest zakomentowana - worker nie chodzi, zamówienie nie trafia do bazy, test czeka bezskutecznie. Host wstaje normalnie.

## Co zaobserwujesz

Test wrzuca to samo zamówienie do kolejki dwa razy i sprawdza, że w bazie jest dokładnie jeden wpis. To weryfikuje naraz: że pętla konsumuje z kanału, że worker sięga po \`ShopContext\` przez \`CreateScope\`, i że przetwarzanie jest idempotentne.
    `,
    description: `
## Why it matters

A background service (\`BackgroundService\`) runs for the whole lifetime of the host and processes work outside the request-response cycle. **Why?** \`POST /orders\` must respond FAST (201), so the slow order follow-up (email confirmation, payment, reservation) is pushed onto a queue and done in the background. In this exercise you write the worker's mechanics, not just a helper - the three things that define a correct worker:

- **the channel consumer loop** - reading messages off a stream,
- **\`CreateScope\` (captive dependency)** - a \`BackgroundService\` lives like a singleton while \`ShopContext\` is scoped, so you must not inject the DbContext directly; you open a fresh scope per message,
- **idempotency** - in queues the same message can arrive twice (at-least-once).

## Task

Fill \`QueueWorker.ExecuteAsync\` (\`src/Shop.Api/Ordering/QueueWorker.cs\`):

1. Loop: \`await foreach (var order in _queue.ReadAllAsync(stoppingToken))\`.
2. For each order open a scope and get \`ShopContext\` from it:
   \`using var scope = _scopeFactory.CreateScope();\` -> \`GetRequiredService<ShopContext>()\`.
3. Idempotently: if there is no entry for that \`OrderId\` yet, do the follow-up (\`_logger.LogInformation(...)\` - the simulated work here) and add a \`ProcessedOrder\` with \`order.Id\`.
4. **Registration** (\`Program.cs\`): wire the worker into the host yourself - \`builder.Services.AddHostedService<QueueWorker>();\` (commented out next to \`OrderQueue\`). Without registration the \`BackgroundService\` never starts.

Starting state (RED): \`ExecuteAsync\` returns immediately and the registration is commented out - the worker never runs, the order never reaches the database, and the test waits in vain. The host starts normally.

## What you will observe

The test enqueues the same order twice and checks the database has exactly one entry. This verifies at once: that the loop consumes from the channel, that the worker gets \`ShopContext\` via \`CreateScope\`, and that processing is idempotent.
    `,
    hintPl: 'Wzór: \`await foreach (var order in _queue.ReadAllAsync(stoppingToken)) { using var scope = _scopeFactory.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<ShopContext>(); if (!await db.ProcessedOrders.AnyAsync(p => p.OrderId == order.Id, stoppingToken)) { _logger.LogInformation("Przetwarzam zamówienie {Id}…", order.Id); db.ProcessedOrders.Add(new ProcessedOrder { OrderId = order.Id }); await db.SaveChangesAsync(stoppingToken); } }\`. Metoda musi być \`async\`. I nie zapomnij o REJESTRACJI w \`Program.cs\`: \`builder.Services.AddHostedService<QueueWorker>();\` (zakomentowana przy \`OrderQueue\`) - bez niej worker nie ruszy, a test zostaje RED.',
    hint: 'Shape: \`await foreach (var order in _queue.ReadAllAsync(stoppingToken)) { using var scope = _scopeFactory.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<ShopContext>(); if (!await db.ProcessedOrders.AnyAsync(p => p.OrderId == order.Id, stoppingToken)) { _logger.LogInformation("Processing order {Id}…", order.Id); db.ProcessedOrders.Add(new ProcessedOrder { OrderId = order.Id }); await db.SaveChangesAsync(stoppingToken); } }\`. The method must be \`async\`. And do not forget the REGISTRATION in \`Program.cs\`: \`builder.Services.AddHostedService<QueueWorker>();\` (commented out next to \`OrderQueue\`) - without it the worker never runs and the test stays RED.',
    solution: `protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    await foreach (var order in _queue.ReadAllAsync(stoppingToken))
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShopContext>();
        if (!await db.ProcessedOrders.AnyAsync(p => p.OrderId == order.Id, stoppingToken))
        {
            // follow-up zamówienia (tu: log; w realu mail/płatność/rezerwacja)
            _logger.LogInformation("Przetwarzam zamówienie {Id} — follow-up w tle…", order.Id);
            db.ProcessedOrders.Add(new ProcessedOrder { OrderId = order.Id });
            await db.SaveChangesAsync(stoppingToken);
        }
    }
}

// Program.cs - rejestracja workera (odkomentuj przy OrderQueue):
builder.Services.AddHostedService<QueueWorker>();`,
    solutionExplanationPl: '\`ReadAllAsync\` daje strumień, który \`await foreach\` konsumuje aż do zatrzymania hosta (\`stoppingToken\`). Kluczowy jest \`CreateScope\`: \`BackgroundService\` jest singletonem, a \`ShopContext\` scoped - wstrzyknięcie DbContextu wprost do workera byłoby błędem captive dependency (długożyjący obiekt trzymałby krótkożyjący). Osobny scope na wiadomość daje świeży, poprawnie zwalniany \`DbContext\`. Sprawdzenie \`AnyAsync\` przed zapisem czyni przetwarzanie idempotentnym - powtórna dostawa nie tworzy duplikatu.',
    solutionExplanation: '\`ReadAllAsync\` yields a stream that \`await foreach\` consumes until the host stops (\`stoppingToken\`). The key is \`CreateScope\`: a \`BackgroundService\` is a singleton while \`ShopContext\` is scoped - injecting the DbContext straight into the worker would be a captive dependency (a long-lived object holding a short-lived one). A fresh scope per message gives a fresh, properly disposed \`DbContext\`. The \`AnyAsync\` check before the insert makes processing idempotent - a redelivery creates no duplicate.',
    testFilter: 'FullyQualifiedName~Exercises.Tests.OrderQueueTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Ordering/QueueWorker.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Program.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Ordering/OrderQueue.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Ordering/OrderQueueTests.cs',
    ],
  },
  // SEKCJA 8 - Caching
  {
    id: 'd2-exercise-11',
    sequenceNumber: 11,
    title: 'Cache-aside with IDistributedCache',
    titlePl: 'Cache-aside z IDistributedCache',
    category: 'Caching',
    categoryPl: 'Caching',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

Wzorzec cache-aside: zamiast za każdym razem pytać źródło (bazę, zewnętrzne API), najpierw sprawdzamy cache, a kosztowny odczyt wykonujemy tylko przy chybieniu. Tu robisz go na \`IDistributedCache\` - abstrakcji, która skaluje się na wiele instancji (np. Redis), ale za to NIE ma \`GetOrCreate\`: trzyma wyłącznie bajty/stringi pod kluczem. Cały cykl piszesz ręcznie.

## Zadanie

Rejestracja (\`AddDistributedMemoryCache()\` - in-memory implementacja \`IDistributedCache\`, bez Redisa - plus \`AddSingleton<CachedProductService>()\`) jest już GOTOWA w \`Program.cs\`. UWAGA: metoda \`CountAsync\` obok pokazuje ten sam cykl cache-aside, ale na skalarze (licznik → string), bez serializacji obiektu - patrz na kształt, ale Twój \`GetAsync\` cache'uje OBIEKT (JSON).

Twoja robota to jedna metoda: \`CachedProductService.GetAsync(int id)\` w \`Shop.Core/Catalog/CachedProductService.cs\`. Zbuduj pełny cykl cache-aside RĘCZNIE:

- odczyt z cache po UNIKALNYM kluczu per Id; wartość \`null\` = chybienie (miss),
- przy chybieniu: sięgnij do \`_source.Load(id)\`, zserializuj wynik (System.Text.Json) i odłóż go do cache pod tym samym kluczem,
- przy trafieniu (hit): zdeserializuj to, co było w cache - źródła NIE dotykasz.

Stan startowy (RED): metoda rzuca \`NotImplementedException\`.

## Co zaobserwujesz

Dwa testy. Pierwszy: dwa razy \`GetAsync(1)\` -> \`Load\` wołane raz, oba wyniki to ten sam produkt (drugi odczyt schodzi z cache). Drugi: \`GetAsync(1)\` a potem \`GetAsync(2)\` -> \`Load\` wołane DWA razy, bo inny Id to osobny wpis. Wspólny klucz oblałby drugi test (oddałby produkt nr 1 pod dwójką).
    `,
    description: `
## Why it matters

The cache-aside pattern: instead of asking the source (database, external API) every time, you check the cache first and do the expensive read only on a miss. Here you do it on \`IDistributedCache\` - an abstraction that scales across many instances (e.g. Redis), but in exchange has NO \`GetOrCreate\`: it only holds bytes/strings under a key. You write the whole cycle by hand.

## Task

Registration (\`AddDistributedMemoryCache()\` - an in-memory \`IDistributedCache\` implementation, no Redis - plus \`AddSingleton<CachedProductService>()\`) is already DONE in \`Program.cs\`. NOTE: the \`CountAsync\` method next to it shows the same cache-aside cycle, but on a scalar (a count → string), without object serialization - look at its shape, but your \`GetAsync\` caches an OBJECT (JSON).

Your job is a single method: \`CachedProductService.GetAsync(int id)\` in \`Shop.Core/Catalog/CachedProductService.cs\`. Build the full cache-aside cycle MANUALLY:

- read from the cache by a UNIQUE per-Id key; a \`null\` value = a miss,
- on a miss: reach for \`_source.Load(id)\`, serialize the result (System.Text.Json) and store it in the cache under that same key,
- on a hit: deserialize what was in the cache - you do NOT touch the source.

Starting state (RED): the method throws \`NotImplementedException\`.

## What you will observe

Two tests. First: two \`GetAsync(1)\` -> \`Load\` called once, both results the same product (the second read comes off the cache). Second: \`GetAsync(1)\` then \`GetAsync(2)\` -> \`Load\` called TWICE, because a different Id is a separate entry. A shared key would fail the second test (it would serve product #1 under id 2).
    `,
    hintPl: 'Kolejność: zbuduj klucz per Id, odczytaj string z cache; jeśli jest (hit) - zdeserializuj i zwróć, nie ruszając źródła. Jeśli null (miss) - załaduj ze źródła, zserializuj (System.Text.Json) i zapisz pod kluczem, potem zwróć. Zwróć uwagę, że \`Load\` może dać \`null\` - wtedy nie ma czego cache\'ować. \`CountAsync\` obok pokazuje ten sam cykl na skalarze (bez serializacji obiektu).',
    hint: 'Order: build the per-Id key, read the string from the cache; if present (hit) - deserialize and return without touching the source. If null (miss) - load from the source, serialize (System.Text.Json) and store under the key, then return. Note \`Load\` may yield \`null\` - then there is nothing to cache. \`CountAsync\` next to it shows the same cycle on a scalar (without object serialization).',
    solution: `public async Task<Product?> GetAsync(int id)
{
    var key = $"product:{id}";

    var cached = await _cache.GetStringAsync(key);
    if (cached is not null)
        return JsonSerializer.Deserialize<Product>(cached);

    var product = await _source.Load(id);
    if (product is not null)
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(product));
    return product;
}`,
    solutionExplanationPl: '\`IDistributedCache\` nie ma \`GetOrCreate\`, więc cykl piszesz sam: \`GetStringAsync\` zwraca \`null\` przy chybieniu, wtedy ładujesz ze źródła, serializujesz obiekt do JSON i zapisujesz przez \`SetStringAsync\` pod unikalnym kluczem \`product:{id}\` - dlatego \`Load\` wykonuje się raz na Id, a różne Id to osobne wpisy. Serializacja jest konieczna, bo distributed cache trzyma bajty/stringi, nie obiekty .NET. W realu do \`SetStringAsync\` dokłada się \`DistributedCacheEntryOptions\` (np. \`AbsoluteExpirationRelativeToNow\`), żeby wpis nie żył wiecznie. Ta abstrakcja skaluje się na wiele instancji (Redis, SQL Server) - w odróżnieniu od \`IMemoryCache\`, który żyje w jednym procesie.',
    solutionExplanation: '\`IDistributedCache\` has no \`GetOrCreate\`, so you write the cycle yourself: \`GetStringAsync\` returns \`null\` on a miss, then you load from the source, serialize the object to JSON and store it via \`SetStringAsync\` under the unique \`product:{id}\` key - so \`Load\` runs once per Id and different Ids are separate entries. Serialization is required because a distributed cache holds bytes/strings, not .NET objects. In production you pass \`DistributedCacheEntryOptions\` (e.g. \`AbsoluteExpirationRelativeToNow\`) to \`SetStringAsync\` so the entry does not live forever. This abstraction scales across many instances (Redis, SQL Server) - unlike \`IMemoryCache\`, which lives in a single process.',
    testFilter: 'FullyQualifiedName~Exercises.Tests.CachedProductServiceTests',
    relatedFiles: [
      'dzien2-ekosystem/cwiczenia/src/Shop.Core/Catalog/CachedProductService.cs',
      'dzien2-ekosystem/cwiczenia/src/Shop.Api/Program.cs',
      'dzien2-ekosystem/cwiczenia/tests/Exercises.Tests/Catalog/CachedProductServiceTests.cs',
    ],
  },
];
