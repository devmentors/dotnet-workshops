#!/usr/bin/env bash
# Uderza w REST API dotnet-monitor i pokazuje, CO widzi z żywego procesu.
# Działa tak samo dla wariantu lokalnego i sidecar (oba wystawiają :52323/:52325).
# Wymaga: curl, jq.
set -euo pipefail

M=${MONITOR:-http://localhost:52323}   # REST API dotnet-monitor
MM=${METRICS:-http://localhost:52325}  # metryki Prometheus (bez auth)
APP=${APP:-http://localhost:18080}     # sama aplikacja (endpointy /burn, /leak)

echo "== 1) Procesy .NET widziane przez dotnet-monitor =="
curl -s "$M/processes" | jq .

# Wybierz MonitorTarget (na maszynie bywa też VBCSCompiler czy host `dotnet run`).
PID=$(curl -s "$M/processes" | jq -r '(map(select(.name=="MonitorTarget"))[0] // .[0]).pid')
echo; echo "== wybrany PID = $PID (MonitorTarget) =="

echo; echo "== 2) Szczegóły procesu =="
curl -s "$M/process?pid=$PID" | jq .

echo; echo "== 3) Metryki Prometheus (żywe liczniki: CPU, GC, alokacje, ThreadPool) =="
curl -s "$MM/metrics" | grep -E '^(systemruntime|microsoft)' | head -20

echo; echo "== 4) Live metrics — 5 s strumienia =="
curl -s "$M/livemetrics?pid=$PID&durationSeconds=5" | head -40

echo; echo "== 5) Trace CPU 10 s -> demo.nettrace -> demo.speedscope.json =="
# JEDNO żądanie /burn (11 s) pokrywa całe 10 s okno trace. Świadomie jedno, nie wiele:
# synchroniczny handler zajmuje JEDEN wątek na cały czas, więc na tym wątku HotPath
# wypełnia ~95% osi czasu, a Reference ~5% — czysty obraz do Sandwich. Rozbicie na wiele
# requestów rozsypałoby hot path po wątkach puli (każdy request inny wątek) → patrz README.
curl -s "$APP/burn?ms=11000" >/dev/null &
BURN_PID=$!
curl -s "$M/trace?pid=$PID&durationSeconds=10" -o demo.nettrace
wait "$BURN_PID" 2>/dev/null || true
echo "   zapisano demo.nettrace ($(ls -lh demo.nettrace | awk '{print $5}'))"
# /trace zwraca SUROWY .nettrace (EventPipe) — speedscope.app go NIE otworzy wprost.
# Konwersja do formatu Speedscope (wymaga global toola dotnet-trace na hoście).
# UWAGA nazewnictwo: dotnet-trace ZAWSZE dokłada '.speedscope.json' do wartości -o,
# więc '-o demo' daje 'demo.speedscope.json' (NIE podawaj pełnej nazwy z rozszerzeniem).
if command -v dotnet-trace >/dev/null 2>&1; then
  dotnet-trace convert demo.nettrace --format Speedscope -o demo
  # Dwa zabiegi na wygenerowanym speedscope (bez nich profil jest nieczytelny):
  #  1) activeProfileIndex → wątek z hot path, żeby speedscope otworzył się OD RAZU na
  #     właściwym wątku (web = wiele wątków; domyślnie ląduje na bezczynnym #1 → „pusto").
  #  2) usuwamy pseudo-ramki CPU_TIME / UNMANAGED_CODE_TIME, które dotnet-trace dokleja
  #     jako LIŚĆ pod każdą próbką — kradną „self time" prawdziwym metodom. Po ich usunięciu
  #     Sandwich (sort po self time) pokazuje TYLKO Twój kod: HotPath ~95%, Reference ~5%,
  #     a cały szum ASP.NET Core (Kestrel/middleware/routing) spada do ~0% i znika z góry listy.
  if command -v jq >/dev/null 2>&1; then
    HOTIDX=$(jq '
      ([ .shared.frames | to_entries[] | select(.value.name|test("g__HotPath")) | .key ]) as $hf
      | [ .profiles | to_entries[]
          | { i:.key, n: ([ .value.events[] | select(.frame as $f | ($hf|index($f)) != null) ] | length) } ]
      | max_by(.n) | .i' demo.speedscope.json 2>/dev/null)
    jq --argjson idx "${HOTIDX:-0}" '
      ([ .shared.frames | to_entries[]
         | select(.value.name=="CPU_TIME" or .value.name=="UNMANAGED_CODE_TIME") | .key ]) as $junk
      | .activeProfileIndex = $idx
      | .profiles |= map(.events |= map(select(.frame as $f | ($junk | index($f)) == null)))
    ' demo.speedscope.json > demo.speedscope.tmp 2>/dev/null && mv demo.speedscope.tmp demo.speedscope.json
  fi
  echo "   -> demo.speedscope.json — wrzuć na https://speedscope.app"
  echo "      Otworzy się OD RAZU na wątku z /burn. Zakładka 'Sandwich', sortuj po SELF TIME →"
  echo "      widzisz TYLKO swój kod: HotPath ~95%, Reference ~5% (Reference = referencja SKALI)."
  echo "      Szum ASP.NET Core jest odfiltrowany (self ~0%). 'Left Heavy' = to samo na flame graph."
  echo "      Alternatywa: otwórz demo.nettrace w PerfView / Visual Studio / Rider (agregują wątki)."
else
  echo "   UWAGA: brak 'dotnet-trace' na hoście — surowy .nettrace NIE otworzy się w speedscope.app."
  echo "          Zainstaluj:  dotnet tool install -g dotnet-trace"
  echo "          Konwersja:   dotnet-trace convert demo.nettrace --format Speedscope -o demo"
  echo "          (albo otwórz demo.nettrace wprost w PerfView / Visual Studio / Rider)."
fi

echo; echo "== 6) GC dump -> demo.gcdump (obiekty na stercie; PerfView/VS/Rider) =="
# Najpierw ZAALOKUJ trzymaną pamięć, żeby w zrzucie było CO zobaczyć (200 × 1 MB byte[]).
echo "   napędzam /leak?mb=200 ..."; curl -s "$APP/leak?mb=200" | jq .
curl -s "$M/gcdump?pid=$PID" -o demo.gcdump
echo "   zapisano demo.gcdump ($(ls -lh demo.gcdump | awk '{print $5}')) — w raporcie górę zajmuje System.Byte[] (200 × 1 MB = ~200 MB trzymane)"

echo; echo "== 7) Logi aplikacji (ILogger) — 5 s =="
curl -s "$M/logs?pid=$PID&durationSeconds=5" || true

echo; echo "Gotowe. Pełny zrzut procesu: curl \"$M/dump?pid=$PID\" -o demo.dump (duży plik)."
