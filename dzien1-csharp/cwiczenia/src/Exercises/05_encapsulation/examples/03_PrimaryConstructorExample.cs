namespace Exercises.Encapsulation.Examples;

// PRZYKŁAD (sekcja 5, slajd 31): primary constructor (C# 12) - przed i po.
public static class PrimaryConstructorExample
{
    public static void Run()
    {
        Console.WriteLine("== 05: primary constructor (slajd 31) ==");

        var clock = new SystemClock();
        var classic = new ReceiptClassic(clock);
        var modern = new Receipt(clock);
        Console.WriteLine($"klasycznie: {classic.At:T}");
        Console.WriteLine($"primary:    {modern.At:T}  (ta sama semantyka, mniej ceremonii)");
    }
}

public interface IClock
{
    DateTime Now { get; }
}

public class SystemClock : IClock
{
    public DateTime Now => DateTime.Now;
}

// PRZED (C# < 12): konstruktor + pole tylko po to, żeby przenieść zależność.
public class ReceiptClassic
{
    private readonly IClock _clock;

    public ReceiptClassic(IClock clock)
    {
        _clock = clock;
    }

    public DateTime At => _clock.Now;
}

// PO (C# 12): parametr primary constructora widoczny w całym ciele typu.
public class Receipt(IClock clock)
{
    public DateTime At => clock.Now;
}
