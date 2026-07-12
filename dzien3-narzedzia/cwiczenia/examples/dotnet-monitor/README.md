# Demo: dotnet-monitor toolkit

Izolowane demo narzędzia **dotnet-monitor** — jednego REST API do diagnostyki żywego procesu
.NET (metryki, trace CPU, GC dump, pełny dump, logi), bez zatrzymywania aplikacji.
To rozwinięcie slajdu **36 „Trace na prodzie"** (Sekcja 3 / `dotnet run`).

`MonitorTarget` to mała aplikacja ASP.NET, która **cały czas coś robi** (CPU + alokacje + logi),
więc liczniki się ruszają i jest CO obserwować. Endpointy do wywołania na żywo:

| Endpoint aplikacji | Efekt |
|---|---|
| `GET /`            | status + PID |
| `GET /burn?ms=3000`| skok CPU (widać w `/livemetrics`, `/trace`) |
| `GET /leak?mb=100` | alokacje trzymane w pamięci (widać w `/gcdump`, licznikach GC) |

Poniżej dwie ścieżki. **Wariant A** (lokalny) jest najszybszy do zobaczenia na żywo.
**Wariant B** (sidecar w kontenerze) to realny model produkcyjny ze slajdu 36.

---

## Wariant A — lokalnie (global tool, bez Dockera)

```bash
# 0) narzędzie raz na maszynę
dotnet tool install -g dotnet-monitor

# 1) terminal 1 — aplikacja (wypisze swój PID, słucha na :18080)
cd MonitorTarget && ASPNETCORE_URLS=http://localhost:18080 dotnet run

# 2) terminal 2 — dotnet-monitor podpina się po PID do WSZYSTKICH procesów .NET
dotnet-monitor collect --no-auth \
  --urls http://localhost:52323 \
  --metricUrls http://localhost:52325

# 3) terminal 3 — uderz w REST API i zobacz, co widzi
./demo.sh
```

`dotnet-monitor` w domyślnym trybie **connect** sam wykrywa uruchomione procesy .NET —
`GET /processes` pokaże `MonitorTarget`, a reszta endpointów działa po jego `pid`.

---

## Wariant B — sidecar w kontenerze (docker-compose)

Model jak na produkcji: aplikacja i `dotnet-monitor` to **dwa osobne kontenery** ze wspólnym
volume `/diag`. Aplikacja łączy się z monitorem po sockecie (`DOTNET_DiagnosticPorts`),
monitor **nasłuchuje** (`ConnectionMode=Listen`). Obraz aplikacji nie potrzebuje SDK ani narzędzi.

```bash
docker compose up --build          # app + monitor jako sidecar
./demo.sh                          # to samo REST API na :52323 / :52325
docker compose down -v             # sprzątanie (usuwa volume /diag)
```

Konfiguracja jest w `docker-compose.yml`. `user: root` na obu usługach to wyłącznie uproszczenie
dema (wspólne uprawnienia do socketu w `/diag`) — na produkcji ustaw spójny UID zamiast root.

### `port is already allocated`?

Host trzyma port `18080` (albo Twój `APP_PORT`). Najpierw sprzątnij wcześniejszy run: `docker compose down -v`. Jeśli to nie pomaga, sprawdź
```
docker ps | grep 18080
``` 
i ew. zmien port hosta:
> ```bash
> APP_PORT=9080 docker compose up --build
> APP=http://localhost:9080 ./demo.sh
> ```

---

## Mapa endpointów dotnet-monitor

Wszystko na `http://localhost:52323` (REST API) i `http://localhost:52325` (metryki Prometheus):

| Wywołanie | Co pokazuje |
|---|---|
| `GET /processes` | lista procesów .NET, które monitor widzi (z `pid`) |
| `GET /process?pid=<PID>` | szczegóły procesu (nazwa, runtime, env) |
| `GET :52325/metrics` | metryki Prometheus: CPU, GC, alokacje, ThreadPool, working set |
| `GET /livemetrics?pid=<PID>&durationSeconds=5` | strumień liczników na żywo |
| `GET /trace?pid=<PID>&durationSeconds=10` | profil CPU → surowy `.nettrace`; konwersja `dotnet-trace convert demo.nettrace --format Speedscope -o demo` → `demo.speedscope.json` na speedscope.app (albo otwórz `.nettrace` wprost w PerfView/VS/Rider) |
| `GET /gcdump?pid=<PID>` | zrzut sterty GC → `.gcdump` (typy/liczba obiektów) |
| `GET /dump?pid=<PID>` | pełny dump procesu (duży; analiza post mortem) |
| `GET /logs?pid=<PID>&durationSeconds=5` | logi `ILogger` na żywo, bez wchodzenia do procesu |

💡 W trakcie `GET /livemetrics` odpal w innym terminalu
`curl 'localhost:18080/burn?ms=4000'` (skok CPU) albo `curl 'localhost:18080/leak?mb=200'`
(alokacje) i patrz, jak liczniki reagują.

⚠️ **Trace „nic nie pokazuje" / „nic się nie zmieniło" w speedscope?** To NIE pusty trace.
`dotnet-trace convert` robi profil **per wątek**, a `MonitorTarget` to aplikacja web (13+ wątków),
więc gorąca praca (`/burn`) siedzi na **jednym wątku obsługującym request, nie na wątku #1**.
Surowo z konwertera speedscope otwiera się na wątku głównym (bezczynnym) → wygląda pusto, jakby
nic się nie zmieniło. Dlatego `demo.sh` robi na wygenerowanym pliku **dwa zabiegi**:

1. **`activeProfileIndex`** → wątek z hot path, żeby speedscope otwierał się OD RAZU na właściwym
   wątku (bez ręcznego szukania z listy 13+ wątków).
2. **usuwa pseudo-ramki `CPU_TIME` / `UNMANAGED_CODE_TIME`**, które `dotnet-trace` dokleja jako
   *liść* pod każdą próbką i które **kradną `self time`** prawdziwym metodom (bez tego Sandwich po
   self time pokazuje `CPU_TIME` 100%, nie Twój kod).

Efekt: zakładka **„Sandwich"** (sortuj po *self time*) pokazuje **TYLKO Twój kod** — **`HotPath`
~95%** i **`Reference` ~5%** (`Reference` to celowo ~20× tańsza metoda, dająca **skalę** — „95% to
niemal wszystko"), a **cały szum ASP.NET Core** (Kestrel / middleware / routing, ~26 ramek nad
Twoim handlerem) spada do ~0% self i **znika z góry listy**. **„Left Heavy"** = to samo na flame
graph. Jeśli konwertujesz `.nettrace` **ręcznie** (bez `demo.sh`), tych zabiegów nie ma — wybierz
wtedy wątek z `/burn` z listy, albo otwórz `demo.nettrace` w **PerfView / Visual Studio / Rider**
(agregują wątki i mają własne składanie ramek frameworka).

> **Dlaczego jedno długie `/burn`, a nie wiele requestów?** `demo.sh` robi **jedno** żądanie
> pokrywające całe okno trace — synchroniczny handler trzyma **jeden wątek**, więc `HotPath`
> wypełnia ~95% jego osi czasu (czysty Sandwich). Wiele równoległych/sekwencyjnych requestów
> rozsypałoby hot path po wątkach puli i na żadnym pojedynczym nie byłoby widać dominacji.