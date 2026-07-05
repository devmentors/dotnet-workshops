# HINTS - Dzień 1 (C#)

Krótkie wskazówki dla każdego zadania. Nagłówek = filtr testu (`--filter`).
Pełne wskazówki z blokami kodu żyją w aplikacji warsztatowej (przycisk
„Pokaż wskazówkę”); tu jest skrót dla pracy z konsoli.

## FullyQualifiedName~Exercises.Tests.Types.CashRegisterTests
`public static Money operator +(Money a, Money b)`, `operator *(Money price, int quantity)`,
dwa przeciążenia `Scan`. W Scan: `Total = Total + price * quantity;`.

## FullyQualifiedName~Exercises.Tests.Null.CafeTests
`order?.Card?.OwnerName ?? "gość"`, `card.OwnerName ??= "gość";`,
w ClaimReward każda właściwość `= default;`.

## FullyQualifiedName~Exercises.Tests.Encapsulation.PrepaidCardTests
Owner: jawny `set` z Trim + wyjątkiem, magazyn w `field` (C# 14).
`public decimal Balance { get; private set; }`. W TopUp/Pay najpierw walidacja, potem zmiana.

## FullyQualifiedName~Exercises.Tests.Immutability.ReservationTests
`public record Reservation(string Guest, string Table, int Seats)` z ciałem.
MoveTo: `this with { Table = newTable }`. Summary: `var (guest, table, seats) = this;`.

## FullyQualifiedName~Exercises.Tests.Generics.RepositoryTests
Dopisz do klasy constraint `where T : class, IHasId` - bez niego `item.Id` się nie
skompiluje. GetById: foreach po `_items`, `if (item.Id == id) return item;` na końcu `return null;`.

## FullyQualifiedName~Exercises.Tests.Match.MenuTests
`drink switch { Espresso { Shots: >= 2 } => 12m, Espresso => 9m, ... , _ => throw ... }`.
HasCaffeine: `drink is not Tea { Herbal: true }`.

## FullyQualifiedName~Exercises.Tests.Delegates.DiscountsTests
Apply: `rule(price)`. PercentOff: `price => price - price * percent / 100` (domknięcie na percent).
BestPrice: `var best = price;` + foreach po regułach, `if (rule(price) < best) best = ...;`.

## FullyQualifiedName~Exercises.Tests.Extensions.MenuBoardExtensionsTests
`text` to odbiorca.
Shorten: `if (text.Length <= max) return text;` inaczej `text.Substring(0, max - 1) + "…"`.
OrPlaceholder: `string.IsNullOrWhiteSpace(text) ? placeholder : text`.

## FullyQualifiedName~Exercises.Tests.Linq.SalesReportTests
Jeden łańcuch: `.Where(l => l.Quantity > 0).OrderByDescending(l => l.Price * l.Quantity)
.Select(l => new ProductSummary(l.Product, l.Price * l.Quantity))`.

## FullyQualifiedName~Exercises.Tests.Async.MorningDashboardTests
Najpierw trzy wywołania BEZ await (taski już lecą), potem `Task.WhenAll`,
wyniki z `.Result`. WaitForDeliveryAsync: `await Task.Delay(5000, token);`.
