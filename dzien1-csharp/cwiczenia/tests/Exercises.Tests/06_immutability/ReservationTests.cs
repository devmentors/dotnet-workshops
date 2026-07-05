using Exercises.Immutability;
using Xunit;

namespace Exercises.Tests.Immutability;

public class ReservationTests
{
    [Fact]
    public void Two_reservations_with_the_same_data_are_equal()
    {
        var a = new Reservation("Darek", "W2", 4);
        var b = new Reservation("Darek", "W2", 4);

        Assert.Equal(a, b);
        Assert.True(a == b, "Dwie identyczne rezerwacje mają być równe - zamień klasę na record.");
    }

    [Fact]
    public void MoveTo_returns_a_copy_with_the_new_table()
    {
        var original = new Reservation("Darek", "W2", 4);

        var moved = original.MoveTo("W5");

        Assert.Equal("W5", moved.Table);
        Assert.Equal("Darek", moved.Guest);
        Assert.Equal(4, moved.Seats);
    }

    [Fact]
    public void MoveTo_does_not_change_the_original()
    {
        var original = new Reservation("Darek", "W2", 4);

        original.MoveTo("W5");

        Assert.Equal("W2", original.Table);
    }

    [Fact]
    public void Summary_composes_the_description_from_deconstructed_fields()
    {
        var reservation = new Reservation("Darek", "W2", 4);

        Assert.Equal("Darek - stolik W2, 4 os.", reservation.Summary());
    }
}
