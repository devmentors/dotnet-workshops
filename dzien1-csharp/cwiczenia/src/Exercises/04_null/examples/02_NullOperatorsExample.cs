namespace Exercises.Null.Examples;

// PRZYKŁAD (sekcja 4, slajdy 22-23): operatory ?. ?? ??= oraz pułapka łańcucha.
public static class NullOperatorsExample
{
    public static void Run()
    {
        Console.WriteLine("== 04: operatory ?. ?? ??= i pułapka łańcucha (slajdy 22-23) ==");

        Order? order = new Order { Buyer = new Buyer { Address = null } };

        // ?. - każde ogniwo chronione: gdy cokolwiek jest null, całość daje null.
        string? zip = order?.Buyer?.Address?.Zip;

        // ?? - wartość zapasowa, gdy lewa strona to null.
        Console.WriteLine($"zip: {zip ?? "brak kodu"}");

        // ??= - przypisz tylko wtedy, gdy zmienna wciąż jest null.
        zip ??= "00-000";
        Console.WriteLine($"po ??=: {zip}");

        // PUŁAPKA (slajd 23): pierwsze ?. NIE chroni dalszych kropek.
        // Odkomentuj i zobacz ostrzeżenie kompilatora:
        // string? city = order?.Buyer.Address.Zip;   // CS8602: Buyer może być null
    }
}

// Prosty łańcuch obiektów pod demo operatorów null.
public class Order
{
    public Buyer? Buyer;
}

public class Buyer
{
    public ShippingAddress? Address;
}

public class ShippingAddress
{
    public string? Zip;
}
