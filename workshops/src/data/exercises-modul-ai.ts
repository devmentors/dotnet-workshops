import type { Exercise } from '../types/Exercise';

// Moduł AI do Dnia 2 — 4 ćwiczenia RED→GREEN w osobnej solucji
// dzien2-ekosystem/ai-cwiczenia/AiLab.sln (poza solucją sklepu Dzien2.sln).
// JEDEN zredukowany flow "TicketFlow-lite" (wzorowany na M8L4, reference-only):
//   Agent(web) -> HTTP+X-User-* -> McpServer(web) -> TicketsApiClient -> TicketsApi(web) -> dane.
// Runner apki celuje w solucję przez testCwd. Testy integracyjne używają WebApplicationFactory
// + stub domenowego API (counting fake); ex1 mockuje LLM — wszystko działa bez klucza.
export const modulAiExercises: Exercise[] = [
  {
    id: 'd2-ai-01',
    sequenceNumber: 12,
    title: 'Tool calling: automatic vs manual',
    titlePl: 'Tool calling: tryb automatyczny vs ręczny',
    category: 'AI in .NET',
    categoryPl: 'AI w .NET',
    timeMinutes: 10,
    description: `## Why it matters
The model does not run functions — it **asks** you to call them (name + arguments). The automatic path (\`FunctionInvokingChatClient\`, the Agent's real chat path) hides the loop; here you walk the same loop by hand (reason → act → observe). In production this manual loop grows into an autonomous agent (cf. M8L4 Escalation) — here we keep it trivial.

## Task
\`ManualToolLoop.RunAsync\` (\`AiLab.Agent/ManualLoop/ManualToolLoop.cs\`) prints the question, then the TYPE of each response part (\`TextContent\` / \`FunctionCallContent\`). Your job is the \`FunctionCallContent\` branch (marked \`// TODO (#12): Wykonaj!\`): run the tool for that call and send its result back into \`messages\` as a Tool-role message — otherwise the model won't see it in TURA 2. Sibling \`ExampleAsync\` = the auto path (\`UseFunctionInvocation\`).

A built-in cross-check drops in a placeholder result when yours is missing, so the demo doesn't 400 in the RED state.

## What you will observe
No mock — real LLM (OpenRouter; key in \`ai-settings.json\`) + real \`AiLab.TicketsApi\`. Start \`AiLab.TicketsApi\` (:5500) and \`AiLab.Agent\` (:5080), then hit \`GET /demo/manual\`:
- RED: the question, \`[FUNCTION CALL] list_tickets\`, then \`(brak wyniku narzędzia — uzupełnij TODO)\`.
- GREEN: the tool hits the API and TURA 2 answers with your real tickets.
Mark complete when it works.`,
    descriptionPl: `## Po co to
Model nie wykonuje funkcji — **prosi** o jej wywołanie (nazwa + argumenty). Tryb automatyczny (\`FunctionInvokingChatClient\`, realna ścieżka Agenta) chowa pętlę; tutaj przechodzisz tę samą pętlę ręcznie (reason → act → observe). W produkcji ta ręczna pętla dorasta do autonomicznego agenta (por. M8L4 Escalation) — tu zostajemy przy prostym przypadku.

## Zadanie
\`ManualToolLoop.RunAsync\` (\`AiLab.Agent/ManualLoop/ManualToolLoop.cs\`) printuje pytanie, potem TYP każdego fragmentu odpowiedzi (\`TextContent\` / \`FunctionCallContent\`). Twoje zadanie to gałąź \`FunctionCallContent\` (oznaczona \`// TODO (#12): Wykonaj!\`): wykonaj narzędzie dla tego wywołania i dosyłasz jego wynik z powrotem do \`messages\` jako wiadomość roli Tool — inaczej model nie zobaczy go w TURZE 2. Wzór obok: \`ExampleAsync\` = tryb auto (\`UseFunctionInvocation\`).

Wbudowany cross-check wstawia zaślepkę wyniku, gdy Twojego brakuje — żeby demo nie wywaliło 400 w stanie RED.

## Co zaobserwujesz
Bez mocka — realny LLM (OpenRouter; klucz w \`ai-settings.json\`) + prawdziwy \`AiLab.TicketsApi\`. Uruchom \`AiLab.TicketsApi\` (:5500) i \`AiLab.Agent\` (:5080), potem uderz w \`GET /demo/manual\`:
- RED: pytanie, \`[FUNCTION CALL] list_tickets\`, potem \`(brak wyniku narzędzia — uzupełnij TODO)\`.
- GREEN: narzędzie trafia API, a TURA 2 odpowiada Twoimi realnymi ticketami.
Oznacz jako ukończone, gdy działa.`,
    hint: 'In the FunctionCallContent branch (toolCall): run the tool and add its result to messages as a Tool-role message (FunctionResultContent tied by CallId) — the model reads it in TURA 2. The auto sibling ExampleAsync (.UseFunctionInvocation) does this for you.',
    hintPl: 'W gałęzi FunctionCallContent (toolCall): wykonaj narzędzie i dodaj jego wynik do messages jako wiadomość roli Tool (FunctionResultContent powiązany po CallId) — model czyta go w TURZE 2. Wzór obok ExampleAsync (.UseFunctionInvocation) robi to za Ciebie.',
    relatedFiles: [
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.Agent/ManualLoop/ManualToolLoop.cs',
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.Agent/Tools/DirectHttpTools.cs',
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.Agent/Program.cs',    ],
    externalLink: 'http://localhost:3001/slides/dzien2-ekosystem/index.html',
    externalLinkLabel: 'AI slides',
    externalLinkLabelPl: 'Slajdy AI',
  },
  {
    id: 'd2-ai-02',
    sequenceNumber: 13,
    title: 'Expose a capability as an MCP tool (fronting the API)',
    titlePl: 'Wystaw zdolność jako narzędzie MCP (frontuje API)',
    category: 'AI in .NET',
    categoryPl: 'AI w .NET',
    timeMinutes: 10,
    description: `## Why it matters
An MCP tool is how a model reaches your system. The load-bearing rule: a tool **fronts a domain API, it does not touch the store/DB** (that boundary is exactly what the anti-pattern breaks). You author the whole tool: the \`[McpServerTool]\` + \`[Description]\` schema (without it the model never sees the tool), the call to the typed \`TicketsApiClient\`, and an LLM-friendly \`SemanticResponse\`.

## Task
Write \`GetTicketStatus\` in \`AiLab.McpServer/Tools/TicketTools.cs\` (fully-authored sibling: \`ListTickets\`):
1. mark it \`[McpServerTool(Name = "get_ticket_status")]\` + \`[Description]\` on method and parameter,
2. call \`_api.GetTicketAsync(ticketId)\` — never a store,
3. return \`TicketStatusResponse.ToJson()\` (on null → \`ErrorResponse\`).

Starting state (RED): no attributes (tool invisible) + throws. Test: \`AiLab.Tests.TicketToolApiTests\`.

## What you will observe
The integration test lists tools over a real MCP client and calls the tool; a counting fake proves it went through the API exactly once and returned a SemanticResponse.`,
    descriptionPl: `## Po co to
Narzędzie MCP to sposób, w jaki model sięga do Twojego systemu. Reguła nośna: narzędzie **frontuje domenowe API, nie dotyka store'a/bazy** (tę granicę łamie właśnie anty-wzorzec). Autorujesz całe narzędzie: schema \`[McpServerTool]\` + \`[Description]\` (bez niej model nie zobaczy narzędzia), wywołanie typed \`TicketsApiClient\` i LLM-friendly \`SemanticResponse\`.

## Zadanie
Napisz \`GetTicketStatus\` w \`AiLab.McpServer/Tools/TicketTools.cs\` (w pełni zautorowany wzór obok: \`ListTickets\`):
1. oznacz \`[McpServerTool(Name = "get_ticket_status")]\` + \`[Description]\` na metodzie i parametrze,
2. zawołaj \`_api.GetTicketAsync(ticketId)\` — nigdy store,
3. zwróć \`TicketStatusResponse.ToJson()\` (przy null → \`ErrorResponse\`).

Stan startowy (RED): brak atrybutów (narzędzie niewidoczne) + rzuca. Test: \`AiLab.Tests.TicketToolApiTests\`.

## Co zaobserwujesz
Test integracyjny listuje narzędzia przez realnego klienta MCP i woła narzędzie; counting fake dowodzi, że poszło przez API dokładnie raz i zwróciło SemanticResponse.`,
    hint: 'Copy the shape of ListTickets in the same class: attributes make it visible, the ctor-injected _api is the only data path, and the response is a SemanticResponse (summary + nextSteps), not the raw DTO. The response type is TicketStatusResponse; returning raw API JSON fails the SemanticResponse assertion.',
    hintPl: 'Skopiuj kształt ListTickets z tej samej klasy: atrybuty czynią je widocznym, wstrzyknięty w ctor _api to jedyna droga do danych, a odpowiedź to SemanticResponse (summary + nextSteps), nie surowy DTO. Typ odpowiedzi to TicketStatusResponse; surowy JSON z API obleje asercję SemanticResponse.',
    testFilter: 'FullyQualifiedName~AiLab.Tests.TicketToolApiTests',
    testCwd: 'dzien2-ekosystem/ai-cwiczenia',
    relatedFiles: [
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.McpServer/Tools/TicketTools.cs',
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.McpServer/Api/TicketsApiClient.cs',    ],
    externalLink: 'http://localhost:3001/slides/dzien2-ekosystem/index.html',
    externalLinkLabel: 'AI slides',
    externalLinkLabelPl: 'Slajdy AI',
  },
  {
    id: 'd2-ai-03',
    sequenceNumber: 14,
    title: 'MCP role gate as a real server filter',
    titlePl: 'Bramka ról MCP jako realny filtr serwera',
    category: 'AI in .NET',
    categoryPl: 'AI w .NET',
    timeMinutes: 15,
    description: `## Why it matters
A tool surface is a new attack surface. A role must get only its tools — and must **not** be able to call a privileged tool even knowing the name. Hiding a tool from the list is **not** authorization: you need two filters — one on **list**, one on the **call**.

## Task
Wire \`AddRoleGate\` in \`AiLab.McpServer/Security/RoleToolFilter.cs\` using the ready \`ToolRoleMap\` / \`ResolveRole\` / \`RoleCanUse\` siblings:
1. \`AddListToolsFilter\` — keep only tools allowed for the role,
2. \`AddCallToolFilter\` — return \`CallToolResult { IsError = true }\` when the role may not call it.

Starting state (RED): \`AddRoleGate\` wires nothing → an agent sees and calls \`close_ticket\`. Test (both branches, no model): \`AiLab.Tests.RoleGateServerTests\`.

## What you will observe
Over a real MCP client: role \`agent\` must not see \`close_ticket\` in the list AND must be refused on the call; role \`admin\` sees and succeeds.`,
    descriptionPl: `## Po co to
Surface narzędzia = nowy attack surface. Rola dostaje tylko swoje narzędzia — i uprzywilejowanego **nie może** wywołać, nawet znając nazwę. Ukrycie na liście to **nie** autoryzacja: potrzebujesz dwóch filtrów — na **liście** i na **wywołaniu**.

## Zadanie
Podłącz \`AddRoleGate\` w \`AiLab.McpServer/Security/RoleToolFilter.cs\`, używając gotowych \`ToolRoleMap\` / \`ResolveRole\` / \`RoleCanUse\`:
1. \`AddListToolsFilter\` — zostaw tylko narzędzia dozwolone dla roli,
2. \`AddCallToolFilter\` — zwróć \`CallToolResult { IsError = true }\`, gdy rola nie ma prawa wołać.

Stan startowy (RED): \`AddRoleGate\` nic nie podpina → agent widzi i wywołuje \`close_ticket\`. Test (obie gałęzie, bez modelu): \`AiLab.Tests.RoleGateServerTests\`.

## Co zaobserwujesz
Przez realnego klienta MCP: rola \`agent\` NIE widzi \`close_ticket\` na liście ORAZ dostaje odmowę przy wywołaniu; rola \`admin\` widzi i wykonuje.`,
    hint: 'Both filters read the role via ResolveRole(context.Services) and decide with RoleCanUse. The list filter returns a new ListToolsResult with the allowed tools; the call filter short-circuits with an IsError result before next(...). The trap: doing only the list filter passes the hide-from-list assertion but fails the call assertion.',
    hintPl: 'Oba filtry czytają rolę przez ResolveRole(context.Services) i decydują przez RoleCanUse. Filtr listy zwraca nowy ListToolsResult z dozwolonymi narzędziami; filtr wywołania robi short-circuit z wynikiem IsError przed next(...). Pułapka: sam filtr listy przejdzie asercję ukrycia, ale obleje asercję wywołania.',
    testFilter: 'FullyQualifiedName~AiLab.Tests.RoleGateServerTests',
    testCwd: 'dzien2-ekosystem/ai-cwiczenia',
    relatedFiles: [
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.McpServer/Security/RoleToolFilter.cs',    ],
    externalLink: 'http://localhost:3001/slides/dzien2-ekosystem/index.html',
    externalLinkLabel: 'AI slides',
    externalLinkLabelPl: 'Slajdy AI',
  },
  {
    id: 'd2-ai-04',
    sequenceNumber: 15,
    title: 'Fix the anti-pattern: route the tool through the API',
    titlePl: 'Napraw anty-wzorzec: przepnij narzędzie przez API',
    category: 'AI in .NET',
    categoryPl: 'AI w .NET',
    timeMinutes: 10,
    description: `## Why it matters
The anti-pattern MCP server reaches **straight into the store**, bypassing the domain API and skipping user scoping — so it leaks other users' tickets. That is a real layering + authorization defect (in M8L4 it was a direct \`NpgsqlConnection\` in the MCP layer).

## Task
Refactor \`QueryTickets\` in \`AiLab.McpServer.AntiPattern/Tools/DirectStoreTicketTools.cs\` (twin: the good server's \`TicketTools.ListTickets\`):
- call \`_api.ListTicketsAsync()\` instead of \`_store.QueryAll()\` — the typed client forwards \`X-User-Id\`, so the API scopes to the owner,
- return a \`SemanticResponse\` instead of raw rows.

Starting state (RED): reads the store directly, no scoping. Test: \`AiLab.Tests.DirectStoreRefactorTests\`.

## What you will observe
A store spy + a counting fake on the API prove the fix: after the refactor the API is hit, the store is untouched, and another user's owner no longer appears in the output.`,
    descriptionPl: `## Po co to
Anty-wzorcowy serwer MCP sięga **wprost do store'a**, omijając domenowe API i pomijając scoping — więc przecieka cudze tickety. To realny defekt warstw + autoryzacji (w M8L4 był to bezpośredni \`NpgsqlConnection\` w warstwie MCP).

## Zadanie
Zrefaktoruj \`QueryTickets\` w \`AiLab.McpServer.AntiPattern/Tools/DirectStoreTicketTools.cs\` (wzór: \`TicketTools.ListTickets\` z dobrego serwera):
- zawołaj \`_api.ListTicketsAsync()\` zamiast \`_store.QueryAll()\` — typed client forwarduje \`X-User-Id\`, więc API zawęzi do właściciela,
- zwróć \`SemanticResponse\` zamiast surowych wierszy.

Stan startowy (RED): czyta store wprost, bez scopingu. Test: \`AiLab.Tests.DirectStoreRefactorTests\`.

## Co zaobserwujesz
Spy na store + counting fake na API dowodzą naprawy: po refaktorze API jest trafione, store nietknięty, a cudzy właściciel znika z wyniku.`,
    hint: 'The good server\'s ListTickets is the exact shape: swap _store for _api.ListTicketsAsync(), make the method async, and wrap the result in a TicketListResponse (SemanticResponse). Scoping is not your job in the tool — the API does it once you go through TicketsApiClient (which forwards X-User-Id). The response type is TicketListResponse (SemanticResponse).',
    hintPl: 'ListTickets z dobrego serwera to dokładny kształt: zamień _store na _api.ListTicketsAsync(), zrób metodę async i opakuj wynik w TicketListResponse (SemanticResponse). Scoping to nie zadanie narzędzia — robi je API, gdy pójdziesz przez TicketsApiClient (forwarduje X-User-Id). Typ odpowiedzi to TicketListResponse (SemanticResponse).',
    testFilter: 'FullyQualifiedName~AiLab.Tests.DirectStoreRefactorTests',
    testCwd: 'dzien2-ekosystem/ai-cwiczenia',
    relatedFiles: [
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.McpServer.AntiPattern/Tools/DirectStoreTicketTools.cs',
      'dzien2-ekosystem/ai-cwiczenia/src/AiLab.McpServer/Tools/TicketTools.cs',    ],
    externalLink: 'http://localhost:3001/slides/dzien2-ekosystem/index.html',
    externalLinkLabel: 'AI slides',
    externalLinkLabelPl: 'Slajdy AI',
  },
];
