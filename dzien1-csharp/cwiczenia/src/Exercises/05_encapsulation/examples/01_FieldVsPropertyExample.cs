namespace Exercises.Encapsulation.Examples;

// PRZYKŁAD (sekcja 5, slajdy 27-29): pole -> właściwość -> field (C# 14).
// Ta sama klasa w trzech epokach.
public static class FieldVsPropertyExample
{
    public static void Run()
    {
        Console.WriteLine("== 05: pole -> właściwość -> field (slajdy 27-29) ==");

        var v1 = new TicketV1();
        v1.Seats = -5;
        Console.WriteLine($"pole:        Seats = {v1.Seats}  (nikt nie zaprotestował)");

        var v2 = new TicketV2();
        v2.Seats = 3;
        try
        {
            v2.Seats = -5;
        }
        catch (ArgumentException)
        {
            Console.WriteLine($"właściwość:  Seats = {v2.Seats}  (-5 odrzucone w set)");
        }

        var v3 = new TicketV3();
        v3.Code = "abc-77";
        Console.WriteLine($"field (C#14): Code = {v3.Code}  (normalizacja w set, bez ręcznego pola)");
    }
}

public class TicketV1
{
    public int Seats; // surowe pole: każdy wpisze cokolwiek, także -5
}

public class TicketV2
{
    private int _seats; // klasyczny duet: prywatne pole + właściwość z walidacją

    public int Seats
    {
        get => _seats;
        set
        {
            if (value < 0)
            {
                throw new ArgumentException("Miejsca nie mogą być ujemne.");
            }

            _seats = value;
        }
    }
}

public class TicketV3
{
    // C# 14: `field` to automatyczne pole właściwości - duet w jednej deklaracji.
    public string Code
    {
        get => field;
        set => field = value.ToUpperInvariant();
    } = "";
}
