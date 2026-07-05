#!/usr/bin/env bash
# Podnosi aplikację warsztatową .NET (UI + runner testów).
# Użycie: ./start.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$ROOT/workshops"

echo "== Warsztaty .NET · DevMentors =="

# Sprawdź wymagane narzędzia
command -v node   >/dev/null 2>&1 || { echo "BŁĄD: brak Node.js (wymagany Node 20+)."; exit 1; }
command -v npm    >/dev/null 2>&1 || { echo "BŁĄD: brak npm."; exit 1; }
command -v dotnet >/dev/null 2>&1 || echo "UWAGA: brak .NET SDK - UI ruszy, ale uruchamianie testów nie."

cd "$APP"

# Instalacja zależności tylko gdy potrzebna
if [ ! -d node_modules ]; then
  echo "-- Instaluję zależności (npm install)..."
  npm install
fi

echo
echo "-- Startuję aplikację:"
echo "   UI z zadaniami   → http://localhost:5173"
echo "   Runner testów    → http://localhost:3001"
echo "   (Ctrl+C kończy oba procesy)"
echo

exec npm run dev:all
