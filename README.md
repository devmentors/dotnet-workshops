# Warsztaty .NET - DevMentors

Materiały dla uczestników szkolenia .NET: interaktywna aplikacja z zadaniami oraz kod ćwiczeń **Dnia 1**.

## Szybki start

```bash
./start.sh
```

albo ręcznie:

```bash
cd workshops
npm install
npm run dev:all
```

- UI z zadaniami: http://localhost:5173
- Runner testów (Node): http://localhost:3001

Do uruchamiania testów potrzebny jest **.NET SDK** (projekt ćwiczeń: `dzien1-csharp/cwiczenia`).

## Jak pracujesz z zadaniami

1. Wybierasz zadanie w aplikacji (Dzień 1).
2. Uzupełniasz kod w `dzien1-csharp/cwiczenia/src/Exercises/<sekcja>/exercises/`.
3. Klikasz „Uruchom testy" - stub startuje na czerwono (RED), Twoje rozwiązanie ma je zazielenić (GREEN).
4. W razie potrzeby masz podpowiedź i podgląd rozwiązania.

Dzień 1 to 10 zadań osadzonych w jednym świecie - aplikacji kawiarni „Ziarno" (kasa, karta lojalnościowa, repozytorium encji, silnik rabatów, raport LINQ, panel async i inne).

## Kolejne dni

Zadania Dni 2-4 odblokowujemy na żywo podczas szkolenia - w aplikacji są oznaczone jako „Pojawią się w dniu szkolenia".

## Struktura

```
workshops/          aplikacja (React + Vite + serwer Node z runnerem testów)
dzien1-csharp/
  cwiczenia/        projekt ćwiczeń Dnia 1 (.NET 10 / C# 14) - src + testy xUnit
```
