namespace Exercises.Immutability.Examples;

// PRZYKŁAD (sekcja 6, slajd 35): dekonstrukcja - record ma ją wbudowaną,
// zwykła klasa musi jawnie zadeklarować metodę Deconstruct z parametrami out.
public static class DeconstructionExample
{
    public static void Run()
    {
        Console.WriteLine("== 06: wbudowana dekonstrukcja (slajd 35) ==");

        // record: Deconstruct wygenerowany automatycznie.
        var point = new Coordinates(54.35, 18.65);
        var (lat, lng) = point;
        Console.WriteLine($"record: var (lat, lng) = point -> {lat} / {lng}");

        var (onlyLat, _) = point; // discard: bierzemy tylko jedną składową
        Console.WriteLine($"discard: onlyLat = {onlyLat}");

        // CLASS: ten sam zapis dekonstrukcji działa, bo GeoPoint ma RĘCZNIE
        // napisaną metodę Deconstruct - dokładnie to record generuje za darmo.
        var gdansk = new GeoPoint(54.35, 18.65);
        var (manualLat, manualLng) = gdansk;
        Console.WriteLine($"class + własny Deconstruct: {manualLat} / {manualLng}");
    }
}

// record: jedna linia, Deconstruct w zestawie.
public record Coordinates(double Lat, double Lng);

// Zwykła klasa NIE dostaje dekonstrukcji za darmo - trzeba ją dopisać samemu.
public class GeoPoint
{
    public double Lat { get; }
    public double Lng { get; }

    public GeoPoint(double lat, double lng)
    {
        Lat = lat;
        Lng = lng;
    }

    // Kontrakt jest umowny: metoda MUSI nazywać się Deconstruct i mieć parametry out.
    // Kompilator szuka jej, gdy widzi zapis var (lat, lng) = obiekt.
    public void Deconstruct(out double lat, out double lng)
    {
        lat = Lat;
        lng = Lng;
    }
}
