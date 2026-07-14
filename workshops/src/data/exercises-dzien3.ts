import type { Exercise } from '../types/Exercise';

// Dzień 3 - Narzędzia i developer experience.
// Oś dnia to nie cykl komend dotnet (to był Dzień 2), lecz praca EMPIRYCZNA
// narzędziami wokół wspólnego subjectu `src/Shop`: rozgrzewka 00_RECAP ->
// 01_CLI -> 02_IL -> 03_DEBUG -> 04_DIAG -> 05_TESTY -> 06_NUGET.
//
// Model zaliczania w apce:
//  - RED->GREEN napędzają TestRunner (zielony = zaliczone): RecapWarmupTests,
//    InvoiceRoundingTests, OrdersReportTimeBudgetTests, PureLogicTheoryStub,
//    DiscountTheoryStub, MockVerifyStub, ProductEndpointStub, CheckoutWafStub,
//    RaceOnSingletonTests, PackableConsumerTests.
//  - Wzorzec GREEN-od-startu (uruchom i potwierdź idiom): CheckoutWafExample.
//  - Reszta jest tool-driven (terminal / SharpLab / ILSpy / debugger / profiler /
//    pack) - kończona przyciskiem "Ukończono zadanie".
//
// Baseline całego Dzien3.sln przed rozwiązaniami: Passed 27 / Failed 13 / Skipped 1.
// Czerwień jest ZAMIERZONA - to lista zadań na dziś, nie regresja.

export const dzien3Exercises: Exercise[] = [
  // ===================================================================
  // ROZGRZEWKA 00_RECAP - odtwórz mały flow z Dnia 2
  // ===================================================================
  {
    id: 'd3-exercise-00',
    sequenceNumber: 1,
    title: 'Warm-up: rebuild a small Day 2 flow',
    titlePl: 'Rozgrzewka: odtwórz mały flow z Dnia 2',
    category: '00_RECAP: warm-up',
    categoryPl: '00_RECAP: rozgrzewka',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Zanim wejdziemy w narzędzia Dnia 3, rozgrzewka: odtwarzasz mały flow z Dnia 2 przez WSZYSTKIE warstwy - middleware zapisuje daną żądania do serwisu Scoped, serwis (przez DI) czyta ją i zapisuje przez EF Core. Sedno: NIE upychać wszystkiego w lambdzie endpointu - spinasz middleware + DI + serwis + bazę jak w prawdziwej apce.

## Zadanie

Gotowe i nietykalne: klasa \`CorrelationAccessor\` (Scoped, trzyma \`CorrelationId\`, JUŻ zarejestrowana), encja \`AuditEntry\` + \`DbSet<AuditEntry>\` w \`ShopContext\`, \`GET /audit\` (lista). Do uzupełnienia masz PUSTE szkielety: middleware \`CorrelationMiddleware\` (samo \`await next\`) i serwis \`AuditService\` (rzuca \`NotImplementedException\`).

Do zrobienia (RED → GREEN) - pięć spięć:
1. **Middleware** - w \`CorrelationMiddleware.InvokeAsync\` odczytaj nagłówek \`X-Correlation-Id\` i zapisz jego wartość do \`correlation.CorrelationId\` (przy braku nagłówka - wygeneruj \`Guid\`).
2. **Rejestracja middleware** - w \`Program.cs\`: \`app.UseMiddleware<CorrelationMiddleware>()\` (po \`app.UseRequestId()\`).
3. **Rejestracja serwisu (DI)** - \`builder.Services.AddScoped<AuditService>()\`.
4. **Serwis** - w \`AuditService.RecordAsync\` zbuduj \`AuditEntry\` z \`correlation.CorrelationId\` + akcji i zapisz przez \`SaveChangesAsync\`.
5. **Endpoint** - wepnij \`POST /audit\` (dziś stub \`501\`): wstrzyknij \`AuditService\`, zawołaj \`RecordAsync\`, zwróć \`201 Created\`.

Test: \`dotnet test --filter "FullyQualifiedName~RecapWarmupTests"\` (WAF, środowisko "Testing"). Uruchom w panelu, aż ZIELONY.
    `,
    description: `
## Why it matters

Before diving into Day 3 tooling, a warm-up: you rebuild a small Day 2 flow through ALL the layers - the middleware writes request data into a Scoped service, the service (via DI) reads it and saves via EF Core. The point: do NOT cram everything into the endpoint lambda - wire middleware + DI + service + database like in a real app.

## Task

Ready and untouched: the \`CorrelationAccessor\` class (Scoped, holds \`CorrelationId\`, ALREADY registered), the \`AuditEntry\` entity + \`DbSet<AuditEntry>\` in \`ShopContext\`, \`GET /audit\` (the list). You get EMPTY skeletons to fill: the \`CorrelationMiddleware\` (just \`await next\`) and the \`AuditService\` (throws \`NotImplementedException\`).

To do (RED → GREEN) - five wirings:
1. **Middleware** - in \`CorrelationMiddleware.InvokeAsync\` read the \`X-Correlation-Id\` header and write its value into \`correlation.CorrelationId\` (if missing - generate a \`Guid\`).
2. **Register the middleware** - in \`Program.cs\`: \`app.UseMiddleware<CorrelationMiddleware>()\` (after \`app.UseRequestId()\`).
3. **Register the service (DI)** - \`builder.Services.AddScoped<AuditService>()\`.
4. **Service** - in \`AuditService.RecordAsync\` build an \`AuditEntry\` from \`correlation.CorrelationId\` + the action and save via \`SaveChangesAsync\`.
5. **Endpoint** - wire the \`POST /audit\` handler (today a \`501\` stub): inject \`AuditService\`, call \`RecordAsync\`, return \`201 Created\`.

Test: \`dotnet test --filter "FullyQualifiedName~RecapWarmupTests"\` (WAF, "Testing" environment). Run it in the panel until GREEN.
    `,
    hintPl: '\`CorrelationAccessor\` jest **Scoped**, więc middleware i \`AuditService\` w JEDNYM żądaniu dostają TĘ SAMĄ instancję (middleware pisze, serwis czyta) - dlatego nie potrzebujesz \`IHttpContextAccessor\`. Middleware dostaje \`CorrelationAccessor\` przez parametr \`InvokeAsync\` (method injection). Nagłówek czytasz: \`context.Request.Headers["X-Correlation-Id"].FirstOrDefault()\`. Bez \`app.UseMiddleware<CorrelationMiddleware>()\` middleware nie działa, a bez \`AddScoped<AuditService>()\` endpoint nie wstrzyknie serwisu.',
    hint: '\`CorrelationAccessor\` is **Scoped**, so the middleware and \`AuditService\` get the SAME instance within one request (the middleware writes, the service reads) - that is why you do not need \`IHttpContextAccessor\`. The middleware receives \`CorrelationAccessor\` via an \`InvokeAsync\` parameter (method injection). Read the header with \`context.Request.Headers["X-Correlation-Id"].FirstOrDefault()\`. Without \`app.UseMiddleware<CorrelationMiddleware>()\` the middleware does not run, and without \`AddScoped<AuditService>()\` the endpoint cannot inject the service.',
    solution: `// src/Shop/Middleware/CorrelationMiddleware.cs — odczyt nagłówka → zapis do Scoped accessora
public async Task InvokeAsync(HttpContext context, CorrelationAccessor correlation)
{
    var correlationId = context.Request.Headers["X-Correlation-Id"].FirstOrDefault();
    correlation.CorrelationId = string.IsNullOrEmpty(correlationId)
        ? Guid.NewGuid().ToString("N")
        : correlationId;

    await next(context);
}

// src/Shop/Audit/AuditService.cs — czyta z accessora (DI), zapisuje przez EF Core
public async Task<AuditEntry> RecordAsync(string action)
{
    var entry = new AuditEntry { CorrelationId = correlation.CorrelationId, Action = action };
    db.AuditEntries.Add(entry);
    await db.SaveChangesAsync();
    return entry;
}

// src/Shop/Program.cs — wpięcie middleware + rejestracja serwisu + endpoint (CorrelationAccessor już zarejestrowany)
app.UseMiddleware<CorrelationMiddleware>();          // po app.UseRequestId()
builder.Services.AddScoped<AuditService>();

app.MapPost("/audit", async (AuditRequest request, AuditService audit) =>
{
    var entry = await audit.RecordAsync(request.Action);
    return Results.Created($"/audit/{entry.Id}", entry);
});`,
    solutionExplanationPl: 'Recap Dnia 2 przez WARSTWY, a nie upchnięty w lambdę. Middleware (\`CorrelationMiddleware\`) odczytuje nagłówek \`X-Correlation-Id\` i zapisuje go do \`CorrelationAccessor\` - klasy **Scoped**, więc w obrębie jednego żądania to TA SAMA instancja, którą potem czyta \`AuditService\`. Serwis (wstrzyknięty przez DI, \`AddScoped\`) bierze \`CorrelationId\` z accessora, buduje \`AuditEntry\` i zapisuje przez EF Core; endpoint tylko deleguje. \`CorrelationAccessor\` (Scoped) zastępuje \`IHttpContextAccessor\` - middleware pisze, serwis czyta, bez zależności serwisu od \`HttpContext\`. \`RecapWarmupTests\` wysyła \`POST /audit\` z \`X-Correlation-Id: rozgrzewka-1\`, potem \`GET /audit\` sprawdza wpis. Test zielony DOPIERO, gdy spięte wszystkie warstwy: middleware (napisany + zarejestrowany), serwis (napisany + zarejestrowany) i endpoint - pominięcie któregokolwiek zostawia go czerwonym.',
    solutionExplanation: 'A recap of the Day 2 flow through the LAYERS, not crammed into a lambda. The middleware (\`CorrelationMiddleware\`) reads the \`X-Correlation-Id\` header and writes it into \`CorrelationAccessor\` - a **Scoped** class, so within one request it is the SAME instance the \`AuditService\` reads back. The service (injected via DI, \`AddScoped\`) takes \`CorrelationId\` from the accessor, builds an \`AuditEntry\` and saves via EF Core; the endpoint only delegates. \`CorrelationAccessor\` (Scoped) replaces \`IHttpContextAccessor\` - the middleware writes, the service reads, with no service dependency on \`HttpContext\`. \`RecapWarmupTests\` sends \`POST /audit\` with \`X-Correlation-Id: rozgrzewka-1\`, then \`GET /audit\` checks the entry. The test goes green ONLY once every layer is wired: the middleware (written + registered), the service (written + registered) and the endpoint - skipping any one leaves it red.',
    externalLink: 'https://learn.microsoft.com/aspnet/core/fundamentals/middleware/',
    externalLinkLabel: 'ASP.NET Core middleware',
    externalLinkLabelPl: 'ASP.NET Core: middleware',
    testFilter: 'FullyQualifiedName~Exercises.Tests._00_RECAP.RecapWarmupTests',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Shop/Middleware/CorrelationMiddleware.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Correlation/CorrelationAccessor.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Audit/AuditService.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Program.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Data/ShopContext.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/00_RECAP/RecapWarmupTests.cs',
    ],
  },

  // ===================================================================
  // 01_CLI - dev loop + brakująca referencja projektowa (jedno ćwiczenie)
  // ===================================================================
  {
    id: 'd3-exercise-01',
    sequenceNumber: 2,
    title: 'The dev loop and a reference the test needs',
    titlePl: 'Pętla developera i referencja, bez której test się nie kompiluje',
    category: '01_CLI: dev loop',
    categoryPl: '01_CLI: pętla developera',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

\`dotnet\` to jedno wejście do całego SDK: tworzenie, budowanie, uruchamianie i testowanie to podkomendy jednego polecenia, działające tak samo lokalnie i na CI. Realne repo to graf projektów spiętych referencjami - a projekt testowy widzi kod produkcyjny TYLKO wtedy, gdy istnieje referencja projektowa (\`<ProjectReference>\`).

## Zadanie

Zestaw \`src/01_cli\` (biblioteka \`Greetings\` + \`Greetings.Tests\`) jest CELOWO trzymany POZA \`Dzien3.sln\`, więc sprawdzasz go w TERMINALU. Startuje na CZERWONO: w \`Greetings.Tests.csproj\` BRAKUJE referencji do \`Greetings\`, więc test się nie kompiluje.

\`\`\`bash
cd src/01_cli
dotnet run --project Greetings                       # uruchamialna konsola -> "Cześć, świecie!"
dotnet test Greetings.Tests/Greetings.Tests.csproj   # RED: error CS0103: 'Greeter' does not exist
dotnet add Greetings.Tests/Greetings.Tests.csproj reference Greetings/Greetings.csproj
dotnet test Greetings.Tests/Greetings.Tests.csproj   # GREEN
\`\`\`

Po zieleni (opcjonalnie) domknij pętlę na żywo: \`dotnet watch --project Greetings.Tests test\` i zmień powitanie w \`Greeter.cs\`. Na koniec kliknij "Ukończono zadanie".
    `,
    description: `
## Why it matters

\`dotnet\` is a single entry point to the whole SDK: creating, building, running and testing are subcommands of one command, the same locally and on CI. A real repo is a graph of projects wired by references - and a test project sees production code ONLY when a project reference (\`<ProjectReference>\`) exists.

## Task

The \`src/01_cli\` set (the \`Greetings\` library + \`Greetings.Tests\`) is deliberately kept OUTSIDE \`Dzien3.sln\`, so you verify it in the TERMINAL. It starts RED: \`Greetings.Tests.csproj\` is MISSING the reference to \`Greetings\`, so the test does not compile.

\`\`\`bash
cd src/01_cli
dotnet run --project Greetings                       # runnable console -> "Cześć, świecie!"
dotnet test Greetings.Tests/Greetings.Tests.csproj   # RED: error CS0103: 'Greeter' does not exist
dotnet add Greetings.Tests/Greetings.Tests.csproj reference Greetings/Greetings.csproj
dotnet test Greetings.Tests/Greetings.Tests.csproj   # GREEN
\`\`\`

Once green, optionally close the loop live: \`dotnet watch --project Greetings.Tests test\` and change the greeting in \`Greeter.cs\`. Then click "Task done".
    `,
    hintPl: 'Ścieżki w \`dotnet add ... reference\` są względem katalogu, z którego uruchamiasz komendę - z \`src/01_cli\` podaj pełne csproj: \`Greetings.Tests/Greetings.Tests.csproj\` i \`Greetings/Greetings.csproj\`. "Czerwony" tu znaczy "nie kompiluje się" (\`CS0103\`), a nie "asercja padła".',
    hint: 'Paths in \`dotnet add ... reference\` are relative to the directory you run the command from - from \`src/01_cli\` give full csproj paths: \`Greetings.Tests/Greetings.Tests.csproj\` and \`Greetings/Greetings.csproj\`. "Red" here means "does not compile" (\`CS0103\`), not "an assertion failed".',
    solutionExplanationPl: 'Cała codzienna pętla (uruchom, buduj, testuj) to podkomendy jednego \`dotnet\`; \`run\` woła build, build woła restore. Projekt testowy kompiluje się względem swoich referencji: bez \`<ProjectReference>\` do \`Greetings\` typ \`Greeter\` jest niewidoczny i build pada (\`CS0103\`). \`dotnet add ... reference\` tworzy krawędź grafu, która wyznacza też kolejność budowania. Dla grupy z PHP/JS: w .NET graf zależności między projektami jest jawny i sprawdzany statycznie - brak referencji to błąd kompilacji, nie "undefined at runtime".',
    solutionExplanation: 'The whole daily loop (run, build, test) is subcommands of one \`dotnet\`; \`run\` calls build, build calls restore. A test project compiles against its references: without a \`<ProjectReference>\` to \`Greetings\` the \`Greeter\` type is invisible and the build fails (\`CS0103\`). \`dotnet add ... reference\` creates the graph edge that also drives build order. For a PHP/JS crowd: in .NET the project dependency graph is explicit and statically checked - a missing reference is a compile error, not "undefined at runtime".',
    externalLink: 'https://learn.microsoft.com/dotnet/core/tools/dotnet-add-reference',
    externalLinkLabel: 'dotnet add reference',
    externalLinkLabelPl: 'Dokumentacja dotnet add reference',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/01_cli/Greetings/Program.cs',
      'dzien3-narzedzia/cwiczenia/src/01_cli/Greetings/Greeter.cs',
      'dzien3-narzedzia/cwiczenia/src/01_cli/Greetings.Tests/GreeterTests.cs',
      'dzien3-narzedzia/cwiczenia/src/01_cli/README-cwiczenie.md',
    ],
  },

  // ===================================================================
  // 02_IL - kompilacja, lowering, IL (predict-then-check)
  // ===================================================================
  {
    id: 'd3-exercise-02',
    sequenceNumber: 3,
    title: 'What the compiler writes for you (lowering)',
    titlePl: 'Co kompilator dopisuje za Ciebie (lowering)',
    category: '02_IL: compilation and IL',
    categoryPl: '02_IL: kompilacja i IL',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Build to nie przepisanie C# jeden do jednego. Część konstrukcji języka to lukier składniowy, który kompilator rozwija (lowering) i dopisuje kod, którego nie widać w źródle. Ten sam artefakt (\`.dll\` + metadane) obejrzysz zaraz pod debuggerem na cudzej bibliotece w ĆW 03.

## Zadanie

Predict-then-check: ZAPISZ przewidywania, ZANIM uruchomisz demo:

\`\`\`bash
dotnet run --project src/02_il/IlDemo
\`\`\`

Weź na warsztat dwa pliki (jeden koncept na plik - w podglądzie IL patrzysz na jeden naraz):
- \`src/02_il/IlDemo/RecordVsClass.cs\` - jak porównują się dwa obiekty o tych samych polach, gdy to \`record\`, a jak gdy \`class\`?
- \`src/02_il/IlDemo/ClosureCapture.cs\` - co przechwytują lambdy w pętli \`for\`, a co w \`foreach\`?

Najpierw zapisz odpowiedź. Potem sprawdź: uruchom demo i ten sam kod otwórz w **SharpLab** (prawy panel na **Results: C#**) oraz **ILSpy** - porównaj z tym, co przewidziałeś.
    `,
    description: `
## Why it matters

A build is not a one-to-one rewrite of C#. Several language constructs are syntactic sugar the compiler expands (lowering), writing code you never see in the source. You will inspect the same artifact (\`.dll\` + metadata) under the debugger on someone else's library in exercise 03.

## Task

Predict-then-check: WRITE your predictions BEFORE running the demo:

\`\`\`bash
dotnet run --project src/02_il/IlDemo
\`\`\`

Take two files (one concept per file - the IL viewer shows one at a time):
- \`src/02_il/IlDemo/RecordVsClass.cs\` - how do two objects with identical fields compare when it is a \`record\`, and how when a \`class\`?
- \`src/02_il/IlDemo/ClosureCapture.cs\` - what do the lambdas capture in a \`for\` loop, and what in \`foreach\`?

Write your answer first. Then check: run the demo and open the same code in **SharpLab** (right pane set to **Results: C#**) and **ILSpy** - compare with what you predicted.
    `,
    hintPl: 'W SharpLab przełącz prawy panel na "Results: C#", żeby zobaczyć kod PO obniżeniu (lowering), a nie surowy IL. Dla \`record\` szukaj syntetycznego \`Equals\`/\`op_Equality\`, dla domknięcia - klasy \`<>c__DisplayClass\`. Porównaj lambdę w \`for\` (jedno wspólne \`i\`) z lambdą w \`foreach\` (świeża zmienna na iterację).',
    hint: 'In SharpLab switch the right pane to "Results: C#" to see the lowered code, not raw IL. For a \`record\` look for the synthetic \`Equals\`/\`op_Equality\`, for the closure - the \`<>c__DisplayClass\` class. Compare the \`for\` lambda (one shared \`i\`) with the \`foreach\` lambda (a fresh variable per iteration).',
    solutionExplanationPl: 'Lowering to etap, na którym kompilator zamienia wygodne konstrukcje na pełną postać przed wygenerowaniem IL. Stąd \`record\` ma gotowe porównanie wartościowe (inne \`Equals\`/\`GetHashCode\` niż zwykła klasa), a domknięcie chwyta zmienną przez referencję: w \`for\` wszystkie lambdy widzą tę samą, współdzieloną \`i\` (po pętli równą \`3\`), a w \`foreach\` kompilator daje świeżą zmienną iteracyjną, więc każda lambda pamięta własną wartość (\`0, 1, 2\`). Ta wiedza tłumaczy zachowania i alokacje, które widać potem w runtime i w debuggerze.',
    solutionExplanation: 'Lowering is the stage where the compiler turns convenient constructs into their full form before emitting IL. Hence a \`record\` ships value equality (different \`Equals\`/\`GetHashCode\` than a plain class), and a closure captures the variable by reference: in \`for\` all lambdas see the same shared \`i\` (equal to \`3\` after the loop), while in \`foreach\` the compiler gives a fresh iteration variable, so each lambda remembers its own value (\`0, 1, 2\`). This knowledge explains behaviour and allocations you later see at runtime and in the debugger.',
    externalLink: 'https://sharplab.io/',
    externalLinkLabel: 'Open SharpLab',
    externalLinkLabelPl: 'Otwórz SharpLab',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/02_il/IlDemo/RecordVsClass.cs',
      'dzien3-narzedzia/cwiczenia/src/02_il/IlDemo/ClosureCapture.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/02_IL/IlObservationsTests.cs',
    ],
  },

  // ===================================================================
  // 03_DEBUG - debugger + step-into cudzej .dll (RED -> GREEN)
  // ===================================================================
  {
    id: 'd3-exercise-03',
    sequenceNumber: 4,
    title: 'Debug a wrong invoice + step into external .dll',
    titlePl: 'Zły wynik faktury + wejście (F11) w cudzą .dll',
    category: '03_DEBUG: debugger',
    categoryPl: '03_DEBUG: debugger',
    timeMinutes: 18,
    descriptionPl: `
## Po co to

Nie każdy błąd widać przez lekturę kodu, zwłaszcza gdy defekt siedzi na styku Twojego kodu i cudzej biblioteki bez źródeł. Trzeba zatrzymać żywe wykonanie i podejrzeć wartości pośrednie - a przy potrzebie WEJŚĆ debuggerem do zdekompilowanej, cudzej \`.dll\`. **Bez \`Console.WriteLine\`.**

## Zadanie

Subject: \`InvoiceRounding.FinalAmount\` (\`src/Shop/Pricing/InvoiceRounding.cs\`) - Twój kod, który deleguje zaokrąglenie do zewnętrznej biblioteki \`Contoso.Legacy.dll\` (bez PDB, więc debugger ją ZDEKOMPILUJE). Test \`InvoiceRoundingTests\` jest CZERWONY dla hurtu (\`quantity\` 100 i 250) - kwota jest zaniżona.

1. Postaw breakpoint w \`FinalAmount\` i uruchom TYLKO ten test w Debug (albo endpoint na żywo: \`GET /invoice?net=199.99&quantity=100\`, profil ".vscode" "Shop - F11 do środka .NET (Just My Code OFF)").
2. W Locals podejrzyj wartość \`tier\` dla hurtu.
3. Naciśnij **F11** (Just My Code OFF) - debugger wchodzi w ZDEKOMPILOWANY \`RoundToTier\` w \`Contoso.Legacy.dll\` i pokazuje, co robi gałąź dla tego \`tier\`.
4. Napraw defekt we WŁASNYM kodzie (\`FinalAmount\`) tak, żeby hurt dostawał to samo zaokrąglenie co detal.

Test: \`dotnet test --filter "FullyQualifiedName~InvoiceRoundingTests"\`.
    `,
    description: `
## Why it matters

Not every bug is visible by reading code, especially when the defect sits at the seam between your code and a third-party library with no sources. You must stop live execution and inspect intermediate values - and when needed STEP into a decompiled external \`.dll\`. **No \`Console.WriteLine\`.**

## Task

Subject: \`InvoiceRounding.FinalAmount\` (\`src/Shop/Pricing/InvoiceRounding.cs\`) - your code delegating rounding to the external \`Contoso.Legacy.dll\` (no PDB, so the debugger DECOMPILES it). The \`InvoiceRoundingTests\` test is RED for wholesale (\`quantity\` 100 and 250) - the amount comes out too low.

1. Set a breakpoint in \`FinalAmount\` and run ONLY that test in Debug (or the live endpoint: \`GET /invoice?net=199.99&quantity=100\`, the ".vscode" profile "Shop - F11 do środka .NET (Just My Code OFF)").
2. In Locals inspect \`tier\` for wholesale.
3. Press **F11** (Just My Code OFF) - the debugger steps into the DECOMPILED \`RoundToTier\` in \`Contoso.Legacy.dll\` and shows what the branch for that \`tier\` does.
4. Fix the defect in YOUR code (\`FinalAmount\`) so wholesale gets the same rounding as retail.

Test: \`dotnet test --filter "FullyQualifiedName~InvoiceRoundingTests"\`.
    `,
    hintPl: 'Defekt jest we WŁASNYM kodzie \`FinalAmount\`, nie w cudzej bibliotece - \`RoundToTier\` robi dokładnie to, co mu każesz przez \`tier\`. Podejrzyj w Locals, jaki \`tier\` dostaje hurt (\`quantity >= 100\`) i porównaj z detalem. F11 (Just My Code OFF) służy do POTWIERDZENIA, co robi cudza gałąź - nie do zmiany jej kodu.',
    hint: 'The defect is in YOUR \`FinalAmount\`, not the external library - \`RoundToTier\` does exactly what you tell it via \`tier\`. Inspect in Locals what \`tier\` wholesale (\`quantity >= 100\`) gets and compare with retail. F11 (Just My Code OFF) is for CONFIRMING what the external branch does - not for changing its code.',
    solution: `public decimal FinalAmount(decimal net, int quantity)
{
    // BYŁO: var tier = quantity >= 100 ? 7 : 1;  // hurt trafiał w "legacy" tier 7
    var tier = 1;                                  // hurt też ma dostać zaokrąglenie handlowe
    return _money.RoundToTier(net, tier);
}`,
    solutionExplanationPl: 'Statyczne czytanie nie wystarcza, bo \`RoundToTier\` jest w \`Contoso.Legacy.dll\` bez źródeł. Breakpoint w \`FinalAmount\` i \`tier = 7\` w Locals dla hurtu prowadzą do F11 (JMC OFF): debugger wchodzi w zdekompilowany \`RoundToTier\` i widać gałąź \`7\`, która robi coś w rodzaju \`Math.Floor(kwota) - 0.99\` i zaniża wynik. Naprawa jest we WŁASNYM kodzie - usuń gałąź \`quantity >= 100 ? 7 : 1\`, żeby hurt też dostał \`tier = 1\`. Detal (\`qty 10\`) był zielony od startu; po zmianie oba przypadki hurtowe (\`qty 100\`, \`qty 250\`) też zielenieją.',
    solutionExplanation: 'Static reading is not enough, because \`RoundToTier\` lives in \`Contoso.Legacy.dll\` with no sources. A breakpoint in \`FinalAmount\` and \`tier = 7\` in Locals for wholesale lead to F11 (JMC OFF): the debugger steps into the decompiled \`RoundToTier\` and shows the \`7\` branch doing something like \`Math.Floor(amount) - 0.99\` that lowers the result. The fix is in YOUR code - remove the \`quantity >= 100 ? 7 : 1\` branch so wholesale also gets \`tier = 1\`. Retail (\`qty 10\`) was green from the start; after the change both wholesale cases (\`qty 100\`, \`qty 250\`) go green too.',
    externalLink: 'https://learn.microsoft.com/dotnet/standard/library-guidance/sourcelink',
    externalLinkLabel: 'Source Link (step into external sources)',
    externalLinkLabelPl: 'Source Link (wejście w cudze źródła)',
    testFilter: 'FullyQualifiedName~Exercises.Tests._03_DEBUG.InvoiceRoundingTests',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Shop/Pricing/InvoiceRounding.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/03_DEBUG/InvoiceRoundingTests.cs',
      'dzien3-narzedzia/cwiczenia/.vscode/launch.json',
    ],
  },

  // ===================================================================
  // 04_DIAG - diagnostyka (kolejnosc jak na slajdach): trace (obowiazkowy pomiar) -> benchmark -> N+1 (obowiazkowe, po POZIOMY LOGOWANIA)
  // ===================================================================
  {
    id: 'd3-exercise-05',
    sequenceNumber: 5,
    title: 'Find the hot path (dotnet-trace)',
    titlePl: 'Znajdź gorącą ścieżkę (dotnet-trace)',
    category: '04_DIAG: diagnostics',
    categoryPl: '04_DIAG: diagnostyka',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

Zamiast zgadywać, gdzie kod spędza czas, zbierasz ślad CPU i czytasz flame graph - profiler sam wskazuje najszerszą ramkę. Na demie widziałeś, jak się to czyta; teraz robisz to OD ZERA i sprawdzasz, że Twój fix faktycznie ścina ten słupek.

## Zadanie

Zainstaluj narzędzie (raz na maszynę) i zbierz ślad z gorącej konsoli \`src/TraceDemo\`:

\`\`\`bash
dotnet tool install -g dotnet-trace
dotnet build src/TraceDemo -c Release
# UWAGA: traceuj PROCES aplikacji (zbudowany .dll), nie "dotnet run" - inaczej speedscope jest pusty
dotnet-trace collect --format Speedscope -- dotnet src/TraceDemo/bin/Release/net10.0/TraceDemo.dll
# otwórz plik .speedscope.json na speedscope.app
\`\`\`

Otwórz \`.speedscope.json\` na speedscope.app i znajdź najszerszą ramkę (jak czytać flame graph - masz na demie). Popraw wskazaną przez nią naiwną metodę w \`src/TraceDemo/Hot.cs\`, a potem zbierz ślad PONOWNIE.
    `,
    description: `
## Why it matters

Instead of guessing where the code spends time, you collect a CPU trace and read a flame graph - the profiler itself points at the widest frame. On the demo you saw how to read it; now you do it FROM SCRATCH and confirm your fix actually cuts that bar down.

## Task

Install the tool (once per machine) and collect a trace from the hot console \`src/TraceDemo\`:

\`\`\`bash
dotnet tool install -g dotnet-trace
dotnet build src/TraceDemo -c Release
# NOTE: trace the app PROCESS (the built .dll), not "dotnet run" - otherwise speedscope is empty
dotnet-trace collect --format Speedscope -- dotnet src/TraceDemo/bin/Release/net10.0/TraceDemo.dll
# open the .speedscope.json file at speedscope.app
\`\`\`

Open \`.speedscope.json\` at speedscope.app and find the widest frame (how to read a flame graph - see the demo). Fix the naive method it points to in \`src/TraceDemo/Hot.cs\`, then collect the trace AGAIN.
    `,
    hintPl: 'MUSI być \`-c Release\` - w Debug optymalizacje są wyłączone i ślad kłamie. Najszersza ramka to rekurencyjna WIEŻA \`SlowFib\` (naiwne Fibonacci woła się wykładniczo). Fix: policz to samo Fibonacci ITERACYJNIE (jedna pętla, dwie zmienne \`a, b\`) - wieża zapada się do cienkiej ramki (~⅕, nadal widoczna, tylko już nie dominuje). Dowodem jest flame graph, nie test.',
    hint: 'It MUST be \`-c Release\` - in Debug optimizations are off and the trace lies. The widest frame is the recursive TOWER of \`SlowFib\` (naive Fibonacci calls itself exponentially). Fix: compute the same Fibonacci ITERATIVELY (one loop, two variables \`a, b\`) - the tower collapses to a thin frame (~1/5, still visible, just no longer dominant). The proof is the flame graph, not a test.',
    solution: `// src/TraceDemo/Hot.cs — zamień naiwną rekursję na iterację: ten sam wynik, O(n) zamiast O(φⁿ).
// (nazwę SlowFib możesz zostawić — SumOfFib woła ją tak samo — albo przemianować)
[MethodImpl(MethodImplOptions.NoInlining)]
private static long SlowFib(int n)
{
    long a = 0, b = 1;
    for (var i = 0; i < n; i++)
    {
        (a, b) = (b, a + b);
    }

    return a;
}`,
    solutionExplanationPl: '\`dotnet-trace\` zbiera próbki stosu z żywego procesu, a speedscope rysuje je jako flame graph: szerokość ramki = udział w czasie CPU, a PION = stos wywołań. Naiwne rekurencyjne Fibonacci (\`SlowFib\`) woła się wykładniczo (O(φⁿ)), więc rysuje wysoką, szeroką rekurencyjną WIEŻĘ - najszerszą ramkę. Iteracyjne Fibonacci liczy dokładnie tę samą wartość w jednej pętli O(n): rekurencyjna wieża ZAPADA się do cienkiej ramki (~⅕, ~19% - nadal widoczna, tylko już nie dominuje), a najszersze stają się BuildLabels/ChecksumRows. Zweryfikowane empirycznie: ten sam wynik raportu, ~1050 ms -> ~180 ms (~6×). Nie ma tu RED->GREEN, bo dowodem jest flame graph, nie asercja.',
    solutionExplanation: '\`dotnet-trace\` samples the stack of a live process, and speedscope draws it as a flame graph: a frame\'s width is its share of CPU time, and the VERTICAL axis is the call stack. Naive recursive Fibonacci (\`SlowFib\`) calls itself exponentially (O(φⁿ)), so it draws a tall, wide recursive TOWER - the widest frame. Iterative Fibonacci computes exactly the same value in one O(n) loop: the recursive tower COLLAPSES to a thin frame (~1/5, ~19% - still visible, just no longer dominant), and BuildLabels/ChecksumRows become the widest. Verified empirically: the same report result, ~1050 ms -> ~180 ms (~6x). There is no RED->GREEN here because the proof is the flame graph, not an assertion.',
    externalLink: 'https://learn.microsoft.com/dotnet/core/diagnostics/dotnet-trace',
    externalLinkLabel: 'dotnet-trace guide',
    externalLinkLabelPl: 'Przewodnik dotnet-trace',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/TraceDemo/Hot.cs',
      'dzien3-narzedzia/cwiczenia/src/TraceDemo/Program.cs',
    ],
  },
  {
    id: 'd3-exercise-07',
    sequenceNumber: 6,
    title: 'Measure, do not guess (BenchmarkDotNet)',
    titlePl: 'Zmierz, nie zgaduj (BenchmarkDotNet)',
    category: '04_DIAG: diagnostics',
    categoryPl: '04_DIAG: diagnostyka',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

Intuicja o wydajności myli, a \`Stopwatch\` w pętli jest niewiarygodny (rozgrzewka JIT, GC, szum). BenchmarkDotNet robi to porządnie: rozgrzewa, powtarza, liczy statystykę i raportuje alokacje. Tu obalasz konkretny mit.

## Zadanie

\`src/Benchmarks/CountBenchmarks.cs\` jest PUSTĄ klasą - napisz benchmark od zera (wzorzec masz obok w \`StringBuildingBenchmarks.cs\`: atrybuty \`[MemoryDiagnoser]\`, \`[Benchmark]\`). Porównaj dwa sposoby liczenia elementów kolekcji: właściwość \`ICollection<T>.Count\` (np. \`_items.Count\`) kontra metodę LINQ \`.Count()\`. Odpal KONIECZNIE w Release:

\`\`\`bash
dotnet run --project src/Benchmarks -c Release -- --filter *Count*
\`\`\`

Sprawdź kolumny \`Mean\` i \`Allocated\`.
    `,
    description: `
## Why it matters

Performance intuition misleads, and a \`Stopwatch\` loop is unreliable (JIT warmup, GC, noise). BenchmarkDotNet does it properly: warms up, repeats, computes statistics and reports allocations. Here you bust a specific myth.

## Task

\`src/Benchmarks/CountBenchmarks.cs\` is an EMPTY class - write the benchmark from scratch (the pattern is next to it in \`StringBuildingBenchmarks.cs\`: the \`[MemoryDiagnoser]\`, \`[Benchmark]\` attributes). Compare two ways to count a collection's elements: the property \`ICollection<T>.Count\` (e.g. \`_items.Count\`) versus the LINQ method \`.Count()\`. Run in Release (MANDATORY):

\`\`\`bash
dotnet run --project src/Benchmarks -c Release -- --filter *Count*
\`\`\`

Check the \`Mean\` and \`Allocated\` columns.
    `,
    hintPl: 'Wzoruj się na \`StringBuildingBenchmarks.cs\`: klasa z \`[MemoryDiagnoser]\`, pola z przygotowaną kolekcją (np. \`List<int>\` jako \`ICollection<int>\`), dwie metody \`[Benchmark]\` - jedna czyta \`.Count\` (właściwość), druga woła \`.Count()\` (LINQ). Bez \`-c Release\` wyniki są bez wartości.',
    hint: 'Model it on \`StringBuildingBenchmarks.cs\`: a class with \`[MemoryDiagnoser]\`, fields with a prepared collection (e.g. \`List<int>\` as \`ICollection<int>\`), two \`[Benchmark]\` methods - one reads \`.Count\` (property), the other calls \`.Count()\` (LINQ). Without \`-c Release\` the results are meaningless.',
    solutionExplanationPl: 'BenchmarkDotNet izoluje pomiar od szumu (osobny proces, rozgrzewka, wiele iteracji, odrzucenie odstających), więc liczby da się cytować. Wynik jest kontrintuicyjny: \`.Count()\` na \`List<int>\` jest ~równie szybkie jak \`.Count\`, bo LINQ ma szybką ścieżkę - dla źródła implementującego \`ICollection<T>\` czyta gotowy licznik zamiast iterować. Mit "\`.Count()\` zawsze przechodzi całą kolekcję" pęka tylko dla kolekcji z licznikiem; na czystym \`IEnumerable<T>\` (np. z \`Where\`) \`.Count()\` faktycznie iteruje po wszystkim. To pomiar narzędziem, nie test.',
    solutionExplanation: 'BenchmarkDotNet isolates measurement from noise (separate process, warmup, many iterations, outlier rejection), so the numbers are quotable. The result is counterintuitive: \`.Count()\` on a \`List<int>\` is ~as fast as \`.Count\`, because LINQ has a fast path - for a source implementing \`ICollection<T>\` it reads the ready counter instead of iterating. The myth "\`.Count()\` always walks the whole collection" breaks only for collections with a counter; on a plain \`IEnumerable<T>\` (e.g. from \`Where\`) \`.Count()\` really does iterate over everything. This is a tool measurement, not a test.',
    externalLink: 'https://benchmarkdotnet.org/articles/overview.html',
    externalLinkLabel: 'BenchmarkDotNet overview',
    externalLinkLabelPl: 'BenchmarkDotNet - przegląd',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Benchmarks/CountBenchmarks.cs',
      'dzien3-narzedzia/cwiczenia/src/Benchmarks/StringBuildingBenchmarks.cs',
    ],
  },
  {
    id: 'd3-exercise-04',
    sequenceNumber: 7,
    title: 'Fit /orders-report into the time budget',
    titlePl: 'Zmieść /orders-report w budżecie czasu',
    category: '04_DIAG: diagnostics',
    categoryPl: '04_DIAG: diagnostyka',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Poprawny wynik potrafi ukrywać koszt wydajnościowy, który wychodzi dopiero pod presją czasu (budżet). Narzędzia (log, debugger, budżet czasu) MIERZĄ, gdzie ucieka czas; test PILNUJE, że poprawka nie zmienia zachowania.

## Zadanie

Endpoint \`GET /orders-report\` (\`src/Shop/Program.cs\`) zwraca poprawny wynik, ale test \`OrdersReportTimeBudgetTests\` (budżet 400 ms) jest CZERWONY - endpoint się w nim nie mieści. Znajdź, co zżera czas: domyślnie \`Shop.Loyalty\` loguje na \`Warning\` (cicho) - **podnieś go na \`Information\` w \`appsettings.json\`** i odpal endpoint: w logu zobaczysz N linii „Round-trip do usługi lojalnościowej" (jedna per zamówienie) - to N+1 PO HTTP. (Możesz też prześledzić endpoint debuggerem.) Usuń wąskie gardło i doprowadź test do ZIELONEGO. \`OrdersReportCorrectnessTests\` ma zostać zielony - poprawka nie może zmienić zachowania.
    `,
    description: `
## Why it matters

A correct result can still hide a performance cost that only shows under a time budget. The tools (log, debugger, time budget) MEASURE where the time goes; the test GUARDS that the fix does not change behaviour.

## Task

The \`GET /orders-report\` endpoint (\`src/Shop/Program.cs\`) returns a correct result, but the \`OrdersReportTimeBudgetTests\` test (400 ms budget) is RED - the endpoint does not fit. Find what eats the time: by default \`Shop.Loyalty\` logs at \`Warning\` (quiet) - **raise it to \`Information\` in \`appsettings.json\`** and hit the endpoint: the log shows N "Round-trip to the loyalty service" lines (one per order) - that is an N+1 OVER HTTP. (You can also step through the endpoint in a debugger.) Remove the bottleneck and get the test GREEN. \`OrdersReportCorrectnessTests\` must stay green - the fix must not change behaviour.
    `,
    hintPl: 'Nie ruszasz zapytania do bazy (\`Include(o => o.Customer)\` już jest) - problemem jest \`await loyalty.GetPointsAsync(order.CustomerId)\` w pętli. Zamień na jedno \`await loyalty.GetPointsBatchAsync(ids)\` PRZED pętlą mapującą i czytaj punkty z zwróconego słownika po \`CustomerId\`.',
    hint: 'You do not touch the DB query (\`Include(o => o.Customer)\` is already there) - the problem is \`await loyalty.GetPointsAsync(order.CustomerId)\` in the loop. Replace it with a single \`await loyalty.GetPointsBatchAsync(ids)\` BEFORE the mapping loop and read points from the returned dictionary by \`CustomerId\`.',
    solution: `app.MapGet("/orders-report", async (ShopContext db, ILoyaltyApi loyalty) =>
{
    var orders = await db.Orders.Include(o => o.Customer).ToListAsync();

    // JEDEN round-trip wsadowy zamiast N wywołań w pętli.
    var customerIds = orders.Select(o => o.CustomerId).Distinct().ToList();
    var points = await loyalty.GetPointsBatchAsync(customerIds);

    var report = orders.Select(order => new
    {
        orderId = order.Id,
        customer = order.Customer?.Name,
        points = points[order.CustomerId],
    });
    return Results.Ok(report);
});`,
    solutionExplanationPl: 'Naiwny endpoint wołał \`ILoyaltyApi.GetPointsAsync\` w pętli - jedno wywołanie po sieci na każde zamówienie (N+1 PO HTTP). Każdy round-trip kosztuje \`RoundTripMs = 200\` ms, więc 3 zamówienia to ~600 ms, ponad budżet 400 ms testu \`OrdersReportTimeBudgetTests\` - stąd RED. Jedno wsadowe \`GetPointsBatchAsync\` ściąga punkty wszystkich klientów w JEDNYM round-tripie (~200 ms), więc endpoint mieści się w budżecie. Dowód w logu (po podniesieniu \`Shop.Loyalty\` na \`Information\`): naiwny endpoint wypisuje N linii „Round-trip do usługi lojalnościowej: klient …", a wsadowy - JEDNĄ „Round-trip wsadowy: N klientów". To pomiar narzędziem (log / budżet czasu), nie test poprawności - dlatego \`OrdersReportCorrectnessTests\` celowo zostaje zielony po obu stronach zmiany.',
    solutionExplanation: 'The naive endpoint called \`ILoyaltyApi.GetPointsAsync\` in a loop - one network call per order (N+1 AFTER HTTP). Each round-trip costs \`RoundTripMs = 200\` ms, so 3 orders take ~600 ms, above the 400 ms budget of \`OrdersReportTimeBudgetTests\` - hence RED. One batch \`GetPointsBatchAsync\` fetches all customers\' points in ONE round-trip (~200 ms), so the endpoint fits the budget. Evidence in the log (after raising \`Shop.Loyalty\` to \`Information\`): the naive endpoint prints N "Round-trip to the loyalty service: customer …" lines, the batch one prints ONE "Batch round-trip: N customers". This is measured with a tool (log / time budget), not a correctness test - which is why \`OrdersReportCorrectnessTests\` deliberately stays green on both sides.',
    externalLink: 'https://learn.microsoft.com/dotnet/core/diagnostics/',
    externalLinkLabel: '.NET diagnostics tools',
    externalLinkLabelPl: 'Narzędzia diagnostyczne .NET',
    testFilter: 'FullyQualifiedName~Exercises.Tests._04_DIAG.OrdersReportTimeBudgetTests',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Shop/Program.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Loyalty/ILoyaltyApi.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/04_DIAG/OrdersReportTimeBudgetTests.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/04_DIAG/OrdersReportCorrectnessTests.cs',
    ],
  },

  // ===================================================================
  // 05_TESTY (5A) - poziom jednostkowy: student PISZE testy (stuby RED przez Assert.Fail)
  // ===================================================================
  {
    id: 'd3-exercise-08',
    sequenceNumber: 8,
    title: 'Write a [Theory] over pure logic',
    titlePl: 'Napisz [Theory] na czystej logice',
    category: '05_TESTY: you write tests',
    categoryPl: '05_TESTY: piszesz testy',
    timeMinutes: 9,
    descriptionPl: `
## Kontekst

Sprawdzasz \`OrderService.Place\` - serwis, który przyjmuje zamówienie i obciąża klienta. Reguła jest prosta: pobrana kwota = \`ilość × cena za sztukę\`. Czyli zamówienie na 2 sztuki po 50 zł ma obciążyć bramkę na **100 zł**, a 3 sztuki po 10 zł → **30 zł**. Osobno pilnujemy błędu: przy ilości \`0\` lub mniejszej \`Place\` rzuca \`ArgumentException\` i bramka nie jest wołana w ogóle.

Serwis nie robi żadnej prawdziwej płatności - dostaje bramkę \`IPaymentGateway\` przez konstruktor. Żeby podejrzeć, jaką kwotę policzył, podstawiasz pod tę bramkę własną prostą atrapę, która zapamiętuje ostatnią pobraną kwotę. Potem porównujesz ją z tym, co wyliczyłeś ręcznie.

To najprostszy rodzaj testu - czysta logika sprawdzana na wielu danych. Jeden \`[Theory]\` + kilka wierszy \`[InlineData(...)]\` to jeden test uruchamiany dla każdego wiersza, więc od razu widać, który przypadek się nie zgadza.

## Zadanie

- \`[Theory]\` z kilkoma \`[InlineData]\` (min. 2) na regule kwoty, np. \`(2, 50, 100)\` i \`(3, 10, 30)\` - kolejno ilość, cena, oczekiwana kwota,
- osobny \`[Fact]\`: \`Place\` z ilością \`0\` rzuca \`ArgumentException\`, a atrapa bramki pozostaje nietknięta.

Wzór parametryzacji masz w \`examples/ShippingTheoryExample.cs\`.
    `,
    description: `
## Why it matters

Day 3 inverts Day 2: YOU write the tests. The cheapest level is pure logic checked against many inputs. \`[Theory]\` with several \`[InlineData]\` is one test run per data set - the report shows exactly which case failed.

## Task

\`tests/Exercises.Tests/05_TESTY/stubs/PureLogicTheoryStub.cs\` starts RED via \`Assert.Fail(...)\` - the contract is "GREEN = you wrote it". Target: the amount rule in \`OrderService.Place\` (\`amount == Quantity * UnitPrice\`). \`OrderService\` receives \`IPaymentGateway\` via the constructor, so you substitute a recording fake (spy) that remembers the amount passed.

Remove \`Assert.Fail\` and write: (a) a \`[Theory]\`/\`[InlineData]\` over the amount rule (min. 2 cases), (b) a separate \`[Fact]\`: \`Place\` with \`Quantity <= 0\` throws \`ArgumentException\` (gateway not charged). The parametrization pattern is in \`examples/ShippingTheoryExample.cs\`. Run the test in the panel until GREEN.
    `,
    hintPl: 'Nagrywający fake to klasa implementująca \`IPaymentGateway\`, która w \`Charge(amount)\` zapamiętuje \`amount\` i zwraca \`true\`. Wstrzyknij go do \`new OrderService(fake)\`, wywołaj \`Place(new OrderRequest("Book", quantity, unitPrice))\` i sprawdź \`fake.LastAmount\`.',
    hint: 'The recording fake is a class implementing \`IPaymentGateway\` that in \`Charge(amount)\` records \`amount\` and returns \`true\`. Inject it into \`new OrderService(fake)\`, call \`Place(new OrderRequest("Book", quantity, unitPrice))\` and check \`fake.LastAmount\`.',
    solution: `private sealed class RecordingGateway : IPaymentGateway
{
    public decimal? LastAmount { get; private set; }
    public bool Charge(decimal amount) { LastAmount = amount; return true; }
}

[Theory]
[InlineData(2, 50, 100)]   // Quantity, UnitPrice, oczekiwana kwota
[InlineData(3, 10, 30)]
public void order_charges_quantity_times_unit_price(int quantity, decimal unitPrice, decimal expected)
{
    var gateway = new RecordingGateway();
    new OrderService(gateway).Place(new OrderRequest("Book", quantity, unitPrice));
    Assert.Equal(expected, gateway.LastAmount);
}

[Fact]
public void non_positive_quantity_is_rejected_without_charge()
{
    var gateway = new RecordingGateway();
    Assert.Throws<ArgumentException>(() =>
        new OrderService(gateway).Place(new OrderRequest("Book", 0, 50m)));
    Assert.Null(gateway.LastAmount);
}`,
    solutionExplanationPl: 'Czysta logika (\`amount = Quantity * UnitPrice\`) to idealny materiał na \`[Theory]\`: jedna metoda testowa, wiele \`[InlineData]\`. Zależność od \`IPaymentGateway\` (a nie od konkretnej bramki) pozwala podstawić nagrywającego fake\'a i sprawdzić, JAKĄ kwotę dostała bramka - bez prawdziwej płatności. Osobny \`[Fact]\` na \`Quantity <= 0\` pilnuje ścieżki błędu (wyjątek + brak obciążenia). Ręczny fake wystarcza tu do prostych przypadków; bogatszą weryfikację interakcji zrobisz mockiem w kolejnym zadaniu.',
    solutionExplanation: 'Pure logic (\`amount = Quantity * UnitPrice\`) is ideal for \`[Theory]\`: one test method, many \`[InlineData]\`. Depending on \`IPaymentGateway\` (not a concrete gateway) lets you substitute a recording fake and check WHAT amount the gateway received - with no real payment. A separate \`[Fact]\` on \`Quantity <= 0\` guards the error path (exception + no charge). A hand-written fake suffices here for simple cases; richer interaction verification you do with a mock in the next exercise.',
    externalLink: 'https://xunit.net/docs/getting-started/v3/cmdline',
    externalLinkLabel: 'xUnit: Theory and InlineData',
    externalLinkLabelPl: 'xUnit: Theory i InlineData',
    testFilter: 'FullyQualifiedName~Exercises.Tests._05_TESTY.stubs.PureLogicTheoryStub',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/stubs/PureLogicTheoryStub.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Payments/OrderService.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/examples/ShippingTheoryExample.cs',
    ],
  },
  {
    id: 'd3-exercise-09',
    sequenceNumber: 9,
    title: 'Write a [Theory] over discount thresholds',
    titlePl: 'Napisz [Theory] na progach rabatu',
    category: '05_TESTY: you write tests',
    categoryPl: '05_TESTY: piszesz testy',
    timeMinutes: 6,
    descriptionPl: `
## Kontekst

Sprawdzasz \`DiscountService.NetAfterDiscount(cena, ilość)\` - liczy kwotę do zapłaty po rabacie hurtowym. Rabat rośnie skokowo z ilością:
- poniżej 10 sztuk: 0%,
- od 10 sztuk: 5%,
- od 20 sztuk: 10%.

Policzmy na liczbach (cena 100 zł za sztukę):
- 9 szt. → \`100 × 9 = 900\`, bez rabatu → **900**,
- 10 szt. → \`100 × 10 = 1000\`, minus 5% → **950**,
- 19 szt. → \`100 × 19 = 1900\`, wciąż 5% → **1805**,
- 20 szt. → \`100 × 20 = 2000\`, minus 10% → **1800**.

Zaokrąglenie jest "w górę od zera" (\`AwayFromZero\`). Błędy w takich regułach prawie zawsze siedzą dokładnie na granicach progów (9 vs 10, 19 vs 20), więc to idealny materiał na \`[Theory]\` - jeden test sprawdza wszystkie progi naraz.

## Zadanie

Napisz \`[Theory]\` z \`[InlineData]\` na granicach progów (min. 3 przypadki, np. 9, 10 i 20 sztuk). Oczekiwane kwoty policz ręcznie jak wyżej. Wzór parametryzacji: \`examples/ShippingTheoryExample.cs\`.
    `,
    description: `
## Why it matters

A threshold rule (the discount jumps up with quantity) is classic \`[Theory]\` material: the real risk sits at the BOUNDARIES of the ranges. One test with a few \`[InlineData]\` covers all thresholds at once.

## Task

\`tests/Exercises.Tests/05_TESTY/stubs/DiscountTheoryStub.cs\` starts RED via \`Assert.Fail(...)\`. Subject: \`DiscountService.NetAfterDiscount(price, quantity)\` - 0% for \`quantity < 10\`, 5% for \`quantity >= 10\`, 10% for \`quantity >= 20\`, \`AwayFromZero\` rounding.

Remove \`Assert.Fail\` and write a \`[Theory]\`/\`[InlineData]\` on the boundaries (min. 3 cases: e.g. \`qty 9\` = 0%, \`qty 10\` = 5%, \`qty 20\` = 10%). Parametrization pattern: \`examples/ShippingTheoryExample.cs\`. Run the test in the panel until GREEN.
    `,
    hintPl: 'Policz oczekiwane kwoty ręcznie: \`100 * 19 * 0.95 = 1805\` (5%), \`100 * 20 * 0.90 = 1800\` (10%), \`100 * 9 = 900\` (0%). Wywołanie: \`new DiscountService().NetAfterDiscount(price, quantity)\`.',
    hint: 'Compute expected amounts by hand: \`100 * 19 * 0.95 = 1805\` (5%), \`100 * 20 * 0.90 = 1800\` (10%), \`100 * 9 = 900\` (0%). Call: \`new DiscountService().NetAfterDiscount(price, quantity)\`.',
    solution: `[Theory]
[InlineData(100, 9, 900)]    // brak rabatu
[InlineData(100, 10, 950)]   // próg 5%
[InlineData(100, 19, 1805)]  // wciąż 5%
[InlineData(100, 20, 1800)]  // próg 10%
public void napisz_theory_dla_rabatu_ilosciowego(decimal price, int quantity, decimal expected)
    => Assert.Equal(expected, new DiscountService().NetAfterDiscount(price, quantity));`,
    solutionExplanationPl: 'Reguła progowa daje 5% dla \`qty >= 10\` i 10% dla \`qty >= 20\`, z zaokrągleniem \`AwayFromZero\` (\`100 * 19 * 0.95 = 1805\`, \`100 * 20 * 0.90 = 1800\`). \`[Theory]\` z \`[InlineData]\` na granicach przedziałów to najtańszy sposób pokrycia wszystkich progów jednym testem - a raport pokazuje osobno każdy przypadek, więc regres w konkretnym progu jest natychmiast widoczny. \`DiscountService\` jest poprawny; celem jest sam nawyk pisania testów tabelarycznych.',
    solutionExplanation: 'The threshold rule gives 5% for \`qty >= 10\` and 10% for \`qty >= 20\`, with \`AwayFromZero\` rounding (\`100 * 19 * 0.95 = 1805\`, \`100 * 20 * 0.90 = 1800\`). A \`[Theory]\` with \`[InlineData]\` on the range boundaries is the cheapest way to cover all thresholds in one test - and the report shows each case separately, so a regression in a specific threshold is immediately visible. \`DiscountService\` is correct; the goal is the habit of writing table-driven tests.',
    externalLink: 'https://xunit.net/docs/getting-started/v3/cmdline',
    externalLinkLabel: 'xUnit: Theory and InlineData',
    externalLinkLabelPl: 'xUnit: Theory i InlineData',
    testFilter: 'FullyQualifiedName~Exercises.Tests._05_TESTY.stubs.DiscountTheoryStub',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/stubs/DiscountTheoryStub.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Pricing/DiscountService.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/examples/ShippingTheoryExample.cs',
    ],
  },
  {
    id: 'd3-exercise-10',
    sequenceNumber: 10,
    title: 'Verify interactions with a mock (NSubstitute)',
    titlePl: 'Zweryfikuj interakcje mockiem (NSubstitute)',
    category: '05_TESTY: you write tests',
    categoryPl: '05_TESTY: piszesz testy',
    timeMinutes: 6,
    descriptionPl: `
## Kontekst

Tu nie sprawdzasz WYNIKU funkcji, tylko to, czy coś się WYDARZYŁO - czyli jak \`OrderService.Place\` rozmawia z bramką płatności. \`Place\` po przyjęciu zamówienia woła \`IPaymentGateway.Charge(kwota)\`. Chcesz udowodnić dwie rzeczy:
- po poprawnym zamówieniu (2 szt. po 50 zł) bramka jest obciążona DOKŁADNIE RAZ i kwotą 100 zł,
- przy błędnej ilości (\`0\`) \`Place\` rzuca wyjątek, a bramka nie jest wołana ANI RAZU.

W poprzednim zadaniu pisałeś atrapę ręcznie. Teraz to samo pytanie - "ile razy i z czym zawołano zależność" - zadaje za Ciebie biblioteka NSubstitute: \`gateway.Received(1).Charge(100m)\` znaczy "miało być raz, z setką", a \`gateway.DidNotReceive().Charge(...)\` - "nie wolno było wcale".

## Zadanie

- \`[Fact]\`: po \`Place\` z 2 szt. po 50 zł sprawdź \`gateway.Received(1).Charge(100m)\`,
- \`[Fact]\`: przy ilości \`0\` (\`Assert.Throws<ArgumentException>\`) sprawdź \`gateway.DidNotReceive().Charge(...)\`.

Wzór masz w \`examples/MockingWithNSubstituteExample.cs\`.
    `,
    description: `
## Why it matters

Sometimes a test checks not the RESULT but the INTERACTION: whether a dependency was called, how many times and with what argument. That is what a mock is for. NSubstitute gives \`Received(1)\` / \`DidNotReceive()\` instead of a hand-written spy.

## Task

\`tests/Exercises.Tests/05_TESTY/stubs/MockVerifyStub.cs\` starts RED via \`Assert.Fail(...)\`. Subject: \`OrderService.Place\` calls \`IPaymentGateway.Charge(amount)\`. Remove \`Assert.Fail\` and write interaction verification:

- (a) after a valid order the gateway is charged ONCE with \`Quantity * UnitPrice\`: \`gateway.Received(1).Charge(100m)\`,
- (b) with \`Quantity <= 0\` (throws) the gateway is NOT touched: \`gateway.DidNotReceive().Charge(...)\`.

Pattern: \`examples/MockingWithNSubstituteExample.cs\`. Run the test in the panel until GREEN.
    `,
    hintPl: '\`Substitute.For<IPaymentGateway>()\`; skonfiguruj \`gateway.Charge(Arg.Any<decimal>()).Returns(true)\`, wykonaj \`Place\`, a potem \`gateway.Received(1).Charge(100m)\`. Dla ścieżki błędu użyj \`Assert.Throws\` i \`gateway.DidNotReceive().Charge(Arg.Any<decimal>())\`.',
    hint: '\`Substitute.For<IPaymentGateway>()\`; configure \`gateway.Charge(Arg.Any<decimal>()).Returns(true)\`, run \`Place\`, then \`gateway.Received(1).Charge(100m)\`. For the error path use \`Assert.Throws\` and \`gateway.DidNotReceive().Charge(Arg.Any<decimal>())\`.',
    solution: `[Fact]
public void charges_gateway_once_with_computed_amount()
{
    var gateway = Substitute.For<IPaymentGateway>();
    gateway.Charge(Arg.Any<decimal>()).Returns(true);

    new OrderService(gateway).Place(new OrderRequest("Book", 2, 50m));

    gateway.Received(1).Charge(100m);
}

[Fact]
public void does_not_charge_when_quantity_is_invalid()
{
    var gateway = Substitute.For<IPaymentGateway>();

    Assert.Throws<ArgumentException>(() =>
        new OrderService(gateway).Place(new OrderRequest("Book", 0, 50m)));

    gateway.DidNotReceive().Charge(Arg.Any<decimal>());
}`,
    solutionExplanationPl: 'Mock weryfikuje INTERAKCJĘ, nie zwracaną wartość: \`Received(1).Charge(100m)\` sprawdza, że bramkę zawołano dokładnie raz i właściwą kwotą, a \`DidNotReceive()\` - że przy błędnym wejściu nie zawołano jej wcale. \`Substitute.For<IPaymentGateway>()\` zastępuje ręcznie pisanego spy z poprzedniego zadania: to samo pytanie (co dostała zależność), mniej boilerplate. Weryfikacja interakcji jest właściwa tam, gdzie liczy się EFEKT UBOCZNY na granicy (płatność), a nie czysty wynik funkcji.',
    solutionExplanation: 'A mock verifies the INTERACTION, not the return value: \`Received(1).Charge(100m)\` checks the gateway was called exactly once with the right amount, and \`DidNotReceive()\` - that on invalid input it was not called at all. \`Substitute.For<IPaymentGateway>()\` replaces the hand-written spy from the previous exercise: the same question (what the dependency received), less boilerplate. Interaction verification fits where the SIDE EFFECT at the boundary matters (the payment), not the pure function result.',
    externalLink: 'https://nsubstitute.github.io/',
    externalLinkLabel: 'NSubstitute documentation',
    externalLinkLabelPl: 'Dokumentacja NSubstitute',
    testFilter: 'FullyQualifiedName~Exercises.Tests._05_TESTY.stubs.MockVerifyStub',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/stubs/MockVerifyStub.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Payments/OrderService.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/examples/MockingWithNSubstituteExample.cs',
    ],
  },

  // ===================================================================
  // 05_TESTY (5B) - poziom integracyjny (WAF) + wyścig + Testcontainers
  // ===================================================================
  {
    id: 'd3-exercise-12',
    sequenceNumber: 11,
    title: 'Write the integration test (WAF) for /products',
    titlePl: 'Napisz test integracyjny (WAF) dla /products',
    category: '05_TESTY: you write tests',
    categoryPl: '05_TESTY: piszesz testy',
    timeMinutes: 10,
    descriptionPl: `
## Kontekst

Test integracyjny podnosi całą aplikację w pamięci - z routingiem, wstrzykiwaniem zależności i wiązaniem danych z JSON - i odpytuje ją prawdziwym \`HttpClient\`, ale bez otwierania portu. Przechodzi tę samą drogę co realne żądanie, więc jest wierniejszy niż test jednostkowy.

Sprawdzasz katalog produktów (\`POST /products\` i \`GET /products/{id}\`). Jak to działa:
- \`POST /products\` z \`CreateProductRequest("Mysz", 79)\` tworzy produkt i zwraca **201** wraz z nadanym \`Id\`,
- \`GET /products/{to Id}\` zwraca **200** i te same dane (nazwa "Mysz", cena 79),
- \`GET /products/999999\` (Id, którego nie utworzyłeś) zwraca **404**.

## Zadanie

- happy path: \`POST\` produktu → 201, odczytaj \`Id\` z odpowiedzi, potem \`GET\` po tym \`Id\` → 200 z tą samą nazwą i ceną,
- osobny \`[Fact]\`: \`GET\` nieistniejącego \`Id\` → 404.

Cały szkielet (WAF, \`UseEnvironment("Testing")\`, \`HttpClient\`) masz gotowy w \`examples/CheckoutWafExample.cs\`.
    `,
    description: `
## Why it matters

An integration test boots the whole app in memory, with the full pipeline (routing, DI, model binding) and queries it with a real \`HttpClient\` without opening a port. More faithful than a unit test, because it exercises the real request path. Now you write such a test YOURSELF.

## Task

\`tests/Exercises.Tests/05_TESTY/stubs/ProductEndpointStub.cs\` starts RED via \`Assert.Fail(...)\`. Subject: the product catalog (\`src/Shop/Catalog/ProductService.cs\`) exposed as \`POST /products\` and \`GET /products/{id}\` in \`src/Shop/Program.cs\`. Remove \`Assert.Fail\` and write:

- (a) happy-path: \`POST /products\` with \`CreateProductRequest("Mysz", 79)\` -> 201, then \`GET /products/{id}\` -> 200 with the same data,
- (b) a separate \`[Fact]\`: \`GET /products/{missing id}\` -> 404 NotFound.

The pattern (WAF, \`UseEnvironment("Testing")\`, \`HttpClient\`) is in \`examples/CheckoutWafExample.cs\`. Run the test in the panel until GREEN.
    `,
    hintPl: 'Zbuduj klienta jak w \`CheckoutWafExample\`: \`factory.WithWebHostBuilder(b => b.UseEnvironment("Testing")).CreateClient()\`. Wyślij \`PostAsJsonAsync("/products", new CreateProductRequest(...))\`, odczytaj \`Product\` z \`response.Content.ReadFromJsonAsync<Product>()\`, potem \`GetAsync($"/products/{id}")\`. Dla 404 zapytaj o \`id\`, którego nie utworzyłeś.',
    hint: 'Build the client like in \`CheckoutWafExample\`: \`factory.WithWebHostBuilder(b => b.UseEnvironment("Testing")).CreateClient()\`. Send \`PostAsJsonAsync("/products", new CreateProductRequest(...))\`, read \`Product\` from \`response.Content.ReadFromJsonAsync<Product>()\`, then \`GetAsync($"/products/{id}")\`. For 404 query an \`id\` you did not create.',
    solution: `public class ProductEndpointStub : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    public ProductEndpointStub(WebApplicationFactory<Program> factory) =>
        _factory = factory.WithWebHostBuilder(b => b.UseEnvironment("Testing"));

    [Fact]
    public async Task product_can_be_created_and_fetched()
    {
        var client = _factory.CreateClient();

        var created = await client.PostAsJsonAsync("/products", new CreateProductRequest("Mysz", 79m));
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var product = await created.Content.ReadFromJsonAsync<Product>();

        var fetched = await client.GetFromJsonAsync<Product>($"/products/{product!.Id}");
        Assert.Equal("Mysz", fetched!.Name);
    }

    [Fact]
    public async Task missing_product_returns_not_found()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/products/999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}`,
    solutionExplanationPl: 'Test integracyjny przez \`WebApplicationFactory<Program>\` pokrywa to, czego unit nie widzi: routing, serializację, wiązanie ciała (\`CreateProductRequest\` z JSON), kontener DI. \`UseEnvironment("Testing")\` przełącza host na SQLite \`:memory:\`, więc nie potrzeba realnej bazy ani Dockera. \`ProductService\` jest Singletonem (magazyn w pamięci żyje z hostem), dlatego produkt z \`POST\` widać w kolejnym \`GET\`, a nieistniejące \`id\` daje 404. Piszesz tu test SAM - to odwrócenie Dnia 2, gdzie testy dostawałeś gotowe.',
    solutionExplanation: 'An integration test via \`WebApplicationFactory<Program>\` covers what a unit cannot see: routing, serialization, body binding (\`CreateProductRequest\` from JSON), the DI container. \`UseEnvironment("Testing")\` switches the host to SQLite \`:memory:\`, so no real database or Docker is needed. \`ProductService\` is a Singleton (the in-memory store lives with the host), so a product from \`POST\` is visible in the following \`GET\`, and a non-existent \`id\` gives 404. Here you write the test YOURSELF - the inverse of Day 2, where tests were handed to you.',
    externalLink: 'https://learn.microsoft.com/aspnet/core/test/integration-tests',
    externalLinkLabel: 'Integration tests in ASP.NET Core',
    externalLinkLabelPl: 'Testy integracyjne w ASP.NET Core',
    testFilter: 'FullyQualifiedName~Exercises.Tests._05_TESTY.stubs.ProductEndpointStub',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/stubs/ProductEndpointStub.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Catalog/ProductService.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Program.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/examples/CheckoutWafExample.cs',
    ],
  },
  {
    id: 'd3-exercise-13',
    sequenceNumber: 12,
    title: 'Write the WAF test for /checkout (happy + validation)',
    titlePl: 'Napisz test WAF dla /checkout (happy + walidacja)',
    category: '05_TESTY: you write tests',
    categoryPl: '05_TESTY: piszesz testy',
    timeMinutes: 8,
    descriptionPl: `
## Kontekst

Znów test integracyjny (WAF), ale tym razem sprawdzasz od razu oba zachowania endpointu \`POST /checkout\`: poprawne zamówienie i reakcję na błędne dane.

Jak to działa:
- poprawne \`OrderRequest("Book", 2, 50)\` → **200 OK**, a w ciele odpowiedzi \`Charged = true\` i \`Amount = 100\` (bo 2 × 50),
- błędne \`OrderRequest("Book", 0, 50)\` (ilość ≤ 0) → **400 Bad Request**.

To ta sama technika co we wzorcu \`CheckoutWafExample\`, dokładasz tylko ścieżkę błędu.

## Zadanie

- happy path: \`POST /checkout\` z 2 szt. po 50 → 200, sprawdź \`Charged\` i \`Amount == 100\`,
- osobny \`[Fact]\`: ilość \`0\` → 400.

Wzór: \`examples/CheckoutWafExample.cs\`.
    `,
    description: `
## Why it matters

A good integration test checks both of an endpoint's contracts at once: the happy path and validation of bad input. It is the same WAF technique as in the \`CheckoutWafExample\` pattern, but this time you write it YOURSELF, also exercising the error path.

## Task

\`tests/Exercises.Tests/05_TESTY/stubs/CheckoutWafStub.cs\` starts RED via \`Assert.Fail(...)\`. Subject: \`POST /checkout\` (\`src/Shop/Program.cs\`). Remove \`Assert.Fail\` and write a WAF integration test (\`WebApplicationFactory<Program>\`, \`UseEnvironment("Testing")\`, \`HttpClient\`):

- (a) happy-path: a valid order \`OrderRequest("Book", 2, 50)\` -> 200 OK + body (\`Charged\`, \`Amount == 100\`),
- (b) a separate \`[Fact]\`: the bad case \`Quantity <= 0\` -> 400 BadRequest.

Pattern: \`examples/CheckoutWafExample.cs\`. Run the test in the panel until GREEN.
    `,
    hintPl: 'Wydziel budowę klienta do metody: \`Client() => _factory.WithWebHostBuilder(b => b.UseEnvironment("Testing")).CreateClient()\`. Happy-path: \`PostAsJsonAsync("/checkout", new OrderRequest("Book", 2, 50m))\` -> 200, odczytaj body i sprawdź \`Amount == 100m\`. Błąd: \`new OrderRequest("Book", 0, 50m)\` -> 400.',
    hint: 'Extract the client build into a method: \`Client() => _factory.WithWebHostBuilder(b => b.UseEnvironment("Testing")).CreateClient()\`. Happy path: \`PostAsJsonAsync("/checkout", new OrderRequest("Book", 2, 50m))\` -> 200, read the body and check \`Amount == 100m\`. Error: \`new OrderRequest("Book", 0, 50m)\` -> 400.',
    solution: `public class CheckoutWafStub : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    public CheckoutWafStub(WebApplicationFactory<Program> factory) =>
        _factory = factory.WithWebHostBuilder(b => b.UseEnvironment("Testing"));

    private HttpClient Client() => _factory.CreateClient();

    [Fact]
    public async Task checkout_happy_path_returns_ok()
    {
        var res = await Client().PostAsJsonAsync("/checkout", new OrderRequest("Book", 2, 50m));

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<CheckoutResponse>();
        Assert.True(body!.Charged);
        Assert.Equal(100m, body.Amount);
    }

    [Fact]
    public async Task checkout_invalid_quantity_returns_bad_request()
    {
        var res = await Client().PostAsJsonAsync("/checkout", new OrderRequest("Book", 0, 50m));

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    private sealed record CheckoutResponse(bool Charged, decimal Amount);
}`,
    solutionExplanationPl: 'Test integracyjny przez WAF dowozi oba kontrakty endpointu naraz - happy-path (\`200\` + policzona kwota) i walidację (\`Quantity <= 0\` -> \`400\`) - na hoście w pamięci, bez realnego portu. To ta sama technika co \`CheckoutWafExample\`, ale napisana samodzielnie i rozszerzona o ścieżkę błędu. \`UseEnvironment("Testing")\` trzyma host na SQLite \`:memory:\`, więc test jest szybki i niezależny od infrastruktury.',
    solutionExplanation: 'A WAF integration test delivers both of the endpoint\'s contracts at once - the happy path (\`200\` + computed amount) and validation (\`Quantity <= 0\` -> \`400\`) - on an in-memory host with no real port. It is the same technique as \`CheckoutWafExample\`, but written yourself and extended with the error path. \`UseEnvironment("Testing")\` keeps the host on SQLite \`:memory:\`, so the test is fast and independent of infrastructure.',
    externalLink: 'https://learn.microsoft.com/aspnet/core/test/integration-tests',
    externalLinkLabel: 'Integration tests in ASP.NET Core',
    externalLinkLabelPl: 'Testy integracyjne w ASP.NET Core',
    testFilter: 'FullyQualifiedName~Exercises.Tests._05_TESTY.stubs.CheckoutWafStub',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/stubs/CheckoutWafStub.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Program.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/examples/CheckoutWafExample.cs',
    ],
  },
  {
    id: 'd3-exercise-14',
    sequenceNumber: 13,
    title: 'Fix a race on a singleton',
    titlePl: 'Napraw wyścig na singletonie',
    category: '05_TESTY: you write tests',
    categoryPl: '05_TESTY: piszesz testy',
    timeMinutes: 10,
    descriptionPl: `
## Kontekst

W ASP.NET Core żądania lecą RÓWNOLEGLE na RÓŻNYCH wątkach (inaczej niż w PHP, gdzie każde żądanie to świeży proces, czy w JS z jedną pętlą zdarzeń). Jeśli w Singletonie trzymasz zmienny stan bez zabezpieczenia, część aktualizacji ginie.

Sprawdzasz \`VisitCounter\` (Singleton) z górnym limitem \`Max\`. \`TryIncrement()\` ma przyjąć odwiedziny (zwrócić \`true\` i dodać 1) tylko dopóki \`licznik < Max\`, a inaczej zwrócić \`false\` bez zmiany. Problem: to DWA kroki - najpierw SPRAWDZENIE \`licznik < Max\`, potem DODANIE - i nic nie pilnuje, żeby zrobiły się razem.

Na czym polega błąd (weźmy \`Max = 3\`): dwa wątki w tej samej chwili widzą \`licznik = 2\` (czyli \`< 3\`, więc "wolno"), oba robią \`+1\` i licznik wskakuje na 4 - ponad limit. Jeden z odczytów przepadł.

Test \`RaceOnSingletonTests\` wali w jedną instancję z wielu wątków naraz, z małym \`Max\` i dużo większą liczbą prób. Sprawdza trzy rzeczy jednocześnie: suma udanych przyjęć (\`true\`) == końcowy stan licznika, licznik nigdy nie przekracza \`Max\`, a przy takim natłoku przyjęć jest dokładnie \`Max\`.

## Zadanie

Spraw, żeby SPRAWDZENIE limitu i DODANIE działy się jako jedna nierozerwalna całość - wtedy dwa wątki nie przecisną się naraz przez tę samą lukę. Podpowiedź: sekcja krytyczna (\`lock\` na prywatnym obiekcie) wokół obu kroków.
    `,
    description: `
## Why it matters

For teams from PHP (each request is a fresh process) and JS (a single event loop), concurrency over shared state is a new pain. In ASP.NET Core requests run on DIFFERENT threads in PARALLEL, so mutable state in a Singleton must be thread-safe - otherwise updates are lost. It helps to see it live first: a DEMO hammers \`/audit-log\` (a separate \`AuditLog\` class, not the one from the task) with parallel \`curl\` and some counts are lost.

## Task

Subject: \`VisitCounter\` (\`src/Shop/Counter/VisitCounter.cs\`), registered as a Singleton. It has an UPPER LIMIT \`Max\`: \`TryIncrement()\` accepts a visit (returns \`true\`, +1) ONLY when \`_count < Max\`, otherwise \`false\` with no change. Two steps - the limit CHECK and the INCREMENT - currently unsynchronized.

The \`RaceOnSingletonTests\` test hammers one instance multi-threaded via a \`Barrier\` with a small \`Max\`, under pressure >> \`Max\`. It guards a COMPOUND invariant: (a) accepts == final \`Count\`, (b) \`Count\` never > \`Max\`, (c) under pressure >> \`Max\` accepts are exactly \`Max\`. Make check+increment INDIVISIBLE and run the test in the panel until GREEN.
    `,
    hintPl: 'Pytanie nie brzmi "jak atomowo zrobić +1", tylko "jak spiąć SPRAWDZENIE limitu i INKREMENT w jedną niepodzielną całość". Samo \`Interlocked.Increment\` chroni tylko inkrement - zostaje okno TOCTOU między odczytem \`_count < Max\` a zapisem. Potrzebujesz sekcji krytycznej (prywatny obiekt-strażnik + \`lock\`) wokół OBU kroków.',
    hint: 'The question is not "how to do +1 atomically" but "how to bind the limit CHECK and the INCREMENT into one indivisible whole". \`Interlocked.Increment\` alone protects only the increment - it leaves a TOCTOU window between reading \`_count < Max\` and the write. You need a critical section (a private guard object + \`lock\`) around BOTH steps.',
    solution: `private readonly object _gate = new();
private long _count;

public long Count => _count;

public bool TryIncrement()
{
    // Sekcja krytyczna spina SPRAWDZENIE limitu i INKREMENT w jedną
    // niepodzielną całość -> znika okno TOCTOU, inwariant złożony się trzyma.
    lock (_gate)
    {
        if (_count >= Max)
        {
            return false;
        }

        _count++;
        return true;
    }
}`,
    solutionExplanationPl: 'To inwariant ZŁOŻONY: \`TryIncrement()\` najpierw SPRAWDZA limit (\`_count < Max\`), potem INKREMENTUJE - dwa kroki, które muszą być jedną niepodzielną operacją. Samo \`Interlocked.Increment(ref _count)\` NIE wystarcza: chroni tylko inkrement, ale zostawia okno TOCTOU między odczytem a zapisem (to wciąż check-then-act), więc dwa wątki widzą \`_count < Max\` i oba zwiększają - licznik przeskakuje \`Max\`. Naprawa to SEKCJA KRYTYCZNA (\`lock\` na prywatnym obiekcie-strażniku) wokół check+inkrement: serializuje całą bramkę, więc trzymają się wszystkie warunki. Singleton współdzieli tę samą instancję między równoległymi żądaniami, dlatego to jego zmienny stan trzeba chronić. \`SafeTallyExample\` używa \`Interlocked\`, bo licznik BEZ limitu ma tylko jeden krok (\`+1\`).',
    solutionExplanation: 'This is a COMPOUND invariant: \`TryIncrement()\` first CHECKS the limit (\`_count < Max\`), then INCREMENTS - two steps that must be one indivisible operation. \`Interlocked.Increment(ref _count)\` alone is NOT enough: it protects only the increment but leaves a TOCTOU window between the read and the write (still a check-then-act), so two threads see \`_count < Max\` and both increment - the counter jumps past \`Max\`. The fix is a CRITICAL SECTION (\`lock\` on a private guard object) around check+increment: it serializes the whole gate, so all conditions hold. A Singleton shares the same instance across parallel requests, which is why its mutable state must be protected. \`SafeTallyExample\` uses \`Interlocked\` because a counter WITHOUT a limit has just one step (\`+1\`).',
    externalLink: 'https://learn.microsoft.com/dotnet/csharp/language-reference/statements/lock',
    externalLinkLabel: 'The lock statement',
    externalLinkLabelPl: 'Instrukcja lock',
    testFilter: 'FullyQualifiedName~Exercises.Tests._05_TESTY.RaceOnSingletonTests',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Shop/Counter/VisitCounter.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/RaceOnSingletonTests.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/examples/SafeTallyExample.cs',
    ],
  },
  {
    id: 'd3-exercise-15',
    sequenceNumber: 14,
    title: 'Redis cache-aside + Testcontainers test',
    titlePl: 'Cache-aside w Redisie + test z Testcontainers',
    category: '05_TESTY: you write tests',
    categoryPl: '05_TESTY: piszesz testy',
    timeMinutes: 20,
    descriptionPl: `
## Kontekst

Endpoint \`/orders-report\` pyta usługę lojalnościową osobno dla każdego zamówienia, a każde takie pytanie (\`GetPointsAsync\`) to 200 ms w obie strony - nawet gdy ten sam klient powtarza się w raporcie kilka razy. Cache-aside w Redisie to naprawia: najpierw zaglądasz do pamięci podręcznej, a wolną usługę pytasz tylko wtedy, gdy w cache'u nic nie ma.

Jak to działa krok po kroku dla \`GetPointsAsync(klient)\`:
- pierwsze wywołanie: w Redisie pusto (miss) → pytasz wolne \`inner\`, dostajesz np. 420 punktów, zapisujesz do Redisa i zwracasz 420,
- drugie wywołanie tego samego klienta: w Redisie już jest (hit) → zwracasz 420 prosto z pamięci, \`inner\` NIE jest w ogóle wołane.

Czyli po dwóch wywołaniach dla tego samego klienta wolna usługa \`inner\` powinna dostać dokładnie jedno zapytanie - i to właśnie udowodnisz testem. Redis znasz z Dnia 2.

## Zadanie

1. Zaimplementuj \`src/Shop/Loyalty/RedisPointsCache.cs\` - dekorator \`ILoyaltyApi\`. W \`GetPointsAsync\`: sprawdź klucz w Redisie (\`StringGetAsync\`); jest wartość → zwróć ją; nie ma → zapytaj \`inner\`, zapisz wynik (\`StringSetAsync\`) i zwróć.

2. Napisz test \`testcontainers/RedisPointsCacheTests.cs\` z prawdziwym Redisem przez Testcontainers. Szkielet kontenera skopiuj żywcem z \`PostgresParityTests\` (\`IAsyncLifetime\` + \`StartAsync\`/\`DisposeAsync\` + \`GetConnectionString\`) — podmień tylko \`PostgreSqlBuilder\` na \`RedisBuilder().Build()\` i połącz się przez \`ConnectionMultiplexer.Connect(...)\`. Pod \`inner\` podstaw atrapę \`Substitute.For<ILoyaltyApi>()\`, wywołaj \`GetPointsAsync\` dwa razy dla tego samego klienta i udowodnij \`inner.Received(1)\` - drugie wywołanie poszło z Redisa.

Żeby uruchomić: włącz Dockera, zdejmij \`Skip\` z atrybutu i odpal \`dotnet test\`.
    `,
    description: `
## Why it matters

The \`/orders-report\` endpoint (\`src/Shop/Program.cs\`) calls the loyalty service once per order - \`SimulatedLoyaltyApi.GetPointsAsync\` is a 200 ms round-trip every time, even when the same customer repeats in the report. A cache-aside in Redis answers from the cache and only hits the slow service on a miss. You saw Redis on Day 2 - now you wire it in as a cache and **prove with a test** that it works.

## Task

1. Implement \`src/Shop/Loyalty/RedisPointsCache.cs\` - it is an \`ILoyaltyApi\` decorator (cache-aside). In \`GetPointsAsync\`: look up the key in Redis (\`IDatabase.StringGetAsync\`); on a hit return the cached value; on a miss ask \`inner\`, store the result (\`StringSetAsync\`) and return it. By default the method throws \`NotImplementedException\` - that is your RED.

2. Write \`tests/Exercises.Tests/05_TESTY/testcontainers/RedisPointsCacheTests.cs\` with a real Redis in Testcontainers. Copy the container scaffolding 1:1 from \`PostgresParityTests\` (a ready pattern: \`IAsyncLifetime\` + \`StartAsync\`/\`DisposeAsync\` + \`GetConnectionString\`) — just swap \`PostgreSqlBuilder\` for \`RedisBuilder().Build()\` and connect \`ConnectionMultiplexer.Connect(container.GetConnectionString())\`, put a stand-in under \`inner\` (\`Substitute.For<ILoyaltyApi>()\`) and prove that two \`GetPointsAsync\` calls for the same customer hit \`inner\` only once - the second one comes from Redis.

To run it: have Docker up, remove the \`Skip\` argument from the attribute and run \`dotnet test\` in the terminal.
    `,
    hintPl: 'Klucz np. \`$"loyalty:points:{customerId}"\`. \`StringGetAsync\` zwraca \`RedisValue\` - sprawdź \`.HasValue\`, a wartość rzutuj \`(int)value\`. Atrapę \`inner\` zrób przez \`Substitute.For<ILoyaltyApi>()\` z \`inner.GetPointsAsync(id).Returns(...)\`, a na końcu zweryfikuj \`await inner.Received(1).GetPointsAsync(id)\`. \`RedisPointsCache\` ma już pomocnik \`Cache => redis.GetDatabase()\`.',
    hint: 'A key like \`$"loyalty:points:{customerId}"\`. \`StringGetAsync\` returns a \`RedisValue\` - check \`.HasValue\` and cast the value with \`(int)value\`. Build the \`inner\` stand-in with \`Substitute.For<ILoyaltyApi>()\` and \`inner.GetPointsAsync(id).Returns(...)\`, then verify \`await inner.Received(1).GetPointsAsync(id)\`. \`RedisPointsCache\` already has a \`Cache => redis.GetDatabase()\` helper.',
    solution: `// src/Shop/Loyalty/RedisPointsCache.cs
public sealed class RedisPointsCache(IConnectionMultiplexer redis, ILoyaltyApi inner) : ILoyaltyApi
{
    private IDatabase Cache => redis.GetDatabase();

    public async Task<int> GetPointsAsync(int customerId, CancellationToken ct = default)
    {
        var key = $"loyalty:points:{customerId}";

        var cached = await Cache.StringGetAsync(key);
        if (cached.HasValue)
            return (int)cached;

        var points = await inner.GetPointsAsync(customerId, ct);
        await Cache.StringSetAsync(key, points);
        return points;
    }

    public Task<IReadOnlyDictionary<int, int>> GetPointsBatchAsync(
        IReadOnlyCollection<int> customerIds, CancellationToken ct = default) =>
        inner.GetPointsBatchAsync(customerIds, ct);
}

// tests/Exercises.Tests/05_TESTY/testcontainers/RedisPointsCacheTests.cs
public class RedisPointsCacheTests : IAsyncLifetime
{
    private readonly RedisContainer _container = new RedisBuilder().Build();
    private IConnectionMultiplexer _redis = null!;

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
        _redis = ConnectionMultiplexer.Connect(_container.GetConnectionString());
    }

    public async Task DisposeAsync()
    {
        _redis.Dispose();
        await _container.DisposeAsync().AsTask();
    }

    [Fact]
    public async Task second_call_for_same_customer_is_served_from_redis_not_the_slow_api()
    {
        var inner = Substitute.For<ILoyaltyApi>();
        inner.GetPointsAsync(42).Returns(420);
        var cache = new RedisPointsCache(_redis, inner);

        var first = await cache.GetPointsAsync(42);
        var second = await cache.GetPointsAsync(42);

        Assert.Equal(420, first);
        Assert.Equal(420, second);
        await inner.Received(1).GetPointsAsync(42);
    }
}`,
    solutionExplanationPl: 'Cache-aside: najpierw pytasz cache, przy pudle sięgasz do źródła i zapisujesz wynik - kolejne odczyty są z pamięci. Testcontainers daje testowi realny Redis w jednorazowym kontenerze (nie atrapę), więc round-trip przez sieć naprawdę się dzieje. NSubstitute na \`inner\` liczy trafienia w wolną usługę: skoro po dwóch wywołaniach dla tego samego klienta \`inner\` dostał \`Received(1)\`, to drugie wyszło z Redisa - test dowodzi, że cache faktycznie oszczędza round-trip, a nie że "kod się kompiluje".',
    solutionExplanation: 'Cache-aside: you ask the cache first, and on a miss you go to the source and store the result - later reads come from memory. Testcontainers gives the test a real Redis in a throwaway container (not a stand-in), so the network round-trip actually happens. NSubstitute on \`inner\` counts hits to the slow service: if after two calls for the same customer \`inner\` got \`Received(1)\`, the second one came from Redis - the test proves the cache really saves a round-trip, not just that "the code compiles".',
    externalLink: 'https://dotnet.testcontainers.org/modules/redis/',
    externalLinkLabel: 'Testcontainers Redis module',
    externalLinkLabelPl: 'Moduł Redis w Testcontainers',
    testFilter: 'FullyQualifiedName~Exercises.Tests._05_TESTY.testcontainers.RedisPointsCacheTests',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Shop/Loyalty/RedisPointsCache.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/05_TESTY/testcontainers/RedisPointsCacheTests.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Loyalty/ILoyaltyApi.cs',
      'dzien3-narzedzia/cwiczenia/src/Shop/Program.cs',
    ],
  },

  // ===================================================================
  // 06_NUGET - multi-targeting + pack / feed / consume / implement
  // ===================================================================
  {
    id: 'd3-exercise-16',
    sequenceNumber: 15,
    title: 'Multi-targeting: one source, two runtimes',
    titlePl: 'Multi-targeting: jeden kod, dwa runtime',
    category: '06_NUGET: packaging',
    categoryPl: '06_NUGET: pakowanie',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

Biblioteka często musi działać na różnych runtime: nowym .NET i starszym, zgodnym ze .NET Framework (przez \`netstandard2.0\`). Jeden projekt potrafi się skompilować pod kilka targetów naraz, a kod może rozgałęziać się per target dyrektywą \`#if\`. Ten sam projekt spakujesz potem w jednej paczce NuGet (następne zadanie).

## Zadanie

Otwórz \`src/Packable/Packable.csproj\` - ma \`<TargetFrameworks>net10.0;netstandard2.0</TargetFrameworks>\` (liczba mnoga - z "s"). Zbuduj i zajrzyj do wyjścia:

\`\`\`bash
dotnet build src/Packable
ls src/Packable/bin/Debug          # dwa foldery: net10.0 i netstandard2.0
\`\`\`

Otwórz \`src/Packable/Polyfills.cs\` i zobacz realny koszt starego targetu: pod blokiem \`#if NETSTANDARD2_0\` projekt sam definiuje typ \`IsExternalInit\`, którego kompilator wymaga dla właściwości \`init\` i rekordów pozycyjnych - bo \`netstandard2.0\` go nie zna, a \`net10.0\` już tak.
    `,
    description: `
## Why it matters

A library often must run on different runtimes: modern .NET and an older one compatible with .NET Framework (via \`netstandard2.0\`). One project can compile against several targets at once, and code can branch per target with \`#if\`. You then pack this same project into one NuGet package (next exercise).

## Task

Open \`src/Packable/Packable.csproj\` - it has \`<TargetFrameworks>net10.0;netstandard2.0</TargetFrameworks>\` (plural - with the "s"). Build and inspect the output:

\`\`\`bash
dotnet build src/Packable
ls src/Packable/bin/Debug          # two folders: net10.0 and netstandard2.0
\`\`\`

Open \`src/Packable/Polyfills.cs\` and see the real cost of the old target: under an \`#if NETSTANDARD2_0\` block the project defines the \`IsExternalInit\` type itself, which the compiler requires for \`init\` properties and positional records - because \`netstandard2.0\` does not know it, while \`net10.0\` does.
    `,
    hintPl: 'Liczba mnoga \`<TargetFrameworks>\` (z "s") włącza multi-targeting; \`<TargetFramework>\` (bez "s") to jeden target. Po buildzie każdy target ma własny podfolder w \`bin/Debug\`. Blok \`#if NETSTANDARD2_0\` w \`Polyfills.cs\` kompiluje się tylko dla starego targetu.',
    hint: 'The plural \`<TargetFrameworks>\` (with the "s") enables multi-targeting; \`<TargetFramework>\` (no "s") is a single target. After build each target gets its own subfolder under \`bin/Debug\`. The \`#if NETSTANDARD2_0\` block in \`Polyfills.cs\` compiles only for the old target.',
    solutionExplanationPl: 'Kompilator uruchamia się raz na target i definiuje symbole (\`NET10_0\`, \`NETSTANDARD2_0\`), więc \`#if\` rozgałęzia kod bez duplikowania projektu. \`Polyfills.cs\` pokazuje realny koszt zgodności wstecznej: \`netstandard2.0\` nie zna \`IsExternalInit\`, którego wymagają właściwości \`init\` i rekordy pozycyjne, więc projekt sam dokłada ten typ TYLKO pod stary target. Pod \`net10.0\` typ już istnieje, więc bloku się nie kompiluje. Jeden \`dotnet pack\` zamknie oba wyjścia w jednej paczce - do tego wrócisz w następnym zadaniu.',
    solutionExplanation: 'The compiler runs once per target and defines symbols (\`NET10_0\`, \`NETSTANDARD2_0\`), so \`#if\` branches code without duplicating the project. \`Polyfills.cs\` shows the real cost of backward compatibility: \`netstandard2.0\` does not know \`IsExternalInit\`, which \`init\` properties and positional records require, so the project supplies that type itself ONLY for the old target. Under \`net10.0\` the type already exists, so the block does not compile. A single \`dotnet pack\` bundles both outputs into one package - you return to this in the next exercise.',
    externalLink: 'https://learn.microsoft.com/dotnet/standard/library-guidance/cross-platform-targeting',
    externalLinkLabel: 'Cross-platform targeting',
    externalLinkLabelPl: 'Multi-targeting bibliotek',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Packable/Packable.csproj',
      'dzien3-narzedzia/cwiczenia/src/Packable/Polyfills.cs',
    ],
  },
  {
    id: 'd3-exercise-17',
    sequenceNumber: 16,
    title: 'Implement, pack and consume your own package',
    titlePl: 'Zaimplementuj, spakuj i skonsumuj własny pakiet',
    category: '06_NUGET: packaging',
    categoryPl: '06_NUGET: pakowanie',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Rejestr NuGet to po prostu źródło paczek, a źródłem może być zwykły folder na dysku. Całą drogę "zaimplementuj -> spakuj -> skonsumuj" przejdziesz lokalnie, bez serwera - ten sam mechanizm działa potem na nuget.org czy w prywatnym feedzie firmy.

## Zadanie

Najpierw ZAIMPLEMENTUJ publiczne API paczki - oba to STUBY rzucające \`NotImplementedException\`, a testy \`PackableConsumerTests\` (3) są przez to CZERWONE:

- \`src/Packable/SlugGenerator.cs\` -> \`Slugify\`: małe litery, ciągi nie-alfanumeryczne -> pojedynczy \`-\`, bez myślników na brzegach (\`"Hello, World!"\` -> \`hello-world\`),
- \`src/Packable/SemanticVersion.cs\` -> \`Parse\`/\`CompareTo\`: porównanie NUMERYCZNE (\`1.2.0 < 1.10.0\`).

Uruchom \`PackableConsumerTests\` w panelu, aż będzie ZIELONY. Potem spakuj i skonsumuj z lokalnego feedu (z katalogu \`dzien3-narzedzia/cwiczenia\`):

\`\`\`bash
dotnet pack src/Packable -c Release -o ./local-feed
dotnet nuget add source "$(pwd)/local-feed" --name local-feed
dotnet run --project src/06_nuget/Consumer          # Slugify + SemanticVersion na żywo
\`\`\`
    `,
    description: `
## Why it matters

A NuGet registry is simply a package source, and a source can be a plain folder on disk. You walk the whole "implement -> pack -> consume" path locally, without a server - the same mechanism then works on nuget.org or a company private feed.

## Task

First IMPLEMENT the package's public API - both are STUBS throwing \`NotImplementedException\`, and the \`PackableConsumerTests\` (3) are RED because of it:

- \`src/Packable/SlugGenerator.cs\` -> \`Slugify\`: lowercase, non-alphanumeric runs -> a single \`-\`, no dashes on the edges (\`"Hello, World!"\` -> \`hello-world\`),
- \`src/Packable/SemanticVersion.cs\` -> \`Parse\`/\`CompareTo\`: NUMERIC comparison (\`1.2.0 < 1.10.0\`).

Run \`PackableConsumerTests\` in the panel until GREEN. Then pack and consume from a local feed (from the \`dzien3-narzedzia/cwiczenia\` directory):

\`\`\`bash
dotnet pack src/Packable -c Release -o ./local-feed
dotnet nuget add source "$(pwd)/local-feed" --name local-feed
dotnet run --project src/06_nuget/Consumer          # Slugify + SemanticVersion live
\`\`\`
    `,
    hintPl: 'W \`Slugify\` iteruj po znakach: \`char.IsLetterOrDigit\` -> dopisz małą literę, w przeciwnym razie DOKŁADAJ pojedynczy \`-\` (unikaj podwójnych), na końcu \`Trim(\'-\')\`. W \`SemanticVersion.Parse\` rozbij po \`.\`, sparsuj trzy \`int\` (inaczej \`FormatException\`); w \`CompareTo\` porównuj kolejno Major, Minor, Patch jako liczby.',
    hint: 'In \`Slugify\` iterate over characters: \`char.IsLetterOrDigit\` -> append the lowercase letter, otherwise ADD a single \`-\` (avoid doubles), then \`Trim(\'-\')\`. In \`SemanticVersion.Parse\` split on \`.\`, parse three \`int\` (else \`FormatException\`); in \`CompareTo\` compare Major, Minor, Patch in order as numbers.',
    solution: `// SlugGenerator.Slugify - lowercase; nie-alfanumeryczne -> pojedynczy '-'; przytnij brzegowe '-'
public static string Slugify(string? text)
{
    if (string.IsNullOrWhiteSpace(text))
        return "";

    var sb = new StringBuilder(text.Length);
    var lastDash = false;
    foreach (var ch in text.Trim())
    {
        if (char.IsLetterOrDigit(ch))
        {
            sb.Append(char.ToLowerInvariant(ch));
            lastDash = false;
        }
        else if (!lastDash)
        {
            sb.Append('-');
            lastDash = true;
        }
    }
    return sb.ToString().Trim('-');
}

// SemanticVersion.Parse + CompareTo - porównanie NUMERYCZNE, nie leksykalne
public static SemanticVersion Parse(string text)
{
    var parts = text.Split('.');
    if (parts.Length != 3
        || !int.TryParse(parts[0], out var major)
        || !int.TryParse(parts[1], out var minor)
        || !int.TryParse(parts[2], out var patch))
        throw new FormatException($"Nieprawidłowy SemVer: '{text}'");

    return new SemanticVersion(major, minor, patch);
}

public int CompareTo(SemanticVersion? other)
{
    if (other is null) return 1;
    var byMajor = Major.CompareTo(other.Major);
    if (byMajor != 0) return byMajor;
    var byMinor = Minor.CompareTo(other.Minor);
    if (byMinor != 0) return byMinor;
    return Patch.CompareTo(other.Patch);
}`,
    solutionExplanationPl: 'To domknięcie łańcucha "artefakt -> paczka -> konsument". \`Slugify\` scala ciągi nie-alfanumeryczne w pojedynczy \`-\` i przycina brzegi (\`"Hello, World!"\` -> \`"hello-world"\`, \`"C# 14"\` -> \`"c-14"\`). \`SemanticVersion\` musi porównywać NUMERYCZNIE, nie leksykalnie - inaczej \`1.10.0\` wypadłoby przed \`1.2.0\` (bo \`"10" < "2"\` znakowo); test \`compare_orders_minor_numerically\` właśnie tego pilnuje. \`record\` daje równość po wartości, więc świeżo sparsowana wersja równa się ręcznie zbudowanej. Multi-target (\`net10.0;netstandard2.0\`) sprawia, że paczkę uniesie i .NET 10, i starszy konsument. Testy \`PackableConsumerTests\` (3) są RED do czasu implementacji obu algorytmów.',
    solutionExplanation: 'This closes the "artifact -> package -> consumer" chain. \`Slugify\` merges non-alphanumeric runs into a single \`-\` and trims the edges (\`"Hello, World!"\` -> \`"hello-world"\`, \`"C# 14"\` -> \`"c-14"\`). \`SemanticVersion\` must compare NUMERICALLY, not lexically - otherwise \`1.10.0\` would sort before \`1.2.0\` (because \`"10" < "2"\` as strings); the \`compare_orders_minor_numerically\` test guards exactly that. A \`record\` gives value equality, so a freshly parsed version equals a hand-built one. Multi-targeting (\`net10.0;netstandard2.0\`) makes the package usable by both .NET 10 and an older consumer. The \`PackableConsumerTests\` (3) are RED until both algorithms are implemented.',
    externalLink: 'https://learn.microsoft.com/dotnet/core/tools/dotnet-pack',
    externalLinkLabel: 'dotnet pack reference',
    externalLinkLabelPl: 'Dokumentacja dotnet pack',
    testFilter: 'FullyQualifiedName~Exercises.Tests._06_NUGET.PackableConsumerTests',
    relatedFiles: [
      'dzien3-narzedzia/cwiczenia/src/Packable/SlugGenerator.cs',
      'dzien3-narzedzia/cwiczenia/src/Packable/SemanticVersion.cs',
      'dzien3-narzedzia/cwiczenia/src/06_nuget/Consumer/Program.cs',
      'dzien3-narzedzia/cwiczenia/tests/Exercises.Tests/06_NUGET/PackableConsumerTests.cs',
    ],
  },
];
