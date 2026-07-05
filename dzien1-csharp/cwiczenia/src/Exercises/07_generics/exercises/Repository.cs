namespace Exercises.Generics;

// =====================================================================
// ZADANIE (07_generics) - Repozytorium encji aplikacji „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Aplikacja kawiarni przechowuje różne encje: produkty, klientów,
//   zamówienia. Każda z nich ma swoje Id. Zamiast pisać osobne
//   ProductRepository, CustomerRepository, OrderRepository - trzy prawie
//   identyczne klasy - piszesz JEDNO repozytorium z parametrem typu T.
//   Haczyk: żeby wyszukać encję po Id, repozytorium musi wiedzieć, że T MA
//   właściwość Id. Gwarantuje to CONSTRAINT `where T : class, IHasId`.
//
// ZADANIE - klasa Repository<T> startuje BEZ constraintu. Uzupełnij ją:
//   1) Add(T item): dodaj encję (trzymaj encje w List<T>).
//   2) GetById(int id): zwróć encję o danym Id, albo null, gdy jej nie ma.
//      Żeby odczytać item.Id, MUSISZ dopisać do klasy constraint
//      `where T : class, IHasId` - bez niego kompilator nie wie, że T ma Id
//      (`class` = encja jest typem referencyjnym, więc można zwrócić null).
//   3) Count: ile encji jest w repozytorium.
//
// OCZEKIWANY REZULTAT:
//   Jedno Repository<T> obsługuje i produkty, i klientów. GetById znajduje
//   encję po Id albo zwraca null. Bez constraintu `where T : class, IHasId`
//   kod z `item.Id` w ogóle by się nie skompilował - to jest sedno zadania.

// Encje aplikacji - każda ma Id (dane, nie zmieniaj).
public interface IHasId
{
    int Id { get; }
}

public record Product(int Id, string Name) : IHasId;

public record Customer(int Id, string Name) : IHasId;

public class Repository<T>
{
    private readonly List<T> _items = new();

    // TODO: dodaj encję do listy.
    public void Add(T item)
    {
        throw new NotImplementedException("Dodaj encję do repozytorium.");
    }

    // TODO: znajdź encję po Id (albo null). Dopisz constraint where T : class, IHasId.
    public T? GetById(int id)
    {
        throw new NotImplementedException("Znajdź encję po Id - dopisz constraint, by odczytać item.Id.");
    }

    // TODO: ile encji jest w repozytorium.
    public int Count => throw new NotImplementedException("Zwróć liczbę encji.");
}
