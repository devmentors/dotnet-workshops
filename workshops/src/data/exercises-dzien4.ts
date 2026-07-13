import type { Exercise } from '../types/Exercise';

// Dzień 4 - Architektura: synteza na realnej aplikacji MySpot (modularny monolit).
// Zadania są tool-driven ("oznacz jako wykonane"): kursant implementuje na wciągniętym
// MySpot (dzien4-architektura/myspot), a weryfikacja to uruchomienie MySpota
// (Docker/Postgres) po stronie prowadzącego - poza runnerem naszej aplikacji.
// Selekcja pod klamrę "wszystko z Dni 1-3 żyje w realnym projekcie": moduł jako
// jednostka kompozycji, CQRS, reguły domenowe, komunikacja synchroniczna
// i asynchroniczna między modułami, odporność, observability.


export const dzien4Exercises: Exercise[] = [
  // ===================================================================
  // Z1 - Moduł jako jednostka kompozycji (IModule)
  // ===================================================================
  {
    id: 'd4-exercise-01',
    sequenceNumber: 1,
    title: 'Implement IModule for the Availability module',
    titlePl: 'Zaimplementuj IModule dla modułu Availability',
    category: 'Modular monolith',
    categoryPl: 'Modularny monolit',
    timeMinutes: 10,
    descriptionPl: `
## Po co to

W modularnym monolicie moduł jest jednostką kompozycji: sam rejestruje swoje usługi i sam
podpina się do hosta. Host nie zna modułów po nazwie klasy - odnajduje je przez refleksję
(\`ModuleLoader\`: \`GetTypes()\` + \`IsAssignableFrom(typeof(IModule))\` + \`Activator.CreateInstance\`).
Dopóki moduł nie implementuje \`IModule\`, loader go nie znajdzie i moduł nie istnieje w aplikacji.

## Zadanie

W \`dzien4-architektura/myspot\` zaimplementuj \`AvailabilityModule\` jako \`IModule\`
(plik \`AvailabilityModule.cs\` - jest tam instrukcja w komentarzu TODO):

1. Klasa \`internal sealed class AvailabilityModule : IModule\`, \`Name = "Availability"\`.
2. W \`Register\` zarejestruj warstwy modułu: \`services.AddApplication().AddInfrastructure(configuration)\`.
3. W \`Use\` podepnij obsługę żądań modułu: subskrypcja \`AddResource\` na ścieżce
   \`availability/resources/add\`, delegująca do \`IDispatcher.SendAsync\`.
4. \`Expose\` może zostać puste.

Wzoruj się na innych modułach (\`ParkingSpotsModule\`, \`UsersModule\`).

## Co zaobserwujesz

Po implementacji host odnajdzie moduł przez refleksję i wywoła jego \`Register\`/\`Use\` - bez
żadnej zmiany w bootstrapperze. Bonus: ustaw \`"enabled": false\` w \`module.availability.json\`
i uruchom aplikację ponownie - \`ModuleLoader\` w ogóle nie załaduje assembly modułu, więc moduł
znika z aplikacji, mimo że kod dalej jest w solucji.
    `,
    description: `
## Why it matters

In a modular monolith a module is a composition unit: it registers its own services and
wires itself into the host. The host does not know modules by class name - it discovers them
via reflection (\`ModuleLoader\`: \`GetTypes()\` + \`IsAssignableFrom(typeof(IModule))\` +
\`Activator.CreateInstance\`). Until a module implements \`IModule\`, the loader will not find it.

## Task

In \`dzien4-architektura/myspot\` implement \`AvailabilityModule\` as \`IModule\`
(file \`AvailabilityModule.cs\` - there is a TODO comment with instructions):

1. \`internal sealed class AvailabilityModule : IModule\`, \`Name = "Availability"\`.
2. In \`Register\` register the module layers: \`services.AddApplication().AddInfrastructure(configuration)\`.
3. In \`Use\` wire the module request handling: subscribe \`AddResource\` on the
   \`availability/resources/add\` path, delegating to \`IDispatcher.SendAsync\`.
4. \`Expose\` can stay empty.

Model it on the other modules (\`ParkingSpotsModule\`, \`UsersModule\`).

## What you will observe

After implementing it, the host discovers the module by reflection and calls its
\`Register\`/\`Use\` - with no change in the bootstrapper. Bonus: set \`"enabled": false\`
in \`module.availability.json\` and restart the app - \`ModuleLoader\` will not even load the
module assembly, so the module disappears from the application although the code is still
in the solution.
    `,
    hintPl: 'Konstrukcja jak w innych modułach: \`Name\`, \`Register\` woła \`AddApplication().AddInfrastructure(configuration)\`, \`Use\` robi \`app.UseModuleRequests().Subscribe<AddResource>(...)\`. Loader działa przez refleksję, więc wystarczy, że klasa implementuje \`IModule\` w tej assembly.',
    hint: 'Structure it like the other modules: \`Name\`, \`Register\` calls \`AddApplication().AddInfrastructure(configuration)\`, \`Use\` does \`app.UseModuleRequests().Subscribe<AddResource>(...)\`. The loader works by reflection, so implementing \`IModule\` in this assembly is enough.',
    solution: `internal sealed class AvailabilityModule : IModule
{
    public string Name { get; } = "Availability";

    public void Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddApplication().AddInfrastructure(configuration);
    }

    public void Use(IApplicationBuilder app)
    {
        app.UseModuleRequests()
            .Subscribe<AddResource>("availability/resources/add", (command, serviceProvider, ct) =>
                serviceProvider.GetRequiredService<IDispatcher>().SendAsync(command, ct));
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
    }
}`,
    solutionExplanationPl: '\`IModule\` to kontrakt jednostki kompozycji: \`Register\` opisuje, co moduł wnosi do kontenera, \`Use\` podpina go do pipeline\'u i rejestruje subskrypcje żądań, \`Expose\` mapuje endpointy HTTP. Host odnajduje wszystkie \`IModule\` przez refleksję i wywołuje te metody w pętli, dlatego dodanie modułu nie wymaga żadnej zmiany w bootstrapperze. Flaga \`enabled\` w \`module.availability.json\` działa piętro niżej: \`ModuleLoader.LoadAssemblies\` w ogóle nie ładuje assembly wyłączonego modułu, więc refleksja nie ma czego znaleźć.',
    solutionExplanation: '\`IModule\` is the composition-unit contract: \`Register\` declares what the module brings to the container, \`Use\` wires it into the pipeline and registers request subscriptions, \`Expose\` maps HTTP endpoints. The host discovers all \`IModule\` implementations by reflection and calls these methods in a loop, so adding a module needs no change in the bootstrapper. The \`enabled\` flag in \`module.availability.json\` works one level below: \`ModuleLoader.LoadAssemblies\` does not even load a disabled module\'s assembly, so reflection has nothing to find.',
    relatedFiles: [
      'dzien4-architektura/myspot/src/Modules/Availability/MySpot.Modules.Availability.Api/AvailabilityModule.cs',
      'dzien4-architektura/myspot/src/Shared/MySpot.Shared.Infrastructure/Modules/ModuleLoader.cs',
      'dzien4-architektura/myspot/src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Api/ParkingSpotsModule.cs',
      'dzien4-architektura/myspot/src/Modules/Availability/MySpot.Modules.Availability.Api/module.availability.json',
    ],
  },

  // ===================================================================
  // Z2 - Nowa komenda CQRS: UpdateJobTitle (zadanie addytywne)
  // ===================================================================
  {
    id: 'd4-exercise-02',
    sequenceNumber: 2,
    title: 'New CQRS command: UpdateJobTitle in the Users module',
    titlePl: 'Nowa komenda CQRS: UpdateJobTitle w module Users',
    category: 'CQRS',
    categoryPl: 'CQRS',
    timeMinutes: 15,
    descriptionPl: `
## Po co to

W CQRS każda zmiana stanu to osobna komenda z osobnym handlerem. Zaleta widać przy rozbudowie:
nowa operacja biznesowa = nowy rekord + nowy handler + endpoint, bez dotykania istniejącego kodu.
To zadanie jest addytywne - niczego nie poprawiasz, dokładasz nową funkcję do działającego modułu
i sprawdzasz, ile "kleju" trzeba dopisać (spoiler: mniej, niż myślisz).

## Zadanie

W module Users (\`dzien4-architektura/myspot\`) dodaj operację zmiany stanowiska użytkownika:

1. Zbadaj, jak działa istniejący przepływ: rekord \`SignUp\` (\`Core/Commands\`), handler
   \`SignUpHandler\` (\`Core/Commands/Handlers\`), endpoint w \`UsersModule.Expose\`.
2. Dodaj rekord \`UpdateJobTitle(Guid UserId, string JobTitle) : ICommand\` w \`Core/Commands\`.
3. Dodaj \`UpdateJobTitleHandler : ICommandHandler<UpdateJobTitle>\` w \`Core/Commands/Handlers\`:
   wczytaj użytkownika z \`IUserRepository\`, zmień \`JobTitle\` (encja \`User\` ma settable property,
   jak w \`SignUpHandler\` przechowuj wartość jako lowercase), zapisz przez \`UpdateAsync\`.
   Brak użytkownika = \`UserNotFoundException\`.
4. W \`UsersModule.Expose\` dodaj endpoint \`PUT /users/{userId:guid}/job-title\`, który wysyła
   komendę przez \`IDispatcher\`.

Handlera NIE rejestrujesz nigdzie ręcznie - zanim oznaczysz zadanie jako wykonane, znajdź
w \`Shared.Infrastructure/Commands/Extensions.cs\` mechanizm, który go odnajdzie.

## Co zaobserwujesz

Po uruchomieniu aplikacji nowy endpoint pojawia się w Swaggerze i działa, mimo że nigdzie nie
dopisano rejestracji handlera. \`services.Scan\` (Scrutor) skanuje assembly modułów i rejestruje
wszystkie implementacje \`ICommandHandler<>\` automatycznie - konwencja zamiast konfiguracji.
    `,
    description: `
## Why it matters

In CQRS every state change is a separate command with its own handler. The benefit shows when
you extend the system: a new business operation = a new record + a new handler + an endpoint,
without touching existing code. This task is additive - you fix nothing, you add a new feature
to a working module and check how much "glue" you have to write (spoiler: less than you think).

## Task

In the Users module (\`dzien4-architektura/myspot\`) add an operation that changes a user's job title:

1. Study the existing flow: the \`SignUp\` record (\`Core/Commands\`), the \`SignUpHandler\`
   (\`Core/Commands/Handlers\`), the endpoint in \`UsersModule.Expose\`.
2. Add a record \`UpdateJobTitle(Guid UserId, string JobTitle) : ICommand\` in \`Core/Commands\`.
3. Add \`UpdateJobTitleHandler : ICommandHandler<UpdateJobTitle>\` in \`Core/Commands/Handlers\`:
   load the user from \`IUserRepository\`, change \`JobTitle\` (the \`User\` entity has a settable
   property; store the value lowercase, as \`SignUpHandler\` does), save via \`UpdateAsync\`.
   Missing user = \`UserNotFoundException\`.
4. In \`UsersModule.Expose\` add a \`PUT /users/{userId:guid}/job-title\` endpoint that sends
   the command via \`IDispatcher\`.

Do NOT register the handler manually anywhere - before you mark the task as done, find the
mechanism in \`Shared.Infrastructure/Commands/Extensions.cs\` that will discover it.

## What you will observe

After starting the app the new endpoint shows up in Swagger and works, although no handler
registration was added anywhere. \`services.Scan\` (Scrutor) scans the module assemblies and
registers every \`ICommandHandler<>\` implementation automatically - convention over configuration.
    `,
    hintPl: 'Rekord komendy wzoruj na \`SignIn\`/\`SignUp\`. Handler: konstruktor z \`IUserRepository\`, w \`HandleAsync\` sekwencja get - null check - mutacja - \`UpdateAsync\`. Endpoint: \`endpoints.MapPut("/users/{userId:guid}/job-title", ...)\` z \`command with { UserId = userId }\` (wzór: endpoint \`/sign-up\` nadpisuje \`UserId\` przez \`with\`).',
    hint: 'Model the command record on \`SignIn\`/\`SignUp\`. Handler: constructor with \`IUserRepository\`, in \`HandleAsync\` the sequence get - null check - mutate - \`UpdateAsync\`. Endpoint: \`endpoints.MapPut("/users/{userId:guid}/job-title", ...)\` with \`command with { UserId = userId }\` (pattern: the \`/sign-up\` endpoint overrides \`UserId\` via \`with\`).',
    solution: `// Core/Commands/UpdateJobTitle.cs
public record UpdateJobTitle(Guid UserId, string JobTitle) : ICommand;

// Core/Commands/Handlers/UpdateJobTitleHandler.cs
internal sealed class UpdateJobTitleHandler : ICommandHandler<UpdateJobTitle>
{
    private readonly IUserRepository _userRepository;

    public UpdateJobTitleHandler(IUserRepository userRepository)
        => _userRepository = userRepository;

    public async Task HandleAsync(UpdateJobTitle command, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetAsync(command.UserId);
        if (user is null)
        {
            throw new UserNotFoundException(command.UserId);
        }

        user.JobTitle = command.JobTitle.ToLowerInvariant();
        await _userRepository.UpdateAsync(user);
    }
}

// UsersModule.cs - nowy endpoint w Expose
endpoints.MapPut("/users/{userId:guid}/job-title",
    async (Guid userId, UpdateJobTitle command, IDispatcher dispatcher) =>
{
    await dispatcher.SendAsync(command with { UserId = userId });
    return Results.NoContent();
}).WithTags("Users").WithName("Update job title");`,
    solutionExplanationPl: 'Cały przyrost to trzy elementy: rekord (dane operacji), handler (logika) i endpoint (wejście HTTP). Klejem jest \`IDispatcher\`, który po typie komendy znajduje handler w kontenerze. Rejestrację załatwia Scrutor: \`AddCommands\` w \`Shared.Infrastructure/Commands/Extensions.cs\` robi \`services.Scan(...).AddClasses(c => c.AssignableTo(typeof(ICommandHandler<>)))\` po assembly wszystkich modułów. Encja \`User\` ma settable \`JobTitle\`, więc mutacja to zwykłe przypisanie - w bogatszej domenie (patrz Zadanie 3) taka zmiana przechodziłaby przez metodę na encji, która pilnuje niezmienników.',
    solutionExplanation: 'The whole increment is three pieces: a record (operation data), a handler (logic) and an endpoint (HTTP entry). The glue is \`IDispatcher\`, which finds the handler in the container by the command type. Registration is handled by Scrutor: \`AddCommands\` in \`Shared.Infrastructure/Commands/Extensions.cs\` does \`services.Scan(...).AddClasses(c => c.AssignableTo(typeof(ICommandHandler<>)))\` over all module assemblies. The \`User\` entity has a settable \`JobTitle\`, so the mutation is a plain assignment - in a richer domain (see Task 3) such a change would go through an entity method guarding the invariants.',
    relatedFiles: [
      'dzien4-architektura/myspot/src/Modules/Users/MySpot.Modules.Users.Core/Commands/SignUp.cs',
      'dzien4-architektura/myspot/src/Modules/Users/MySpot.Modules.Users.Core/Commands/Handlers/SignUpHandler.cs',
      'dzien4-architektura/myspot/src/Modules/Users/MySpot.Modules.Users.Api/UsersModule.cs',
      'dzien4-architektura/myspot/src/Modules/Users/MySpot.Modules.Users.Core/Entities/User.cs',
      'dzien4-architektura/myspot/src/Shared/MySpot.Shared.Infrastructure/Commands/Extensions.cs',
    ],
  },

  // ===================================================================
  // Z3 - Reguła jako typ: polityka rezerwacji
  // ===================================================================
  {
    id: 'd4-exercise-03',
    sequenceNumber: 3,
    title: 'A rule as a type: the manager reservation policy',
    titlePl: 'Reguła jako typ: polityka rezerwacji managera',
    category: 'Rich domain',
    categoryPl: 'Rich domain',
    timeMinutes: 8,
    descriptionPl: `
## Po co to

Reguły biznesowe pisane jako \`if\`-y w serwisach rozłażą się po całym kodzie. W bogatej domenie
reguła jest osobnym typem: \`IReservationPolicy\` opisuje, ile rezerwacji w tygodniu wolno mieć
pracownikowi na danym stanowisku. Domena wybiera politykę po \`jobTitle\` (\`CanBeApplied\`)
i pyta ją o zgodę (\`CanReserve\`). Nowa reguła = nowa klasa, zero zmian w istniejących.

## Zadanie

W \`dzien4-architektura/myspot\` zaimplementuj brakującą politykę \`ManagerReservationPolicy\`
(plik \`Modules/Reservations/.../Core/Policies/ManagerReservationPolicy.cs\` - instrukcja
w komentarzu TODO):

1. \`internal sealed class ManagerReservationPolicy : IReservationPolicy\`.
2. \`CanBeApplied\` zwraca \`true\` dla \`jobTitle\` równego \`JobTitle.Manager\`.
3. \`CanReserve\` pozwala managerowi mieć maksymalnie 4 rezerwacje w tygodniu.

Zobacz sąsiednie polityki (\`BossReservationPolicy\`, \`RegularEmployeeReservationPolicy\`)
i \`WeeklyReservationsService\`, który dostaje \`IEnumerable<IReservationPolicy>\`.

## Co zaobserwujesz

Bez tej klasy manager nie może zrobić żadnej rezerwacji: żadna polityka nie odpowiada na jego
\`jobTitle\`. Po dodaniu klasy limit dla managera zaczyna działać - a klasy nigdzie nie
rejestrowałeś. Sprawdź w \`Reservations.Application/Extensions.cs\`, kto ją znalazł.
    `,
    description: `
## Why it matters

Business rules written as \`if\`-s in services spread across the whole codebase. In a rich domain
a rule is a separate type: \`IReservationPolicy\` describes how many reservations per week an
employee with a given job title may have. The domain picks the policy by \`jobTitle\`
(\`CanBeApplied\`) and asks it for permission (\`CanReserve\`). A new rule = a new class,
zero changes in the existing ones.

## Task

In \`dzien4-architektura/myspot\` implement the missing \`ManagerReservationPolicy\`
(file \`Modules/Reservations/.../Core/Policies/ManagerReservationPolicy.cs\` - instructions
in the TODO comment):

1. \`internal sealed class ManagerReservationPolicy : IReservationPolicy\`.
2. \`CanBeApplied\` returns \`true\` for a \`jobTitle\` equal to \`JobTitle.Manager\`.
3. \`CanReserve\` allows a manager at most 4 reservations per week.

Look at the neighbouring policies (\`BossReservationPolicy\`, \`RegularEmployeeReservationPolicy\`)
and at \`WeeklyReservationsService\`, which receives \`IEnumerable<IReservationPolicy>\`.

## What you will observe

Without this class a manager cannot make any reservation: no policy answers to their
\`jobTitle\`. Once you add the class, the manager limit starts working - and you registered the
class nowhere. Check \`Reservations.Application/Extensions.cs\` to see who found it.
    `,
    hintPl: 'Dwie krótkie metody: \`CanBeApplied\` to pattern matching \`jobTitle is JobTitle.Manager\`, \`CanReserve\` liczy elementy kolekcji (\`reservations.Count()\`) i porównuje z limitem 4. Wzór masz obok, w \`BossReservationPolicy\`.',
    hint: 'Two short methods: \`CanBeApplied\` is pattern matching \`jobTitle is JobTitle.Manager\`, \`CanReserve\` counts the collection elements (\`reservations.Count()\`) and compares with the limit of 4. The template is next door, in \`BossReservationPolicy\`.',
    solution: `internal sealed class ManagerReservationPolicy : IReservationPolicy
{
    public bool CanBeApplied(string jobTitle)
        => jobTitle is JobTitle.Manager;

    public bool CanReserve(IEnumerable<Reservation> reservations)
    {
        var totalEmployeeReservations = reservations.Count();
        return totalEmployeeReservations <= 4;
    }
}`,
    solutionExplanationPl: 'Polityka to strategia: reguła "manager może mieć maksymalnie 4 rezerwacje" jest zamknięta w jednym typie zamiast rozsiana po \`if\`-ach. \`WeeklyReservationsService\` dostaje wszystkie polityki jako \`IEnumerable<IReservationPolicy>\` i filtruje je przez \`CanBeApplied\` - dodanie stanowiska nie zmienia serwisu. Rejestrację załatwia Scrutor w \`Reservations.Application/Extensions.cs\`: \`services.Scan(...).AddClasses(c => c.AssignableTo<IReservationPolicy>())\` znajduje każdą implementację w assembly Core. Ten sam mechanizm konwencji co przy command handlerach w Zadaniu 2.',
    solutionExplanation: 'A policy is a strategy: the rule "a manager may have at most 4 reservations" is enclosed in one type instead of scattered across \`if\`-s. \`WeeklyReservationsService\` receives all policies as \`IEnumerable<IReservationPolicy>\` and filters them via \`CanBeApplied\` - adding a job title does not change the service. Registration is handled by Scrutor in \`Reservations.Application/Extensions.cs\`: \`services.Scan(...).AddClasses(c => c.AssignableTo<IReservationPolicy>())\` finds every implementation in the Core assembly. The same convention mechanism as for command handlers in Task 2.',
    relatedFiles: [
      'dzien4-architektura/myspot/src/Modules/Reservations/MySpot.Modules.Reservations.Core/Policies/ManagerReservationPolicy.cs',
      'dzien4-architektura/myspot/src/Modules/Reservations/MySpot.Modules.Reservations.Core/Policies/IReservationPolicy.cs',
      'dzien4-architektura/myspot/src/Modules/Reservations/MySpot.Modules.Reservations.Core/Policies/BossReservationPolicy.cs',
      'dzien4-architektura/myspot/src/Modules/Reservations/MySpot.Modules.Reservations.Application/Extensions.cs',
    ],
  },

  // ===================================================================
  // Z4 - Współdzielony kontrakt modułu (komunikacja synchroniczna)
  // ===================================================================
  {
    id: 'd4-exercise-04',
    sequenceNumber: 4,
    title: 'The Availability module shared contract',
    titlePl: 'Współdzielony kontrakt modułu Availability',
    category: 'Synchronous communication',
    categoryPl: 'Komunikacja synchroniczna',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Gdy moduł potrzebuje czegoś od innego modułu synchronicznie, nie może sięgać do jego wnętrza.
Availability wystawia więc osobną, minimalną paczkę \`MySpot.Modules.Availability.Shared\`:
publiczny interfejs \`IAvailabilityModuleApi\` + DTO. Konsument (np. \`ParkingSpots.Core\`
referencjonuje tę paczkę) widzi TYLKO kontrakt. Implementacja żyje w warstwie Application
modułu i jest \`internal\` - granicę modułu wyznaczają modyfikatory dostępności, nie dobra wola.

## Zadanie

W \`dzien4-architektura/myspot\` zaimplementuj kontrakt (instrukcja w komentarzu TODO):

1. W \`Modules/Availability/.../Application/Modules/AvailabilityModuleApi.cs\` dodaj klasę
   \`internal sealed class AvailabilityModuleApi : IAvailabilityModuleApi\`.
2. Wstrzyknij \`IDispatcher\` przez konstruktor.
3. W \`AddResourceAsync\` przetłumacz \`AddResourceDto\` (typ publiczny z paczki Shared)
   na wewnętrzną komendę \`AddResource\` i wyślij ją przez \`_dispatcher.SendAsync(...)\`.
4. Odkomentuj rejestrację \`services.AddScoped<IAvailabilityModuleApi, AvailabilityModuleApi>()\`
   w \`Application/Extensions.cs\` (drugi komentarz TODO).

## Co zaobserwujesz

Konsument programuje przeciwko \`IAvailabilityModuleApi\` i \`AddResourceDto\` - i to jest CAŁA
wiedza, jaką ma o Availability. Komendy, encje i handlery modułu pozostają \`internal\`,
więc kompilator fizycznie nie pozwoli innemu modułowi się do nich przywiązać. Porównaj z
\`AvailabilityApiClient\` w ParkingSpots, który to samo wywołanie robi przez \`IModuleClient\`
i ścieżkę \`availability/resources/add\` (luźniejszy, ale nietypowany wariant tej samej granicy).
    `,
    description: `
## Why it matters

When a module needs something from another module synchronously, it must not reach into its
internals. Availability therefore exposes a separate, minimal package
\`MySpot.Modules.Availability.Shared\`: the public \`IAvailabilityModuleApi\` interface + DTOs.
The consumer (e.g. \`ParkingSpots.Core\` references this package) sees ONLY the contract.
The implementation lives in the module's Application layer and is \`internal\` - the module
boundary is enforced by access modifiers, not by good will.

## Task

In \`dzien4-architektura/myspot\` implement the contract (instructions in the TODO comment):

1. In \`Modules/Availability/.../Application/Modules/AvailabilityModuleApi.cs\` add the class
   \`internal sealed class AvailabilityModuleApi : IAvailabilityModuleApi\`.
2. Inject \`IDispatcher\` via the constructor.
3. In \`AddResourceAsync\` translate \`AddResourceDto\` (a public type from the Shared package)
   into the internal \`AddResource\` command and send it via \`_dispatcher.SendAsync(...)\`.
4. Uncomment the \`services.AddScoped<IAvailabilityModuleApi, AvailabilityModuleApi>()\`
   registration in \`Application/Extensions.cs\` (the second TODO comment).

## What you will observe

The consumer programs against \`IAvailabilityModuleApi\` and \`AddResourceDto\` - and that is ALL
it knows about Availability. The module's commands, entities and handlers stay \`internal\`,
so the compiler physically prevents another module from coupling to them. Compare with the
\`AvailabilityApiClient\` in ParkingSpots, which makes the same call via \`IModuleClient\` and the
\`availability/resources/add\` path (a looser, untyped variant of the same boundary).
    `,
    hintPl: 'Klasa ma jedno pole \`IDispatcher\` i jedną metodę: \`AddResourceAsync\` tworzy \`new AddResource(dto.ResourceId, dto.Capacity, dto.Tags)\` i robi \`await _dispatcher.SendAsync(...)\`. Rejestracja: jedna linia \`AddScoped\` w \`AddApplication\` - bez niej kontener nie zna implementacji i konsument dostanie wyjątek przy resolve.',
    hint: 'The class has one \`IDispatcher\` field and one method: \`AddResourceAsync\` creates \`new AddResource(dto.ResourceId, dto.Capacity, dto.Tags)\` and does \`await _dispatcher.SendAsync(...)\`. Registration: one \`AddScoped\` line in \`AddApplication\` - without it the container does not know the implementation and the consumer gets an exception on resolve.',
    solution: `// Application/Modules/AvailabilityModuleApi.cs
internal sealed class AvailabilityModuleApi : IAvailabilityModuleApi
{
    private readonly IDispatcher _dispatcher;

    public AvailabilityModuleApi(IDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    public async Task AddResourceAsync(AddResourceDto dto)
    {
        await _dispatcher.SendAsync(new AddResource(dto.ResourceId, dto.Capacity, dto.Tags));
    }
}

// Application/Extensions.cs
public static IServiceCollection AddApplication(this IServiceCollection services)
{
    services.AddScoped<IAvailabilityModuleApi, AvailabilityModuleApi>();

    return services;
}`,
    solutionExplanationPl: 'Kontrakt i implementacja są celowo rozdzielone: \`IAvailabilityModuleApi\` + \`AddResourceDto\` mieszkają w publicznej paczce Shared (to jedyne, co moduł eksportuje), a \`AvailabilityModuleApi\` jest \`internal\` w Application i tłumaczy DTO na wewnętrzną komendę. Konsument nie wie, że pod spodem jest CQRS i \`IDispatcher\` - może to jutro być cokolwiek innego. To ta sama zasada, co public/internal w bibliotece: powierzchnia kontraktu ma być minimalna, bo wszystko, co publiczne, ktoś kiedyś użyje. Przy wyjmowaniu modułu do osobnej usługi paczka Shared staje się naturalnym kandydatem na kontrakt sieciowy.',
    solutionExplanation: 'Contract and implementation are deliberately separated: \`IAvailabilityModuleApi\` + \`AddResourceDto\` live in the public Shared package (the only thing the module exports), while \`AvailabilityModuleApi\` is \`internal\` in Application and translates the DTO into an internal command. The consumer does not know that CQRS and \`IDispatcher\` sit underneath - tomorrow it could be anything else. It is the same principle as public/internal in a library: the contract surface must be minimal, because everything public will eventually be used by someone. When extracting the module into a separate service, the Shared package becomes the natural candidate for the network contract.',
    relatedFiles: [
      'dzien4-architektura/myspot/src/Modules/Availability/MySpot.Modules.Availability.Application/Modules/AvailabilityModuleApi.cs',
      'dzien4-architektura/myspot/src/Modules/Availability/MySpot.Modules.Availability.Application/Extensions.cs',
      'dzien4-architektura/myspot/src/Modules/Availability/MySpot.Modules.Availability.Shared/IAvailabilityModuleApi.cs',
      'dzien4-architektura/myspot/src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Clients/AvailabilityApiClient.cs',
    ],
  },

  // ===================================================================
  // Z5 - Komunikacja asynchroniczna między modułami (Mapper, anti-corruption)
  // ===================================================================
  {
    id: 'd4-exercise-05',
    sequenceNumber: 5,
    title: 'Wire two modules with an event-driven mapper',
    titlePl: 'Spnij dwa moduły mapperem sterowanym zdarzeniami',
    category: 'Asynchronous communication',
    categoryPl: 'Komunikacja asynchroniczna',
    timeMinutes: 12,
    descriptionPl: `
## Po co to

Moduły nie powinny wołać się bezpośrednio (to sprzęga je na sztywno). Zamiast tego moduł
publikuje fakt (event), a inny na niego reaguje. Warstwa \`Mapper\` (anti-corruption) tłumaczy
event jednego modułu na komendę drugiego, żeby żaden nie znał wewnętrznego języka drugiego.
Przepływ: \`ParkingSpots\` publikuje \`ParkingSpotCreated\` - \`Mapper\` reaguje - publikuje
\`AddResource\` - \`Availability\`.

## Zadanie

W \`dzien4-architektura/myspot\` zaimplementuj klasę \`Mapper\` (plik \`Mapper.cs\` w module
Mapping - instrukcja w komentarzu TODO):

1. \`internal sealed class Mapper : IEventHandler<ParkingSpotCreated>, IEventHandler<ParkingSpotDeleted>\`.
2. Wstrzyknij \`IMessageBroker\` przez konstruktor.
3. W \`HandleAsync(ParkingSpotCreated)\` opublikuj \`AddResource\` z \`ResourceId = event.ParkingSpotId\`,
   \`Capacity = 2\`, \`Tags = ["parking_spot"]\`.
4. W \`HandleAsync(ParkingSpotDeleted)\` opublikuj \`DeleteResource\` z \`ResourceId = event.ParkingSpotId\`.

Komendy (\`AddResource\`, \`DeleteResource\`) i eventy (\`ParkingSpotCreated\`, \`ParkingSpotDeleted\`)
są już zdefiniowane w folderze modułu.

## Co zaobserwujesz

Utworzenie miejsca parkingowego (\`ParkingSpots\`) skutkuje - przez in-memory event bus i mapper -
utworzeniem zasobu w \`Availability\`, choć moduły nie mają do siebie żadnej referencji. Event bus
izoluje typy przez re-serializację, więc \`Mapper\` operuje na własnych kopiach kontraktów.
    `,
    description: `
## Why it matters

Modules should not call each other directly (that couples them tightly). Instead a module
publishes a fact (event) and another reacts to it. A \`Mapper\` (anti-corruption) layer translates
one module's event into another's command, so neither knows the other's internal language.
Flow: \`ParkingSpots\` publishes \`ParkingSpotCreated\` - \`Mapper\` reacts - publishes
\`AddResource\` - \`Availability\`.

## Task

In \`dzien4-architektura/myspot\` implement the \`Mapper\` class (file \`Mapper.cs\` in the Mapping
module - instructions in the TODO comment):

1. \`internal sealed class Mapper : IEventHandler<ParkingSpotCreated>, IEventHandler<ParkingSpotDeleted>\`.
2. Inject \`IMessageBroker\` via the constructor.
3. In \`HandleAsync(ParkingSpotCreated)\` publish \`AddResource\` with \`ResourceId = event.ParkingSpotId\`,
   \`Capacity = 2\`, \`Tags = ["parking_spot"]\`.
4. In \`HandleAsync(ParkingSpotDeleted)\` publish \`DeleteResource\` with \`ResourceId = event.ParkingSpotId\`.

The commands (\`AddResource\`, \`DeleteResource\`) and events (\`ParkingSpotCreated\`, \`ParkingSpotDeleted\`)
are already defined in the module's folder.

## What you will observe

Creating a parking spot (\`ParkingSpots\`) results - through the in-memory event bus and mapper -
in a resource being created in \`Availability\`, even though the modules have no reference to each
other. The event bus isolates types by re-serialization, so \`Mapper\` works on its own copies of the contracts.
    `,
    hintPl: 'Dwie metody \`HandleAsync\`, każda deleguje do \`_messageBroker.PublishAsync(...)\`. Dla \`ParkingSpotCreated\` publikujesz \`new AddResource(@event.ParkingSpotId, 2, new[] { "parking_spot" })\`; dla \`ParkingSpotDeleted\` - \`new DeleteResource(@event.ParkingSpotId)\`. Konstruktor przyjmuje i zapamiętuje \`IMessageBroker\`.',
    hint: 'Two \`HandleAsync\` methods, each delegating to \`_messageBroker.PublishAsync(...)\`. For \`ParkingSpotCreated\` publish \`new AddResource(@event.ParkingSpotId, 2, new[] { "parking_spot" })\`; for \`ParkingSpotDeleted\` - \`new DeleteResource(@event.ParkingSpotId)\`. The constructor takes and stores \`IMessageBroker\`.',
    solution: `internal sealed class Mapper : IEventHandler<ParkingSpotCreated>, IEventHandler<ParkingSpotDeleted>
{
    private readonly IMessageBroker _messageBroker;

    public Mapper(IMessageBroker messageBroker) => _messageBroker = messageBroker;

    public Task HandleAsync(ParkingSpotCreated @event, CancellationToken cancellationToken = default)
        => _messageBroker.PublishAsync(
            new AddResource(@event.ParkingSpotId, 2, new[] { "parking_spot" }), cancellationToken);

    public Task HandleAsync(ParkingSpotDeleted @event, CancellationToken cancellationToken = default)
        => _messageBroker.PublishAsync(
            new DeleteResource(@event.ParkingSpotId), cancellationToken);
}`,
    solutionExplanationPl: '\`Mapper\` jest warstwą anti-corruption: reaguje na eventy \`ParkingSpots\` i tłumaczy je na komendy \`Availability\`, publikując je przez \`IMessageBroker\`. Dzięki temu \`ParkingSpots\` nie zna \`Availability\` (publikuje tylko fakt), a \`Availability\` nie zna \`ParkingSpots\` (dostaje własną komendę). In-memory event bus dopasowuje odbiorców po nazwie typu i re-serializuje dane, więc moduły nie dzielą instancji ani typów - izolacja jak w systemie rozproszonym, ale w jednym procesie. To asynchroniczny odpowiednik granicy z Zadania 4.',
    solutionExplanation: '\`Mapper\` is an anti-corruption layer: it reacts to \`ParkingSpots\` events and translates them into \`Availability\` commands, publishing them via \`IMessageBroker\`. So \`ParkingSpots\` does not know \`Availability\` (it only publishes a fact), and \`Availability\` does not know \`ParkingSpots\` (it receives its own command). The in-memory event bus matches receivers by type name and re-serializes the data, so modules share neither instances nor types - isolation like in a distributed system, but in a single process. It is the asynchronous counterpart of the boundary from Task 4.',
    relatedFiles: [
      'dzien4-architektura/myspot/src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Mapper.cs',
      'dzien4-architektura/myspot/src/Shared/MySpot.Shared.Infrastructure/Modules/ModuleClient.cs',
    ],
  },

  // ===================================================================
  // Z6 - Odporność zewnętrznego wywołania (Polly)
  // ===================================================================
  {
    id: 'd4-exercise-06',
    sequenceNumber: 6,
    title: 'Make the external email call resilient (Polly)',
    titlePl: 'Uodpornij zewnętrzne wywołanie email (Polly)',
    category: 'Resilience',
    categoryPl: 'Odporność',
    timeMinutes: 10,
    descriptionPl: `
## Po co to

Komunikacja wewnątrz monolitu jest wewnątrz-procesowa i niezawodna, ale gdy moduł woła
usługę ZEWNĘTRZNĄ po HTTP, sieć zawodzi: timeouty, chwilowe błędy, przeciążenie. \`EmailApiClient\`
w module Notifications woła zewnętrzne API e-mail, ale dziś nie ma żadnej odporności - pierwszy
błąd leci wyjątkiem. Dokładamy wzorce odpornościowe (retry, circuit breaker, timeout) przez Polly.

## Zadanie

W \`dzien4-architektura/myspot\` (moduł Notifications) uodpornij wywołanie:

1. Zarejestruj \`EmailApiClient\` jako typed client i dołóż standardowy handler odporności:
   \`services.AddHttpClient<IEmailApiClient, EmailApiClient>().AddStandardResilienceHandler();\`
   (pakiet \`Microsoft.Extensions.Http.Resilience\`, Polly v8). Zastąp tym obecną rejestrację
   \`AddSingleton\` w \`NotificationsModule.Register\`.
2. Dostosuj \`EmailApiClient\`, by przyjmował \`HttpClient\` przez konstruktor (zamiast tworzyć go
   z \`IHttpClientFactory\`), tak by resilience handler obejmował jego wywołania.

## Co zaobserwujesz

\`AddStandardResilienceHandler\` daje z pudełka: retry z backoffem, circuit breaker i timeout.
Przy chwilowym błędzie zewnętrznego API klient ponawia żądanie zamiast od razu rzucać wyjątkiem,
a przy trwałej awarii circuit breaker odcina wywołania, żeby nie kaskadować obciążenia. To
kontrast: wewnątrz monolitu odporność nie jest potrzebna, na granicy sieciowej jest obowiązkowa.
    `,
    description: `
## Why it matters

Communication inside the monolith is in-process and reliable, but when a module calls an
EXTERNAL service over HTTP, the network fails: timeouts, transient errors, overload.
\`EmailApiClient\` in the Notifications module calls an external email API, but today it has no
resilience - the first error throws. We add resilience patterns (retry, circuit breaker, timeout) via Polly.

## Task

In \`dzien4-architektura/myspot\` (Notifications module) make the call resilient:

1. Register \`EmailApiClient\` as a typed client and add the standard resilience handler:
   \`services.AddHttpClient<IEmailApiClient, EmailApiClient>().AddStandardResilienceHandler();\`
   (package \`Microsoft.Extensions.Http.Resilience\`, Polly v8). Replace the current
   \`AddSingleton\` registration in \`NotificationsModule.Register\` with it.
2. Adjust \`EmailApiClient\` to take \`HttpClient\` via the constructor (instead of building one from
   \`IHttpClientFactory\`), so the resilience handler covers its calls.

## What you will observe

\`AddStandardResilienceHandler\` gives out of the box: retry with backoff, a circuit breaker and a
timeout. On a transient error from the external API the client retries instead of throwing straight
away, and on a lasting outage the circuit breaker cuts calls off so load does not cascade. The
contrast: inside the monolith resilience is not needed, at the network boundary it is mandatory.
    `,
    hintPl: 'Rejestracja typed clienta \`AddHttpClient<IEmailApiClient, EmailApiClient>()\` zwraca \`IHttpClientBuilder\`, na którym wołasz \`.AddStandardResilienceHandler()\`. Zmień konstruktor \`EmailApiClient\` na \`public EmailApiClient(HttpClient client, ...)\` i używaj wstrzykniętego \`client\` zamiast \`_factory.CreateClient()\`.',
    hint: 'Registering the typed client \`AddHttpClient<IEmailApiClient, EmailApiClient>()\` returns an \`IHttpClientBuilder\` on which you call \`.AddStandardResilienceHandler()\`. Change the \`EmailApiClient\` constructor to \`public EmailApiClient(HttpClient client, ...)\` and use the injected \`client\` instead of \`_factory.CreateClient()\`.',
    solution: `// Rejestracja w NotificationsModule.Register
services.AddHttpClient<IEmailApiClient, EmailApiClient>()
    .AddStandardResilienceHandler();

// EmailApiClient - przyjmuje HttpClient przez konstruktor
internal sealed class EmailApiClient : IEmailApiClient
{
    private const string Url = "http://localhost:5090";
    private readonly HttpClient _client;
    private readonly ILogger<EmailApiClient> _logger;

    public EmailApiClient(HttpClient client, ILogger<EmailApiClient> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task SendAsync(string receiver, string title, string body)
    {
        try
        {
            var response = await _client.PostAsJsonAsync($"{Url}/send-email", new {receiver, title, body});
            if (response.IsSuccessStatusCode)
            {
                return;
            }

            throw new CannotSendEmailException(receiver);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, exception.Message);
            throw new CannotSendEmailException(receiver);
        }
    }
}`,
    solutionExplanationPl: 'Typed client rejestruje \`HttpClient\` skonfigurowany pod jedną usługę i wstrzykuje go do \`EmailApiClient\`. \`AddStandardResilienceHandler\` wpina pipeline Polly v8 (retry + circuit breaker + timeout) w łańcuch handlerów tego klienta, więc odporność działa transparentnie dla kodu wołającego. Kluczowa lekcja: odporność dobiera się do GRANICY - wewnątrz procesu jest zbędna, na granicy sieciowej chroni przed kaskadą awarii.',
    solutionExplanation: 'The typed client registers an \`HttpClient\` configured for one service and injects it into \`EmailApiClient\`. \`AddStandardResilienceHandler\` plugs a Polly v8 pipeline (retry + circuit breaker + timeout) into that client\'s handler chain, so resilience works transparently for the calling code. The key lesson: resilience is matched to the BOUNDARY - inside the process it is unnecessary, at the network boundary it guards against a cascade of failures.',
    relatedFiles: [
      'dzien4-architektura/myspot/src/Modules/Notifications/MySpot.Modules.Notifications.Api/Clients/EmailApiClient.cs',
      'dzien4-architektura/myspot/src/Modules/Notifications/MySpot.Modules.Notifications.Api/NotificationsModule.cs',
    ],
    externalLink: 'https://learn.microsoft.com/dotnet/core/resilience/http-resilience',
    externalLinkLabel: 'HTTP resilience with Polly',
    externalLinkLabelPl: 'Odporność HTTP z Polly',
  },

  // ===================================================================
  // Z7 - Custom trace + Jaeger (OpenTelemetry) - dla chętnych
  // ===================================================================
  {
    id: 'd4-exercise-07',
    sequenceNumber: 7,
    title: 'Custom trace in Jaeger with OpenTelemetry (optional)',
    titlePl: 'Custom trace w Jaeger z OpenTelemetry (dla chętnych)',
    category: 'Observability',
    categoryPl: 'Observability',
    timeMinutes: 15,
    descriptionPl: `
## Po co to

Zadanie dla chętnych. Log mówi, CO się stało; trace pokazuje, JAK żądanie przepłynęło przez
system: ile trwał każdy krok i co z czego wynikło. .NET ma distributed tracing wbudowany
(\`ActivitySource\` w \`System.Diagnostics\`), OpenTelemetry go zbiera i eksportuje, a Jaeger
wizualizuje. W \`docker-compose.yml\` MySpota czeka już serwis \`jaeger\` (UI: \`localhost:16686\`,
kolektor OTLP gRPC: \`localhost:4317\`).

## Zadanie

W \`dzien4-architektura/myspot\`:

1. Do projektu \`MySpot.Bootstrapper\` dodaj pakiety: \`OpenTelemetry.Extensions.Hosting\`,
   \`OpenTelemetry.Instrumentation.AspNetCore\`, \`OpenTelemetry.Exporter.OpenTelemetryProtocol\`.
2. W \`Program.cs\` skonfiguruj tracing: \`builder.Services.AddOpenTelemetry().WithTracing(...)\`
   z \`AddAspNetCoreInstrumentation()\`, \`AddSource("MySpot.Messaging")\`
   i \`AddOtlpExporter(...)\` wskazującym \`http://localhost:4317\`.
3. Custom trace: w \`Shared.Infrastructure/Messaging/Brokers/InMemoryMessageBroker.cs\` dodaj
   statyczny \`ActivitySource("MySpot.Messaging")\` i otwórz span wokół publikacji każdej
   wiadomości: \`StartActivity($"publish {name}")\` + tagi (typ wiadomości, moduł, correlation id -
   broker ma te wartości pod ręką w pętli publikacji).
4. Uruchom \`docker compose up -d\`, wystartuj MySpota, wykonaj \`POST /sign-up\` przez API
   i otwórz Jaeger UI (\`http://localhost:16686\`).

## Co zaobserwujesz

W Jaegerze zobaczysz jeden trace, w którym żądanie HTTP \`POST /sign-up\` (span z instrumentacji
ASP.NET Core) ma pod sobą Twój własny span \`publish signed_up\` z tagami. Spany łączą się
automatycznie, bo \`Activity.Current\` propaguje kontekst - nic nie przekazywałeś ręcznie.
Tak samo wygląda trace w systemie rozproszonym, tylko spany pochodzą z różnych procesów.
    `,
    description: `
## Why it matters

An optional task. A log says WHAT happened; a trace shows HOW a request flowed through the
system: how long each step took and what followed from what. .NET has distributed tracing
built in (\`ActivitySource\` in \`System.Diagnostics\`), OpenTelemetry collects and exports it,
and Jaeger visualizes it. The \`jaeger\` service is already waiting in MySpot's
\`docker-compose.yml\` (UI: \`localhost:16686\`, OTLP gRPC collector: \`localhost:4317\`).

## Task

In \`dzien4-architektura/myspot\`:

1. Add packages to the \`MySpot.Bootstrapper\` project: \`OpenTelemetry.Extensions.Hosting\`,
   \`OpenTelemetry.Instrumentation.AspNetCore\`, \`OpenTelemetry.Exporter.OpenTelemetryProtocol\`.
2. In \`Program.cs\` configure tracing: \`builder.Services.AddOpenTelemetry().WithTracing(...)\`
   with \`AddAspNetCoreInstrumentation()\`, \`AddSource("MySpot.Messaging")\`
   and \`AddOtlpExporter(...)\` pointing at \`http://localhost:4317\`.
3. Custom trace: in \`Shared.Infrastructure/Messaging/Brokers/InMemoryMessageBroker.cs\` add a
   static \`ActivitySource("MySpot.Messaging")\` and open a span around each message publication:
   \`StartActivity($"publish {name}")\` + tags (message type, module, correlation id - the broker
   has these values at hand in the publish loop).
4. Run \`docker compose up -d\`, start MySpot, execute \`POST /sign-up\` through the API
   and open the Jaeger UI (\`http://localhost:16686\`).

## What you will observe

In Jaeger you will see a single trace where the HTTP request \`POST /sign-up\` (a span from the
ASP.NET Core instrumentation) has your own \`publish signed_up\` span with tags underneath.
The spans connect automatically because \`Activity.Current\` propagates the context - you passed
nothing by hand. A trace in a distributed system looks exactly the same, only the spans come
from different processes.
    `,
    hintPl: 'Trzy miejsca: csproj (trzy \`PackageReference\`), \`Program.cs\` (\`AddOpenTelemetry().WithTracing(...)\` przed \`builder.Build()\`), broker (statyczne pole \`ActivitySource\` + \`using var activity = ActivitySource.StartActivity(...)\` w pętli \`foreach\` w \`PublishAsync\`, obok istniejącego logowania). Nazwa źródła w \`AddSource\` musi być identyczna z nazwą w \`new ActivitySource(...)\`, inaczej spany nie trafią do eksportera.',
    hint: 'Three places: the csproj (three \`PackageReference\` entries), \`Program.cs\` (\`AddOpenTelemetry().WithTracing(...)\` before \`builder.Build()\`), the broker (a static \`ActivitySource\` field + \`using var activity = ActivitySource.StartActivity(...)\` in the \`foreach\` loop in \`PublishAsync\`, next to the existing logging). The source name in \`AddSource\` must match the name in \`new ActivitySource(...)\` exactly, otherwise the spans never reach the exporter.',
    solution: `// Program.cs (Bootstrapper) - przed builder.Build()
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("MySpot"))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddSource("MySpot.Messaging")
        .AddOtlpExporter(options => options.Endpoint = new Uri("http://localhost:4317")));

// InMemoryMessageBroker.cs - statyczne źródło spanów
private static readonly ActivitySource ActivitySource = new("MySpot.Messaging");

// InMemoryMessageBroker.PublishAsync - span wokół publikacji, w pętli foreach
foreach (var message in messages)
{
    var messageContext = new MessageContext(Guid.NewGuid(), _context);
    _messageContextRegistry.Set(message, messageContext);

    var module = message.GetModuleName();
    var name = message.GetType().Name.Underscore();
    var correlationId = messageContext.Context.CorrelationId;

    // Custom span: widoczny w Jaegerze pod spanem żądania HTTP
    using var activity = ActivitySource.StartActivity($"publish {name}");
    activity?.SetTag("message.type", message.GetType().Name);
    activity?.SetTag("message.module", module);
    activity?.SetTag("message.correlation_id", correlationId);

    _logger.LogInformation("Publishing a message: {Name} ({Module})...", name, module);
}`,
    solutionExplanationPl: 'Trzy warstwy, każda z innym zadaniem: \`ActivitySource\`/\`Activity\` to wbudowany w .NET model tracingu (zero zależności w kodzie domenowym poza \`System.Diagnostics\`), OpenTelemetry to standard zbierania i eksportu (konfigurowany raz, w bootstrapperze), Jaeger to tylko wizualizacja. Span brokera podpina się pod span żądania HTTP automatycznie, bo \`StartActivity\` dziedziczy kontekst z \`Activity.Current\` - to ta sama propagacja, która w systemie rozproszonym leci nagłówkiem \`traceparent\`. Instrumentując broker (a nie pojedynczy handler) dostajesz spany dla WSZYSTKICH wiadomości w systemie za darmo.',
    solutionExplanation: 'Three layers, each with a different job: \`ActivitySource\`/\`Activity\` is the tracing model built into .NET (zero dependencies in domain code beyond \`System.Diagnostics\`), OpenTelemetry is the collection and export standard (configured once, in the bootstrapper), Jaeger is just the visualization. The broker span attaches under the HTTP request span automatically because \`StartActivity\` inherits context from \`Activity.Current\` - the same propagation that travels as the \`traceparent\` header in a distributed system. By instrumenting the broker (not a single handler) you get spans for ALL messages in the system for free.',
    relatedFiles: [
      'dzien4-architektura/myspot/docker-compose.yml',
      'dzien4-architektura/myspot/src/Bootstrapper/MySpot.Bootstrapper/Program.cs',
      'dzien4-architektura/myspot/src/Bootstrapper/MySpot.Bootstrapper/MySpot.Bootstrapper.csproj',
      'dzien4-architektura/myspot/src/Shared/MySpot.Shared.Infrastructure/Messaging/Brokers/InMemoryMessageBroker.cs',
    ],
    externalLink: 'https://learn.microsoft.com/dotnet/core/diagnostics/observability-with-otel',
    externalLinkLabel: '.NET observability with OpenTelemetry',
    externalLinkLabelPl: 'Observability w .NET z OpenTelemetry',
  },
];
