namespace Exercises.Immutability.Examples;

// PRZYKŁAD (sekcja 6, slajdy 33-34): class z ręcznym boilerplate vs record.
public static class RecordVsClassExample
{
    public static void Run()
    {
        Console.WriteLine("== 06: class vs record - ta sama intencja (slajdy 33-34) ==");

        var c1 = new MoneyClass(10m, "PLN");
        var c2 = new MoneyClass(10m, "PLN");
        // class: == porównuje REFERENCJE - te same dane, a jednak "różne".
        Console.WriteLine($"class:  c1 == c2 -> {c1 == c2},  ToString -> {c1}");

        var r1 = new Money(10m, "PLN");
        var r2 = new Money(10m, "PLN");
        // record: równość przez WARTOŚĆ + czytelny ToString za darmo.
        Console.WriteLine($"record: r1 == r2 -> {r1 == r2},  ToString -> {r1}");
    }
}

// PRZED (do C# 8): value object ręcznie - każda linia poniżej to potencjalna
// pomyłka przy kolejnej zmianie zestawu pól.
public class MoneyClass
{
    public MoneyClass(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public decimal Amount { get; }
    public string Currency { get; }

    public override bool Equals(object? other)
    {
        var money = other as MoneyClass;
        return money != null
            && money.Amount == Amount
            && money.Currency == Currency;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Amount, Currency);
    }
}

// PO (C# 9): cała powyższa dyscyplina wbudowana w JEDNĄ linię.
public record Money(decimal Amount, string Currency);
