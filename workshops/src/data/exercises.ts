import type { Exercise } from '../types/Exercise';

// Dzień 1: jedno wspólne tło fabularne - przez cały dzień rozwijamy
// oprogramowanie kawiarni „Ziarno". Jedna sekcja decku = jedno zadanie.
export const exercises: Exercise[] = [
  {
    id: 'exercise-01',
    sequenceNumber: 1,
    title: 'The till - operators and overloads',
    titlePl: 'Kasa - operatory i przeciążenia',
    category: 'Type system',
    categoryPl: 'System typów',
    timeMinutes: 10,
    description: `
# The till at "Ziarno"

## Context

You are building the software for the "Ziarno" café, starting with the till. The barista rings up products: sometimes one ("cheesecake 12.50"), sometimes several at once ("3 x espresso at 9.00"). The till sums everything in one currency and keeps the result in the **Total** property.

Amounts are represented by the **Money** class (amount + currency). For the till to do the math, Money must know how to add itself and multiply by a quantity - and this is where this section's material comes in: **operator and method overloading**. The compiler picks the right variant by the argument types.

## Task

Implement step by step (the file only has TODO comments - you write the full declarations yourself):

1. Declare the \`+\` operator for two Money values: return a new Money with the summed amount; for different currencies throw **InvalidOperationException**.
2. Declare the \`*\` (multiplication) operator for a Money and an int: return a new Money with the amount multiplied by the quantity.
3. Write two **Scan** methods in the CashRegister class: \`Scan(price)\` adds the price to Total, and \`Scan(price, quantity)\` adds the price times the quantity. Use your operators from steps 1 and 2 in both.

## Expected result

After ringing up "3 x espresso at 9.00" and "cheesecake 12.50" the till shows Total = 39.50 PLN, and mixing currencies ends with an exception. All five tests pass.
    `,
    descriptionPl: `
# Kasa w „Ziarnie"

## Kontekst

Budujesz oprogramowanie kawiarni „Ziarno" i zaczynasz od kasy. Barista nabija produkty: czasem jeden ("sernik 12.50"), czasem kilka sztuk naraz ("3 x espresso po 9.00"). Kasa sumuje wszystko w jednej walucie i trzyma wynik we właściwości **Total**.

Kwoty reprezentuje klasa **Money** (kwota + waluta). Żeby kasa mogła liczyć, Money musi umieć się dodawać i mnożyć przez liczbę sztuk - i tu wchodzi materiał tej sekcji: **przeciążanie operatorów i metod**. Kompilator sam wybierze właściwy wariant po typach argumentów.

## Zadanie

Zaimplementuj po kolei (w pliku są tylko komentarze TODO - całe deklaracje piszesz sam):

1. Zadeklaruj operator \`+\` dla dwóch Money: zwróć nowy Money z sumą kwot; przy różnych walutach rzuć **InvalidOperationException**.
2. Zadeklaruj operator \`*\` (mnożenia) dla pary Money i int: zwróć nowy Money z kwotą pomnożoną przez liczbę sztuk.
3. Napisz dwie metody **Scan** w klasie CashRegister: \`Scan(price)\` dolicza cenę do Total, a \`Scan(price, quantity)\` dolicza cenę razy liczba sztuk. W obu użyj swoich operatorów z punktów 1 i 2.

## Oczekiwany rezultat

Po nabiciu "3 x espresso po 9.00" i "sernik 12.50" kasa pokazuje Total = 39.50 PLN, a mieszanie walut kończy się wyjątkiem. Wszystkie pięć testów przechodzi.
    `,
    hint: `The declarations have a fixed shape:

\`\`\`csharp
public static Money operator +(Money a, Money b)
public static Money operator *(Money price, int quantity)
public void Scan(Money price)
public void Scan(Money price, int quantity)
\`\`\`

In Scan assign a new total: \`Total = Total + price;\` - Money is immutable, so adding produces a new object.`,
    hintPl: `Deklaracje mają stałą formę:

\`\`\`csharp
public static Money operator +(Money a, Money b)
public static Money operator *(Money price, int quantity)
public void Scan(Money price)
public void Scan(Money price, int quantity)
\`\`\`

W Scan przypisz nową sumę: \`Total = Total + price;\` - Money jest niemutowalne, więc dodawanie tworzy nowy obiekt.`,
    solution: `public static Money operator +(Money a, Money b)
{
    if (a.Currency != b.Currency)
        throw new InvalidOperationException("Nie można dodać kwot w różnych walutach.");

    return new Money(a.Amount + b.Amount, a.Currency);
}

public static Money operator *(Money price, int quantity)
    => new Money(price.Amount * quantity, price.Currency);

// CashRegister:
public void Scan(Money price) => Total = Total + price;

public void Scan(Money price, int quantity) => Total = Total + price * quantity;`,
    solutionExplanationPl: `Cztery deklaracje, jeden mechanizm: kompilator wybiera wariant po **typach argumentów** na etapie kompilacji. \`operator +\` przyjmuje dwa Money, \`operator *\` - Money i int (operandy różnych typów to też przeciążenie). Dwie metody \`Scan\` różnią się listą parametrów, więc \`Scan(price)\` i \`Scan(price, 3)\` trafiają do różnych wariantów. Scan nie liczy nic sam - składa wynik z operatorów, dlatego \`Total = Total + price * quantity\` wygląda jak zapis z paragonu.`,
    solutionExplanation: `Four declarations, one mechanism: the compiler picks the variant by **argument types** at compile time. \`operator +\` takes two Money, \`operator *\` - Money and int (operands of different types are an overload too). The two \`Scan\` methods differ by parameter list, so \`Scan(price)\` and \`Scan(price, 3)\` go to different variants. Scan computes nothing itself - it composes the operators, which is why \`Total = Total + price * quantity\` looks like a receipt line.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Types.CashRegisterTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/03_types/exercises/CashRegister.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/03_types/CashRegisterTests.cs',
    ],
  },
  {
    id: 'exercise-02',
    sequenceNumber: 2,
    title: 'The loyalty card - null under control',
    titlePl: 'Karta lojalnościowa - null pod kontrolą',
    category: 'Null and default values',
    categoryPl: 'null i wartości domyślne',
    timeMinutes: 10,
    description: `
# The "Ziarno" loyalty card

## Context

The "Ziarno" café runs loyalty cards: a stamp for every coffee, a reward for a full set. The data is often incomplete: a walk-in customer has no card (Card is null), and a card may have no owner name (OwnerName is null). The code must survive this without a NullReferenceException - which is exactly what this section's operators \`?.\`, \`??\` and \`??=\` are for. And after the reward is claimed the card returns to its starting state, which exposes the value/reference asymmetry: the stamp counter becomes 0 (not null!), the flag false, the name null.

## Task

Implement three methods in the Cafe class:

1. **OwnerLabel(Order? order)** - return the card owner's name (order -> Card -> OwnerName). If anything along the way is missing, return "gość". Use a \`?.\` chain and close it with \`??\`.
2. **EnsureOwner(LoyaltyCard card)** - if the card has no name, write in "gość"; leave an existing name unchanged. Use \`??=\` - it assigns only at null.
3. **ClaimReward(LoyaltyCard card)** - clear the card after the reward is claimed: set every property with the **default** literal, without typing 0 / false / null by hand.

## Expected result

The app never crashes on missing data: an order without a card displays "gość", a nameless card gets a name before printing, and after the reward the stamp counter returns to 0, the flag to false and the name to null.
    `,
    descriptionPl: `
# Karta stałego klienta „Ziarna"

## Kontekst

Kawiarnia „Ziarno" prowadzi karty stałego klienta: za każdą kawę pieczątka, za komplet - nagroda. Dane bywają niekompletne: klient z ulicy nie ma karty (Card jest null), a karta może nie mieć wpisanego imienia (OwnerName jest null). Kod musi to przeżyć bez NullReferenceException - dokładnie do tego służą operatory \`?.\`, \`??\` i \`??=\` z tej sekcji. A po odebraniu nagrody karta wraca do stanu początkowego - i tu wychodzi asymetria value/reference: licznik pieczątek robi się 0 (nie null!), flaga false, imię null.

## Zadanie

Zaimplementuj trzy metody w klasie Cafe:

1. **OwnerLabel(Order? order)** - zwróć imię właściciela karty (order -> Card -> OwnerName). Jeśli czegokolwiek po drodze brakuje, zwróć "gość". Użyj łańcucha \`?.\` i domknij go przez \`??\`.
2. **EnsureOwner(LoyaltyCard card)** - jeśli karta nie ma imienia, wpisz "gość"; wpisane imię zostaw bez zmian. Użyj \`??=\` - przypisuje tylko przy null.
3. **ClaimReward(LoyaltyCard card)** - wyczyść kartę po odebraniu nagrody: ustaw wszystkie właściwości literałem **default**, bez wpisywania 0 / false / null z palca.

## Oczekiwany rezultat

Aplikacja nie wybucha na brakujących danych: zamówienie bez karty wyświetla "gość", karta bez imienia dostaje je przed wydrukiem, a po nagrodzie licznik pieczątek wraca do 0, flaga do false, imię do null - bo value type ma sensowny default, a reference type null.
    `,
    hint: `Three constructs, one per method:

\`\`\`csharp
order?.Card?.OwnerName ?? "gość"
card.OwnerName ??= "gość";
card.Stamps = default;   // and the remaining properties the same way
\`\`\`

\`?.\` yields null when the left side is null, \`??\` substitutes the fallback, \`??=\` assigns only at null, and \`default\` takes the type from context.`,
    hintPl: `Trzy konstrukcje, po jednej na metodę:

\`\`\`csharp
order?.Card?.OwnerName ?? "gość"
card.OwnerName ??= "gość";
card.Stamps = default;   // i pozostałe właściwości tak samo
\`\`\`

\`?.\` daje null, gdy lewa strona jest null, \`??\` podstawia wartość zastępczą, \`??=\` przypisuje tylko przy null, a \`default\` bierze typ z kontekstu.`,
    solution: `public static string OwnerLabel(Order? order) => order?.Card?.OwnerName ?? "gość";

public static void EnsureOwner(LoyaltyCard card)
{
    card.OwnerName ??= "gość";
}

public static void ClaimReward(LoyaltyCard card)
{
    card.OwnerName = default;
    card.Stamps = default;
    card.RewardReady = default;
}`,
    solutionExplanationPl: `Cała sekcja w trzech metodach. \`order?.Card?.OwnerName\` propaguje null przez ogniwa (\`?.\` **odracza**), a \`?? "gość"\` **domyka** łańcuch, żeby nie zwrócić null tam, gdzie spodziewamy się tekstu. \`??=\` przypisuje **tylko gdy** imię jest null - wpisane zostaje nietknięte, bez żadnego if. \`default\` bierze typ z kontekstu, więc \`Stamps\` wraca do 0, \`RewardReady\` do false, a \`OwnerName\` do null - to asymetria value vs reference type w praktyce.`,
    solutionExplanation: `The whole section in three methods. \`order?.Card?.OwnerName\` propagates null through the links (\`?.\` **defers**), and \`?? "gość"\` **closes** the chain so we never return null where text is expected. \`??=\` assigns **only when** the name is null - an existing one stays untouched, no if needed. \`default\` takes its type from context, so \`Stamps\` returns to 0, \`RewardReady\` to false and \`OwnerName\` to null - the value vs reference asymmetry in practice.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Null.CafeTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/04_null/exercises/Cafe.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/04_null/CafeTests.cs',
    ],
  },
  {
    id: 'exercise-03',
    sequenceNumber: 3,
    title: 'The prepaid card - protected state',
    titlePl: 'Karta prepaid - stan pod ochroną',
    category: 'Encapsulation',
    categoryPl: 'Hermetyzacja',
    timeMinutes: 10,
    description: `
# The "Ziarno" prepaid card

## Context

"Ziarno" introduces prepaid cards: the customer tops the card up and then pays with it at the till. The card's state must be impossible to corrupt: nobody from the outside may write the balance directly, the balance must never go below zero, and the owner's name must always be trimmed and non-empty. This is this section's material: a property as a control point and methods guarding the invariants.

## Task

Write the full declarations yourself - the file only has a TODO:

1. Write the **Owner** property (string) with an explicit set: trim the value, and reject an empty or whitespace-only one with **ArgumentException**. Keep the storage in the \`field\` keyword (C# 14).
2. Write the **Balance** property (decimal) with a **private set**: public read, changes only through the card's methods.
3. Write the **TopUp(decimal amount)** method: for amount <= 0 throw **ArgumentOutOfRangeException**; add a valid amount to the balance.
4. Write the **Pay(decimal amount)** method: for amount <= 0 throw **ArgumentOutOfRangeException**; for an amount above the balance throw **InvalidOperationException**; subtract a valid one.

## Expected result

After a 50 zł top-up and a 12.50 zł payment the card shows 37.50 zł, " Darek " is stored as "Darek", and every attempt to corrupt the state (negative amount, paying above the balance, writing the balance from outside) ends with an exception.
    `,
    descriptionPl: `
# Karta prepaid „Ziarna"

## Kontekst

„Ziarno" wprowadza karty przedpłacone: klient doładowuje kartę, a potem płaci nią przy kasie. Stan karty musi być nie do popsucia: nikt z zewnątrz nie może wpisać salda ręcznie, saldo nie może zejść poniżej zera, a imię właściciela ma być zawsze przycięte i niepuste. To materiał tej sekcji: właściwość jako punkt kontroli i metody pilnujące inwariantów.

## Zadanie

Całe deklaracje piszesz sam - w pliku jest tylko TODO:

1. Napisz właściwość **Owner** (string) z jawnym set: przytnij wartość (Trim), a pustą lub złożoną z białych znaków odrzuć wyjątkiem **ArgumentException**. Magazyn trzymaj w słowie kluczowym \`field\` (C# 14).
2. Napisz właściwość **Balance** (decimal) z **prywatnym set**: odczyt publiczny, zmiana wyłącznie metodami karty.
3. Napisz metodę **TopUp(decimal amount)**: kwota <= 0 - rzuć **ArgumentOutOfRangeException**; poprawną dolicz do salda.
4. Napisz metodę **Pay(decimal amount)**: kwota <= 0 - rzuć **ArgumentOutOfRangeException**; kwota wyższa niż saldo - rzuć **InvalidOperationException**; poprawną odejmij.

## Oczekiwany rezultat

Karta po doładowaniu 50 zł i zapłacie 12.50 zł pokazuje 37.50 zł, " Darek " zapisuje się jako "Darek", a każda próba zepsucia stanu (ujemna kwota, płatność ponad saldo, saldo wpisane z zewnątrz) kończy się wyjątkiem.
    `,
    hint: `The property with validation looks like this (the \`field\` keyword is the automatic backing storage, C# 14):

\`\`\`csharp
public string Owner
{
    get;
    set
    {
        var trimmed = value.Trim();
        if (string.IsNullOrWhiteSpace(trimmed))
            throw new ArgumentException("Imię nie może być puste.");
        field = trimmed;
    }
}

public decimal Balance { get; private set; }
\`\`\`

In TopUp/Pay validate the amount first, change the state only afterwards.`,
    hintPl: `Właściwość z walidacją wygląda tak (słowo \`field\` to automatyczny magazyn, C# 14):

\`\`\`csharp
public string Owner
{
    get;
    set
    {
        var trimmed = value.Trim();
        if (string.IsNullOrWhiteSpace(trimmed))
            throw new ArgumentException("Imię nie może być puste.");
        field = trimmed;
    }
}

public decimal Balance { get; private set; }
\`\`\`

W TopUp/Pay najpierw zwaliduj kwotę, dopiero potem zmień stan.`,
    solution: `public class PrepaidCard
{
    public string Owner
    {
        get;
        set
        {
            var trimmed = value.Trim();
            if (string.IsNullOrWhiteSpace(trimmed))
                throw new ArgumentException("Imię nie może być puste.");
            field = trimmed;
        }
    } = "";

    public decimal Balance { get; private set; }

    public void TopUp(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentOutOfRangeException(nameof(amount), "Doładowanie musi być dodatnie.");

        Balance += amount;
    }

    public void Pay(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentOutOfRangeException(nameof(amount), "Kwota musi być dodatnia.");
        if (amount > Balance)
            throw new InvalidOperationException("Brak środków na karcie.");

        Balance -= amount;
    }
}`,
    solutionExplanationPl: `Dwa poziomy ochrony stanu. \`Owner\` to właściwość z jawnym \`set\` - punktem kontroli, który przycina i odrzuca puste wartości; magazyn żyje w słowie kluczowym \`field\` (C# 14), więc nie deklarujemy osobnego prywatnego pola. \`Balance\` ma \`private set\`: z zewnątrz tylko odczyt, a jedyną drogą zmiany są metody \`TopUp\`/\`Pay\`, które NAJPIERW walidują (ujemna kwota, brak środków), a dopiero potem zmieniają stan. Dzięki temu karta w żadnym momencie nie może mieć ujemnego salda.`,
    solutionExplanation: `Two levels of state protection. \`Owner\` is a property with an explicit \`set\` - a control point that trims and rejects blank values; the storage lives in the \`field\` keyword (C# 14), so no separate private field is declared. \`Balance\` has a \`private set\`: read-only from outside, and the only way to change it is through \`TopUp\`/\`Pay\`, which validate FIRST (negative amount, insufficient funds) and only then mutate. The card can never hold a negative balance.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Encapsulation.PrepaidCardTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/05_encapsulation/exercises/PrepaidCard.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/05_encapsulation/PrepaidCardTests.cs',
    ],
  },
  {
    id: 'exercise-04',
    sequenceNumber: 4,
    title: 'The table reservation - records',
    titlePl: 'Rezerwacja stolika - record',
    category: 'Immutability',
    categoryPl: 'Niemutowalność',
    timeMinutes: 10,
    description: `
# Table reservations at "Ziarno"

## Context

"Ziarno" takes table reservations for board-game evenings. A reservation is pure data: guest, table, number of seats. Today it is a plain mutable class, so two identical reservations are "different" to the program, and moving a guest to another table mutates the existing object. This section's material fixes both: a **record** gives value equality, and \`with\` gives a modified copy instead of a mutation.

## Task

1. Convert the Reservation class into a **positional record**: \`public record Reservation(string Guest, string Table, int Seats)\`. Value equality and ToString come for free.
2. Implement **MoveTo(string newTable)**: return a COPY of the reservation with the new table (a \`with\` expression); the original must stay unchanged.
3. Implement **Summary()**: deconstruct the record into three variables (\`var (guest, table, seats) = this;\`) and return the text "Darek - stolik W2, 4 os.".

## Expected result

Two reservations with the same data are equal (==), moving to another table creates a new reservation without touching the old one, and Summary composes a readable description from the unpacked fields.
    `,
    descriptionPl: `
# Rezerwacje stolików w „Ziarnie"

## Kontekst

„Ziarno" przyjmuje rezerwacje stolików na wieczory z planszówkami. Rezerwacja to czyste dane: gość, stolik, liczba osób. Dziś to zwykła mutowalna klasa i przez to dwie identyczne rezerwacje są dla programu „różne", a przeniesienie gościa na inny stolik grzebie w istniejącym obiekcie. Materiał tej sekcji naprawia jedno i drugie: **record** daje równość przez wartość, a \`with\` - kopię z modyfikacją zamiast mutacji.

## Zadanie

1. Przerób klasę Reservation na **positional record**: \`public record Reservation(string Guest, string Table, int Seats)\`. Równość przez wartość i ToString dostaniesz za darmo.
2. Zaimplementuj **MoveTo(string newTable)**: zwróć KOPIĘ rezerwacji z nowym stolikiem (wyrażenie \`with\`); oryginał ma zostać bez zmian.
3. Zaimplementuj **Summary()**: zdekonstruuj record do trzech zmiennych (\`var (guest, table, seats) = this;\`) i zwróć tekst "Darek - stolik W2, 4 os.".

## Oczekiwany rezultat

Dwie rezerwacje z tymi samymi danymi są równe (==), przeniesienie na inny stolik tworzy nową rezerwację i nie zmienia starej, a Summary składa czytelny opis z rozpakowanych pól.
    `,
    hint: `A record keeps its methods in a body after the parameter list:

\`\`\`csharp
public record Reservation(string Guest, string Table, int Seats)
{
    public Reservation MoveTo(string newTable) => this with { Table = newTable };
}
\`\`\`

In Summary deconstruct: \`var (guest, table, seats) = this;\` and compose the text with interpolation.`,
    hintPl: `Record może mieć ciało z metodami po liście parametrów:

\`\`\`csharp
public record Reservation(string Guest, string Table, int Seats)
{
    public Reservation MoveTo(string newTable) => this with { Table = newTable };
}
\`\`\`

W Summary zdekonstruuj: \`var (guest, table, seats) = this;\` i złóż tekst interpolacją.`,
    solution: `public record Reservation(string Guest, string Table, int Seats)
{
    public Reservation MoveTo(string newTable) => this with { Table = newTable };

    public string Summary()
    {
        var (guest, table, seats) = this;
        return $"{guest} - stolik {table}, {seats} os.";
    }
}`,
    solutionExplanationPl: `Positional record załatwia trzy rzeczy naraz: właściwości init-only (nie da się zmutować po utworzeniu), **równość przez wartość** z operatorem \`==\` i \`GetHashCode\`, oraz **dekonstrukcję** do krotki zmiennych. \`MoveTo\` używa \`this with { Table = newTable }\` - to kopia z modyfikacją: powstaje nowy obiekt, a oryginał zostaje nietknięty. \`Summary\` rozpakowuje record dekonstrukcją i składa opis interpolacją.`,
    solutionExplanation: `A positional record delivers three things at once: init-only properties (no mutation after creation), **value equality** with \`==\` and \`GetHashCode\`, and **deconstruction** into a tuple of variables. \`MoveTo\` uses \`this with { Table = newTable }\` - a modified copy: a new object appears, the original stays untouched. \`Summary\` unpacks the record via deconstruction and composes the text with interpolation.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Immutability.ReservationTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/06_immutability/exercises/Reservation.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/06_immutability/ReservationTests.cs',
    ],
  },
  {
    id: 'exercise-05',
    sequenceNumber: 5,
    title: 'The entity repository - generics',
    titlePl: 'Repozytorium encji - generyki',
    category: 'Generics',
    categoryPl: 'Typy generyczne',
    timeMinutes: 10,
    description: `
# The entity repository at "Ziarno"

## Context

The café app stores several kinds of entities: products, customers, orders. Each of them has an Id. Instead of writing a separate ProductRepository, CustomerRepository and OrderRepository - three near-identical classes - you write ONE repository parameterized by a type T. The catch: to look an entity up by Id, the repository must know that T HAS an Id. That guarantee is a **constraint**: \`where T : class, IHasId\`.

## Task

The Repository\\<T\\> class starts WITHOUT a constraint. Fill it in:

1. **Add(T item)** - add an entity (keep the entities in a List\\<T\\>).
2. **GetById(int id)** - return the entity with that Id, or null if none. To read \`item.Id\` you MUST add the constraint \`where T : class, IHasId\` to the class - without it the compiler does not know that T has an Id (\`class\` means the entity is a reference type, so you can return null).
3. **Count** - how many entities are in the repository.

## Expected result

One Repository\\<T\\> handles both products and customers. GetById finds an entity by Id or returns null - and without the \`where T : class, IHasId\` constraint the code with \`item.Id\` would not even compile. That is the heart of the task.
    `,
    descriptionPl: `
# Repozytorium encji w „Ziarnie"

## Kontekst

Aplikacja kawiarni przechowuje różne encje: produkty, klientów, zamówienia. Każda z nich ma swoje Id. Zamiast pisać osobne ProductRepository, CustomerRepository i OrderRepository - trzy prawie identyczne klasy - piszesz JEDNO repozytorium z parametrem typu T. Haczyk: żeby wyszukać encję po Id, repozytorium musi wiedzieć, że T MA Id. Tę gwarancję daje **constraint**: \`where T : class, IHasId\`.

## Zadanie

Klasa Repository\\<T\\> startuje BEZ constraintu. Uzupełnij ją:

1. **Add(T item)** - dodaj encję (encje trzymaj w List\\<T\\>).
2. **GetById(int id)** - zwróć encję o danym Id, albo null, gdy jej nie ma. Żeby odczytać \`item.Id\`, MUSISZ dopisać do klasy constraint \`where T : class, IHasId\` - bez niego kompilator nie wie, że T ma Id (\`class\` = encja jest typem referencyjnym, więc można zwrócić null).
3. **Count** - ile encji jest w repozytorium.

## Oczekiwany rezultat

Jedno Repository\\<T\\> obsługuje i produkty, i klientów. GetById znajduje encję po Id albo zwraca null - a bez constraintu \`where T : class, IHasId\` kod z \`item.Id\` w ogóle by się nie skompilował. To jest sedno zadania.
    `,
    hint: `Add the constraint to the class declaration, then read \`item.Id\` in a foreach:

\`\`\`csharp
public class Repository<T> where T : class, IHasId
{
    private readonly List<T> _items = new();

    public int Count => _items.Count;

    public void Add(T item) => _items.Add(item);

    public T? GetById(int id)
    {
        foreach (var item in _items)
            if (item.Id == id)
                return item;
        return null;
    }
}
\`\`\``,
    hintPl: `Dopisz constraint do deklaracji klasy, potem odczytaj \`item.Id\` w pętli foreach:

\`\`\`csharp
public class Repository<T> where T : class, IHasId
{
    private readonly List<T> _items = new();

    public int Count => _items.Count;

    public void Add(T item) => _items.Add(item);

    public T? GetById(int id)
    {
        foreach (var item in _items)
            if (item.Id == id)
                return item;
        return null;
    }
}
\`\`\``,
    solution: `public class Repository<T> where T : class, IHasId
{
    private readonly List<T> _items = new();

    public int Count => _items.Count;

    public void Add(T item) => _items.Add(item);

    public T? GetById(int id)
    {
        foreach (var item in _items)
            if (item.Id == id)
                return item;

        return null;
    }
}`,
    solutionExplanationPl: `\`Repository<T>\` to jedno repozytorium dla dowolnej encji: parametr \`T\` jest podstawiany na etapie kompilacji, więc repo produktów i repo klientów to ta sama definicja - bez kopiowania kodu. Sedno to **constraint** \`where T : class, IHasId\`: bez niego linia \`item.Id\` w ogóle by się nie skompilowała, bo kompilator nie wiedziałby, że \`T\` ma Id. Człon \`class\` mówi, że \`T\` jest typem referencyjnym, dzięki czemu \`GetById\` może zwrócić \`null\`, gdy niczego nie znajdzie.`,
    solutionExplanation: `\`Repository<T>\` is one repository for any entity: the \`T\` parameter is substituted at compile time, so a product repo and a customer repo share the same definition - no code duplication. The heart is the **constraint** \`where T : class, IHasId\`: without it the line \`item.Id\` would not compile at all, because the compiler would not know that \`T\` has an Id. The \`class\` part says \`T\` is a reference type, which lets \`GetById\` return \`null\` when it finds nothing.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Generics.RepositoryTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/07_generics/exercises/Repository.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/07_generics/RepositoryTests.cs',
    ],
  },
  {
    id: 'exercise-06',
    sequenceNumber: 6,
    title: 'The drinks menu - pattern matching',
    titlePl: 'Cennik napojów - pattern matching',
    category: 'Pattern matching',
    categoryPl: 'Pattern matching',
    timeMinutes: 10,
    description: `
# The drinks price list at "Ziarno"

## Context

The till must price a drink. Drinks are a small type hierarchy: espresso (number of shots), latte (size in ml) and tea (herbal or not). Instead of an if-ladder with casts you write ONE switch expression that recognizes the type and the properties at once - this section's material: type patterns, property patterns, relational patterns and the \`_\` discard.

## Task

1. Implement **Price(Drink drink)** as a **switch expression** with the rules:
   - Espresso with at least 2 shots - 12
   - Espresso - 9
   - Latte of 400 ml and up - 16
   - Latte - 13
   - Tea - 8
   - anything else (\`_\`) - throw **ArgumentException**
2. Implement **HasCaffeine(Drink drink)** as a single \`is\` expression: everything has caffeine EXCEPT herbal tea (the \`not\` pattern + a property pattern).

## Expected result

A double espresso costs 12, a 450 ml latte - 16, tea - 8, and an unknown drink ends with an exception. HasCaffeine returns false only for herbal tea.
    `,
    descriptionPl: `
# Cennik napojów „Ziarna"

## Kontekst

Kasa musi wycenić napój. Napoje to mała hierarchia typów: espresso (liczba shotów), latte (rozmiar w ml) i herbata (ziołowa albo nie). Zamiast drabinki if-ów z rzutowaniem piszesz JEDNO wyrażenie switch, które rozpoznaje typ i właściwości naraz - materiał tej sekcji: type pattern, property pattern, wzorce relacyjne i odrzutnik \`_\`.

## Zadanie

1. Zaimplementuj **Price(Drink drink)** jako **wyrażenie switch** z regułami:
   - Espresso z co najmniej 2 shotami - 12
   - Espresso - 9
   - Latte od 400 ml w górę - 16
   - Latte - 13
   - Tea - 8
   - cokolwiek innego (\`_\`) - rzuć **ArgumentException**
2. Zaimplementuj **HasCaffeine(Drink drink)** jednym wyrażeniem \`is\`: kofeinę ma wszystko POZA herbatą ziołową (wzorzec \`not\` + property pattern).

## Oczekiwany rezultat

Podwójne espresso kosztuje 12, latte 450 ml - 16, herbata - 8, a nieznany napój kończy się wyjątkiem. HasCaffeine zwraca false tylko dla ziołowej herbaty.
    `,
    hint: `The switch expression combines the patterns; order matters - the more specific case goes first:

\`\`\`csharp
drink switch
{
    Espresso { Shots: >= 2 } => 12m,
    Espresso => 9m,
    // ... the remaining cases
    _ => throw new ArgumentException("Nieznany napój.")
}
\`\`\`

HasCaffeine: \`drink is not Tea { Herbal: true }\`.`,
    hintPl: `Wyrażenie switch łączy wzorce; kolejność ma znaczenie - bardziej szczegółowy przypadek idzie pierwszy:

\`\`\`csharp
drink switch
{
    Espresso { Shots: >= 2 } => 12m,
    Espresso => 9m,
    // ... pozostałe przypadki
    _ => throw new ArgumentException("Nieznany napój.")
}
\`\`\`

HasCaffeine: \`drink is not Tea { Herbal: true }\`.`,
    solution: `public static decimal Price(Drink drink) => drink switch
{
    Espresso { Shots: >= 2 } => 12m,
    Espresso => 9m,
    Latte { SizeMl: >= 400 } => 16m,
    Latte => 13m,
    Tea => 8m,
    _ => throw new ArgumentException("Nieznany napój."),
};

public static bool HasCaffeine(Drink drink) => drink is not Tea { Herbal: true };`,
    solutionExplanationPl: `Jedno wyrażenie switch łączy trzy rodzaje wzorców: **type pattern** (\`Espresso\`, \`Latte\`) rozpoznaje typ bez rzutowania, **property pattern** z wzorcem relacyjnym (\`{ Shots: >= 2 }\`) zagląda do właściwości, a **odrzutnik** \`_\` łapie wszystko, czego cennik nie zna. Kolejność ramion ma znaczenie: bardziej szczegółowe (podwójne espresso) musi stać przed ogólnym. \`HasCaffeine\` to wzorzec \`not\` z property patternem - jedna linia zamiast if-a z rzutowaniem i sprawdzeniem flagi.`,
    solutionExplanation: `One switch expression combines three kinds of patterns: the **type pattern** (\`Espresso\`, \`Latte\`) recognizes the type without casting, the **property pattern** with a relational pattern (\`{ Shots: >= 2 }\`) looks inside properties, and the \`_\` **discard** catches whatever the price list does not know. Arm order matters: the more specific case (double espresso) must precede the general one. \`HasCaffeine\` is a \`not\` pattern with a property pattern - one line instead of an if with a cast and a flag check.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Match.MenuTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/08_match/exercises/Menu.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/08_match/MenuTests.cs',
    ],
  },
  {
    id: 'exercise-07',
    sequenceNumber: 7,
    title: 'The discount engine - Func and lambdas',
    titlePl: 'Silnik rabatów - Func i lambdy',
    category: 'Delegates',
    categoryPl: 'Delegaty',
    timeMinutes: 10,
    description: `
# The discount engine at "Ziarno"

## Context

The café app applies discounts to orders. A discount rule is simply a FUNCTION: you give it a price, it returns the discounted price. Because a rule is a function - \`Func<decimal, decimal>\` - you can store it in a variable, pass it to a method, build it with a lambda and pick the best one. That is this section's material: a Func as a value, lambdas and closures.

## Task

Implement three methods in the Discounts class:

1. **Apply(decimal price, Func<decimal, decimal> rule)** - apply one rule to the price (invoke the function like a method) and return the result.
2. **PercentOff(decimal percent)** - return a \`Func<decimal, decimal>\` (a lambda) that takes \`percent\` percent off the price. The lambda must remember \`percent\` from the argument - that is a closure.
3. **BestPrice(decimal price, Func<decimal, decimal>[] rules)** - apply every rule to the price and return the LOWEST result (the best deal for the customer). With no rules, return the original price.

## Expected result

\`PercentOff(20)\` builds a function that takes 20% off: for 100 it returns 80. \`BestPrice(100, [PercentOff(10), PercentOff(25), PercentOff(5)])\` returns 75 (25% off wins). A rule is an ordinary value - that is why you can keep a whole array of them.
    `,
    descriptionPl: `
# Silnik rabatów w „Ziarnie"

## Kontekst

Aplikacja kawiarni nalicza rabaty na zamówienia. Reguła rabatu to po prostu FUNKCJA: podajesz cenę, dostajesz cenę po rabacie. Skoro reguła jest funkcją - \`Func<decimal, decimal>\` - można ją trzymać w zmiennej, przekazać do metody, stworzyć lambdą i wybrać najlepszą. To materiał tej sekcji: Func jako wartość, lambdy i domknięcia.

## Zadanie

Zaimplementuj trzy metody w klasie Discounts:

1. **Apply(decimal price, Func<decimal, decimal> rule)** - zastosuj jedną regułę do ceny (wywołaj funkcję jak metodę) i zwróć wynik.
2. **PercentOff(decimal percent)** - zwróć \`Func<decimal, decimal>\` (lambdę), która zdejmuje z ceny \`percent\` procent. Lambda ma zapamiętać \`percent\` z argumentu - to domknięcie.
3. **BestPrice(decimal price, Func<decimal, decimal>[] rules)** - zastosuj każdą regułę do ceny i zwróć NAJNIŻSZY wynik (najlepszy deal dla klienta). Gdy reguł brak, zwróć wyjściową cenę.

## Oczekiwany rezultat

\`PercentOff(20)\` buduje funkcję zdejmującą 20%: dla 100 zwraca 80. \`BestPrice(100, [PercentOff(10), PercentOff(25), PercentOff(5)])\` zwraca 75 (25% off wygrywa). Reguła to zwykła wartość - dlatego można trzymać całą ich tablicę.
    `,
    hint: `A Func is invoked like a method; a lambda creates one on the spot and can capture an argument:

\`\`\`csharp
rule(price)                                   // Apply
price => price - price * percent / 100        // PercentOff (closure over percent)
\`\`\`

BestPrice: start with \`var best = price;\`, loop the rules, and keep the smallest result:

\`\`\`csharp
foreach (var rule in rules)
{
    var discounted = rule(price);
    if (discounted < best) best = discounted;
}
\`\`\``,
    hintPl: `Func wywołuje się jak metodę; lambda tworzy funkcję w miejscu i może przechwycić argument:

\`\`\`csharp
rule(price)                                   // Apply
price => price - price * percent / 100        // PercentOff (domknięcie na percent)
\`\`\`

BestPrice: zacznij od \`var best = price;\`, przejdź reguły i trzymaj najmniejszy wynik:

\`\`\`csharp
foreach (var rule in rules)
{
    var discounted = rule(price);
    if (discounted < best) best = discounted;
}
\`\`\``,
    solution: `public static decimal Apply(decimal price, Func<decimal, decimal> rule) => rule(price);

public static Func<decimal, decimal> PercentOff(decimal percent)
    => price => price - price * percent / 100;

public static decimal BestPrice(decimal price, Func<decimal, decimal>[] rules)
{
    var best = price;
    foreach (var rule in rules)
    {
        var discounted = rule(price);
        if (discounted < best)
            best = discounted;
    }

    return best;
}`,
    solutionExplanationPl: `\`Func<decimal, decimal>\` to typowana funkcja: cena na wejściu, cena na wyjściu. \`Apply\` po prostu ją wywołuje - \`rule(price)\` działa jak wywołanie metody. \`PercentOff\` zwraca **lambdę** i pokazuje **domknięcie**: lambda przechwytuje \`percent\` z argumentu i pamięta go po zakończeniu metody, więc \`PercentOff(10)\` i \`PercentOff(50)\` to dwie osobne funkcje ze swoimi procentami. \`BestPrice\` traktuje reguły jak zwykłe wartości w tablicy - przechodzi je pętlą, wywołuje każdą i wybiera najniższą cenę.`,
    solutionExplanation: `\`Func<decimal, decimal>\` is a typed function: price in, price out. \`Apply\` simply invokes it - \`rule(price)\` works like a method call. \`PercentOff\` returns a **lambda** and shows a **closure**: the lambda captures \`percent\` from the argument and remembers it after the method returns, so \`PercentOff(10)\` and \`PercentOff(50)\` are two separate functions with their own percentages. \`BestPrice\` treats the rules as ordinary values in an array - it loops them, invokes each and keeps the lowest price.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Delegates.DiscountsTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/09_delegates/exercises/Discounts.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/09_delegates/DiscountsTests.cs',
    ],
  },
  {
    id: 'exercise-08',
    sequenceNumber: 8,
    title: 'The menu board - extension methods',
    titlePl: 'Tablica menu - metody rozszerzające',
    category: 'Extension methods',
    categoryPl: 'Metody rozszerzające',
    timeMinutes: 10,
    description: `
# The menu board at "Ziarno"

## Context

A screen with the menu hangs above the counter. Names run long ("Sernik baskijski z konfiturą malinową" does not fit a tile) and descriptions are sometimes empty. We want to call these fixes like methods of string itself: \`name.Shorten(12)\`, \`description.OrPlaceholder("wkrótce")\` - even though string is a built-in type we cannot edit. That is exactly what extension methods are for; we write them in an \`extension\` block (C# 14).

## Task

Fill in the two methods in the \`extension(string text)\` block:

1. **Shorten(int max)**: return a text that fits within max characters unchanged; cut a longer one to max-1 characters and append "…" (the result is exactly max characters long).
2. **OrPlaceholder(string placeholder)**: replace an empty or whitespace-only text with the placeholder; return any other text unchanged (string.IsNullOrWhiteSpace helps).

## Expected result

\`"Sernik baskijski z konfiturą malinową".Shorten(12)\` gives "Sernik bask…", and \`"".OrPlaceholder("wkrótce")\` gives "wkrótce" - the calls look like string's own methods, although string knows nothing about them.
    `,
    descriptionPl: `
# Tablica menu „Ziarna"

## Kontekst

Nad ladą wisi ekran z menu. Nazwy bywają za długie ("Sernik baskijski z konfiturą malinową" nie mieści się na kafelku), a opisy bywają puste. Te poprawki chcemy wywoływać jak metody samego stringa: \`nazwa.Shorten(12)\`, \`opis.OrPlaceholder("wkrótce")\` - mimo że string to typ wbudowany i nie możemy go edytować. Dokładnie po to są metody rozszerzające; piszemy je w bloku \`extension\` (C# 14).

## Zadanie

Wypełnij dwie metody w bloku \`extension(string text)\`:

1. **Shorten(int max)**: tekst mieszczący się w max znakach zwróć bez zmian; dłuższy obetnij do max-1 znaków i doklej "…" (wynik ma dokładnie max znaków).
2. **OrPlaceholder(string placeholder)**: tekst pusty lub złożony z białych znaków zamień na placeholder; inny zwróć bez zmian (przyda się string.IsNullOrWhiteSpace).

## Oczekiwany rezultat

\`"Sernik baskijski z konfiturą malinową".Shorten(12)\` daje "Sernik bask…", a \`"".OrPlaceholder("wkrótce")\` daje "wkrótce" - wywołania wyglądają jak metody stringa, choć string nie ma o nich pojęcia.
    `,
    hint: `Inside the extension block \`text\` is the receiver - use it like \`this\`:

\`\`\`csharp
public string Shorten(int max)
{
    if (text.Length <= max)
        return text;

    return text.Substring(0, max - 1) + "…";
}
\`\`\`

\`text.Substring(0, max - 1)\` takes the first max-1 characters. OrPlaceholder: return the placeholder when \`string.IsNullOrWhiteSpace(text)\`, otherwise the text.`,
    hintPl: `Wewnątrz bloku extension \`text\` to odbiorca wywołania - używaj go jak \`this\`:

\`\`\`csharp
public string Shorten(int max)
{
    if (text.Length <= max)
        return text;

    return text.Substring(0, max - 1) + "…";
}
\`\`\`

\`text.Substring(0, max - 1)\` bierze pierwsze max-1 znaków. OrPlaceholder: zwróć placeholder, gdy \`string.IsNullOrWhiteSpace(text)\`, inaczej sam tekst.`,
    solution: `public static class MenuBoardExtensions
{
    extension(string text)
    {
        public string Shorten(int max)
        {
            if (text.Length <= max)
                return text;

            return text.Substring(0, max - 1) + "…";
        }

        public string OrPlaceholder(string placeholder)
        {
            if (string.IsNullOrWhiteSpace(text))
                return placeholder;

            return text;
        }
    }
}`,
    solutionExplanationPl: `Blok \`extension(string text)\` (C# 14) mówi: poniższe metody zachowują się jak metody instancyjne stringa, a \`text\` to odbiorca wywołania. Kompilator zamienia \`nazwa.Shorten(12)\` na wywołanie statycznej metody z klasy \`MenuBoardExtensions\` - string pozostaje nietknięty, a składnia wygląda naturalnie. Tak samo działa cały LINQ z następnej sekcji: \`Where\`, \`Select\` i reszta to metody rozszerzające na IEnumerable.`,
    solutionExplanation: `The \`extension(string text)\` block (C# 14) says: the methods below behave like instance methods of string, with \`text\` as the receiver. The compiler turns \`name.Shorten(12)\` into a call to a static method of \`MenuBoardExtensions\` - string stays untouched while the syntax reads naturally. The entire LINQ of the next section works the same way: \`Where\`, \`Select\` and the rest are extension methods on IEnumerable.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Extensions.MenuBoardExtensionsTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/10_extensions/exercises/MenuBoardExtensions.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/10_extensions/MenuBoardExtensionsTests.cs',
    ],
  },
  {
    id: 'exercise-09',
    sequenceNumber: 9,
    title: 'The daily report - LINQ into a DTO',
    titlePl: 'Raport dnia - LINQ do DTO',
    category: 'LINQ',
    categoryPl: 'LINQ',
    timeMinutes: 10,
    description: `
# The daily report at "Ziarno"

## Context

Closing time at "Ziarno". The till hands over the day's order lines (product, price, quantity) and the owner wants a best-sellers report: only what actually sold, ordered by revenue, in a form ready to display. Instead of loops with helper lists you compose it as one LINQ chain: filter, sort and project onto a separate result class.

## Task

Implement **BestSellers(lines)** as a single LINQ chain:

1. **Where** - keep only the lines that actually sold (Quantity > 0).
2. **OrderByDescending** - sort by revenue (Price * Quantity), highest first.
3. **Select** - project each line onto the ready-made **ProductSummary** DTO (product name + the computed revenue).

## Expected result

For the sample day the report drops the unsold lines, orders the best sellers from the highest revenue, and returns a list of ProductSummary with the revenue already computed - ready to show.
    `,
    descriptionPl: `
# Raport dnia „Ziarna"

## Kontekst

Koniec dnia w „Ziarnie". Kasa oddaje listę pozycji sprzedaży (produkt, cena, ilość), a właścicielka chce raport bestsellerów: tylko to, co faktycznie się sprzedało, od największego utargu, w postaci gotowej do pokazania. Zamiast pętli z listami pomocniczymi składasz to jednym łańcuchem LINQ: filtr, sortowanie i przepisanie na osobną klasę wyniku.

## Zadanie

Zaimplementuj **BestSellers(lines)** jednym łańcuchem LINQ:

1. **Where** - zostaw tylko pozycje faktycznie sprzedane (Quantity > 0).
2. **OrderByDescending** - posortuj po utargu (Price * Quantity) malejąco.
3. **Select** - przepisz każdą pozycję na gotowe DTO **ProductSummary** (nazwa produktu + policzony utarg).

## Oczekiwany rezultat

Dla przykładowego dnia raport pomija pozycje niesprzedane, ustawia bestsellery od najwyższego utargu i oddaje listę ProductSummary z policzonym utargiem - gotową do wyświetlenia.
    `,
    hint: `One chain of three operators. \`ProductSummary\` is already defined - you just project onto it in Select:

\`\`\`csharp
lines
    .Where(l => l.Quantity > 0)
    .OrderByDescending(l => l.Price * l.Quantity)
    .Select(l => new ProductSummary(l.Product, l.Price * l.Quantity));
\`\`\``,
    hintPl: `Jeden łańcuch trzech operatorów. \`ProductSummary\` jest już zdefiniowane - w Select tylko przepisujesz na nie:

\`\`\`csharp
lines
    .Where(l => l.Quantity > 0)
    .OrderByDescending(l => l.Price * l.Quantity)
    .Select(l => new ProductSummary(l.Product, l.Price * l.Quantity));
\`\`\``,
    solution: `public static IEnumerable<ProductSummary> BestSellers(IEnumerable<OrderLine> lines)
    => lines
        .Where(l => l.Quantity > 0)
        .OrderByDescending(l => l.Price * l.Quantity)
        .Select(l => new ProductSummary(l.Product, l.Price * l.Quantity));`,
    solutionExplanationPl: `Jeden łańcuch, trzy operatory - dokładnie tak buduje się raport w LINQ. \`Where\` odsiewa pozycje niesprzedane, \`OrderByDescending\` sortuje po policzonym utargu, a \`Select\` **przepisuje** każdą pozycję na osobne DTO \`ProductSummary\` (dane wejściowe zostają nietknięte, dostajesz nowy typ pod wyświetlenie). Nic nie liczy się, dopóki ktoś nie zacznie iterować wyniku - to deferred execution: łańcuch tylko opisuje zapytanie, wykonuje się przy \`ToArray\`/\`foreach\`.`,
    solutionExplanation: `One chain, three operators - exactly how you build a report in LINQ. \`Where\` filters out the unsold lines, \`OrderByDescending\` sorts by the computed revenue, and \`Select\` **projects** each line onto a separate \`ProductSummary\` DTO (the input stays untouched, you get a new display-ready type). Nothing computes until someone iterates the result - that is deferred execution: the chain only describes the query and runs on \`ToArray\`/\`foreach\`.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Linq.SalesReportTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/11_linq/exercises/SalesReport.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/11_linq/SalesReportTests.cs',
    ],
  },
  {
    id: 'exercise-10',
    sequenceNumber: 10,
    title: 'The morning dashboard - async/await',
    titlePl: 'Poranny panel - async/await',
    category: 'Asynchrony',
    categoryPl: 'Asynchroniczność',
    timeMinutes: 10,
    description: `
# The morning dashboard at "Ziarno"

## Context

Every morning, before opening, the café's app pulls data from three places: the bean stock from the storeroom, the milk price from the supplier and the rating from a review site. Each source takes a moment to respond (simulated by the Fetch* methods with Task.Delay). Waiting one by one wastes time - the sources are independent, so they should respond IN PARALLEL. And a late supplier needs a safety valve: cancellation.

## Task

Implement three methods:

1. **BeansLabelAsync()**: fetch the bean stock (await FetchBeansKgAsync) and return the text "Ziarna: 12 kg".
2. **LoadSummaryAsync()**: start ALL three sources at once (calls first, then Task.WhenAll) and compose the results into "Ziarna: 12 kg | Mleko: 3.20 zł | Ocena: 4.8".
3. **WaitForDeliveryAsync(CancellationToken token)**: wait for the delivery (Task.Delay(5000, token)) - the passed token must be able to break the wait.

## Expected result

LoadSummaryAsync finishes in the time of the SLOWEST source, not the sum of all three (the test measures time), and cancelling the token breaks WaitForDeliveryAsync with an OperationCanceledException.
    `,
    descriptionPl: `
# Poranny panel „Ziarna"

## Kontekst

Rano, przed otwarciem, aplikacja kawiarni pobiera dane z trzech miejsc: stan ziaren z magazynu, cenę mleka od dostawcy i ocenę z portalu z opiniami. Każde źródło chwilę odpowiada (symulują to metody Fetch* z Task.Delay). Czekanie po kolei marnuje czas - źródła są niezależne, więc mają odpowiadać RÓWNOLEGLE. A na spóźnionego dostawcę musi być bezpiecznik: anulowanie.

## Zadanie

Zaimplementuj trzy metody:

1. **BeansLabelAsync()**: pobierz stan ziaren (await FetchBeansKgAsync) i zwróć tekst "Ziarna: 12 kg".
2. **LoadSummaryAsync()**: uruchom WSZYSTKIE trzy źródła naraz (najpierw wywołania, potem Task.WhenAll), a z wyników złóż tekst "Ziarna: 12 kg | Mleko: 3.20 zł | Ocena: 4.8".
3. **WaitForDeliveryAsync(CancellationToken token)**: czekaj na dostawę (Task.Delay(5000, token)) - przekazany token ma umieć przerwać czekanie.

## Oczekiwany rezultat

LoadSummaryAsync kończy się w czasie NAJWOLNIEJSZEGO źródła, a nie sumy wszystkich (test mierzy czas), a anulowanie tokenu przerywa WaitForDeliveryAsync wyjątkiem OperationCanceledException.
    `,
    hint: `Parallelism starts at the CALL, not at the await:

\`\`\`csharp
var beansTask = FetchBeansKgAsync();     // all three already running
var milkTask = FetchMilkPriceAsync();
var ratingTask = FetchRatingAsync();
await Task.WhenAll(beansTask, milkTask, ratingTask);
var beans = beansTask.Result;            // safe - the task is finished
\`\`\`

If you write \`await\` before each call, they run one by one. WaitForDeliveryAsync: \`await Task.Delay(5000, token);\`.`,
    hintPl: `Równoległość zaczyna się przy WYWOŁANIU, nie przy await:

\`\`\`csharp
var beansTask = FetchBeansKgAsync();     // wszystkie trzy już lecą
var milkTask = FetchMilkPriceAsync();
var ratingTask = FetchRatingAsync();
await Task.WhenAll(beansTask, milkTask, ratingTask);
var beans = beansTask.Result;            // bezpieczne - task jest zakończony
\`\`\`

Jeśli napiszesz \`await\` przed każdym wywołaniem, polecą jedno po drugim. WaitForDeliveryAsync: \`await Task.Delay(5000, token);\`.`,
    solution: `public async Task<string> BeansLabelAsync()
{
    var beans = await FetchBeansKgAsync();
    return $"Ziarna: {beans} kg";
}

public async Task<string> LoadSummaryAsync()
{
    var beansTask = FetchBeansKgAsync();
    var milkTask = FetchMilkPriceAsync();
    var ratingTask = FetchRatingAsync();

    await Task.WhenAll(beansTask, milkTask, ratingTask);

    return $"Ziarna: {beansTask.Result} kg | Mleko: {milkTask.Result} zł | Ocena: {ratingTask.Result}";
}

public async Task WaitForDeliveryAsync(CancellationToken token)
{
    await Task.Delay(5000, token);
}`,
    solutionExplanationPl: `Kluczowa różnica: \`await FetchA(); await FetchB();\` czeka na A zanim ruszy B (suma czasów), a trzy wywołania BEZ await startują od razu i \`Task.WhenAll\` czeka na wszystkie naraz (czas najwolniejszego). Po \`WhenAll\` sięgnięcie po \`.Result\` jest bezpieczne, bo taski są już zakończone. \`Task.Delay(5000, token)\` pokazuje kooperatywne anulowanie: odwołany token przerywa czekanie wyjątkiem \`OperationCanceledException\` zamiast blokować aplikację na 5 sekund.`,
    solutionExplanation: `The key difference: \`await FetchA(); await FetchB();\` waits for A before starting B (sum of times), while three calls WITHOUT await start immediately and \`Task.WhenAll\` awaits them together (time of the slowest). After \`WhenAll\`, reading \`.Result\` is safe - the tasks are already finished. \`Task.Delay(5000, token)\` demonstrates cooperative cancellation: a cancelled token breaks the wait with an \`OperationCanceledException\` instead of blocking the app for 5 seconds.`,
    testFilter: 'FullyQualifiedName~Exercises.Tests.Async.MorningDashboardTests',
    relatedFiles: [
      'dzien1-csharp/cwiczenia/src/Exercises/12_async/exercises/MorningDashboard.cs',
      'dzien1-csharp/cwiczenia/tests/Exercises.Tests/12_async/MorningDashboardTests.cs',
    ],
  },
];
