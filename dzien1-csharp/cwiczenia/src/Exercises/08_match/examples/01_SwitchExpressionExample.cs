namespace Exercises.Match.Examples;

// PRZYKŁAD (sekcja 8, slajd 41): drabina if/else vs switch expression.
public static class SwitchExpressionExample
{
    public static void Run()
    {
        Console.WriteLine("== 08: drabina if/else vs switch expression (slajd 41) ==");

        foreach (var status in Enum.GetValues<DeliveryStatus>())
            Console.WriteLine($"  {status,-9}: if/else -> {DescribeClassic(status),-15} switch -> {Describe(status)}");
    }

    // PRZED: drabina if/else - decyzja rozproszona na osobne returny.
    private static string DescribeClassic(DeliveryStatus status)
    {
        if (status == DeliveryStatus.Pending)
        {
            return "w przygotowaniu";
        }

        if (status == DeliveryStatus.Shipped)
        {
            return "w drodze";
        }

        if (status == DeliveryStatus.Delivered)
        {
            return "doręczona";
        }

        return "nieznany status";
    }

    // PO: switch expression - jedna decyzja = jedno WYRAŻENIE zwracające wartość.
    // Po lewej wzorzec, po prawej wynik; _ domyka pozostałe przypadki.
    private static string Describe(DeliveryStatus status) => status switch
    {
        DeliveryStatus.Pending   => "w przygotowaniu",
        DeliveryStatus.Shipped   => "w drodze",
        DeliveryStatus.Delivered => "doręczona",
        _                        => "nieznany status"
    };
}

public enum DeliveryStatus
{
    Pending,
    Shipped,
    Delivered
}
