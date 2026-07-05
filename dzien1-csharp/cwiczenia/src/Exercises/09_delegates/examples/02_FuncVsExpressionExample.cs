using System.Linq.Expressions;

namespace Exercises.Delegates.Examples;

// PRZYKŁAD (sekcja 9, slajd 46): Func to wykonywalny KOD, Expression to DANE
// opisujące kod - fundament tłumaczenia LINQ na SQL w EF Core.
public static class FuncVsExpressionExample
{
    public static void Run()
    {
        Console.WriteLine("== 09: Func (kod) vs Expression (dane) - slajd 46 ==");

        // Zapis identyczny - ale to dwa zupełnie różne światy:
        Func<int, bool> isAdult = age => age > 18;
        Expression<Func<int, bool>> tree = age => age > 18;

        // Func to WYKONYWALNY kod:
        Console.WriteLine($"Func:       isAdult(20) = {isAdult(20)}");

        // Expression to DANE opisujące kod - można je obejrzeć...
        Console.WriteLine($"Expression: {tree}  (body: {tree.Body}, typ: {tree.Body.NodeType})");

        // ...i dopiero na życzenie skompilować z powrotem do kodu.
        Func<int, bool> compiled = tree.Compile();
        Console.WriteLine($"Compile():  compiled(20) = {compiled(20)}");

        // Dokładnie na tym stoi EF Core (Dzień 3): IQueryable dostaje Expression
        // i TŁUMACZY drzewo na SQL, zamiast wykonywać je w pamięci.
    }
}
