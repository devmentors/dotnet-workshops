namespace Exercises.Linq.Examples;

// PRZYKŁAD (sekcja 11, slajdy 52 i 55): deferred execution - quiz "jaki wynik?".
public static class DeferredExecutionExample
{
    public static void Run()
    {
        Console.WriteLine("== 11: quiz ze slajdu 56 - jaki wynik? ==");

        var numbers = new List<int> { 1, 2, 3 };
        var query = numbers.Where(n => n > 1);   // przepis, nie wynik - nic się nie liczy
        numbers.Add(4);
        // Dopiero Count() wykonuje przepis - na liście, która MA JUŻ 4 elementy.
        Console.WriteLine($"query.Count() = {query.Count()}   (2, 3 i 4 są > 1)");
    }
}
