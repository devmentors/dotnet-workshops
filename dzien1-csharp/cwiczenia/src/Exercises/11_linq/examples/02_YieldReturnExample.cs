namespace Exercises.Linq.Examples;

// PRZYKŁAD (sekcja 11, slajd 53): iterator `yield return` -
// elementy powstają leniwie, na żądanie.
public static class YieldReturnExample
{
    public static void Run()
    {
        Console.WriteLine("== 11: yield return - elementy powstają na żądanie (slajd 53) ==");

        // Pętla w Squares() jest nieskończona - a mimo to program się kończy,
        // bo Take(3) zawoła MoveNext tylko trzy razy.
        foreach (var square in Squares().Take(3))
            Console.WriteLine($"  -> {square}");

        Console.WriteLine();
        Console.WriteLine("== 11: pod spodem - yield to maszyna stanów ==");

        // Ten iterator kompilator ZAMIENIA na klasę z polem stanu -
        // ciało metody trafia do MoveNext, a każde yield to kolejny stan.
        foreach (var number in Numbers())
            Console.WriteLine($"  iterator:        {number}");

        // To samo napisane RĘCZNIE - mniej więcej to generuje kompilator.
        // Każde MoveNext() wchodzi do switcha i wznawia od zapisanego stanu.
        var machine = new NumbersStateMachine();
        while (machine.MoveNext())
            Console.WriteLine($"  maszyna stanów:  {machine.Current}");
    }

    private static IEnumerable<int> Squares()
    {
        for (var n = 1; ; n++)
        {
            Console.WriteLine($"  [iterator] liczę {n}*{n}");
            yield return n * n;  // oddaje wartość i ZAWIESZA się do następnego MoveNext
        }
    }

    private static IEnumerable<int> Numbers()
    {
        yield return 1;   // stan 0 -> 1
        yield return 2;   // stan 1 -> 2
        yield return 3;   // stan 2 -> 3
    }
}

// Ręczny odpowiednik iteratora Numbers() - uproszczona wersja klasy,
// którą kompilator generuje z metody z yield return.
public class NumbersStateMachine
{
    private int _state;               // gdzie wykonanie "zasnęło" ostatnim razem
    public int Current { get; private set; }  // wartość oddana przez ostatni yield

    public bool MoveNext()
    {
        // yield return X == zapisz następny stan, ustaw Current, wyjdź z true.
        // Kolejne MoveNext wraca tu i skacze do miejsca, w którym skończył.
        switch (_state)
        {
            case 0:
                _state = 1;
                Current = 1;   // yield return 1;
                return true;
            case 1:
                _state = 2;
                Current = 2;   // yield return 2;
                return true;
            case 2:
                _state = 3;
                Current = 3;   // yield return 3;
                return true;
            default:
                return false;  // koniec metody = koniec sekwencji
        }
    }
}
