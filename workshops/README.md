# DevMentors - Warsztaty .NET

Interaktywna aplikacja warsztatowa. Przełączasz dzień u góry; dla dnia z dostępnymi zadaniami masz zadania w stylu RED -> GREEN uruchamiane przez `dotnet test`.

## Dni

| Dzień | Folder w repo   | Temat            | Zadania                      |
|-------|-----------------|------------------|------------------------------|
| 1     | `dzien1-csharp` | Idiomatyczny C#  | 10 (dostępne)                |
| 2     | -               | Ekosystem .NET   | pojawią się w dniu szkolenia |
| 3     | -               | Narzędzia i DX   | pojawią się w dniu szkolenia |
| 4     | -               | Architektura .NET | pojawią się w dniu szkolenia |

Dostępny jest Dzień 1 (10 zadań, wspólne tło: kawiarnia „Ziarno"). Zadania kolejnych dni odblokowujemy na żywo podczas szkolenia.

## Jak uruchomić

```bash
npm install
npm run dev:all
```

- UI (Vite): http://localhost:5173
- Test runner (Node): http://localhost:3001

`dev:all` odpala równolegle Vite i serwer Node (`server/test-runner.js`). Sam serwer: `npm run server`. Samo UI: `npm run dev`.

## Test runner

`POST http://localhost:3001/run-tests` z body `{ "testFilter": "...", "day": "dzien1-csharp" }` odpala `dotnet test --filter <filter>` w `<repoRoot>/<folder>/cwiczenia`. Brak `day` -> fallback do dnia 1.

Wymaga zainstalowanego .NET SDK (testy dnia 1 są w `dzien1-csharp/cwiczenia`).

## Postęp

Postęp ukończonych zadań trzymany jest per dzień w `localStorage` (klucz `dotnet-workshops-completed-by-day`). Licznik „X/Y" liczy się w obrębie aktywnego dnia.

## Build

```bash
npm run build   # tsc -b && vite build -> dist/
```
