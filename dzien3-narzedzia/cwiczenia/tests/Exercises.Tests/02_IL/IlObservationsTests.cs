using Xunit;

namespace Exercises.Tests._02_IL;

file record PointRecord(int X, int Y);

file class PointClass(int x, int y)
{
    public int X { get; } = x;
    public int Y { get; } = y;
}

public class IlObservationsTests
{
    [Fact]
    public void record_two_equal_instances_are_equal_by_value()
    {
        var r1 = new PointRecord(1, 2);
        var r2 = new PointRecord(1, 2);

        Assert.NotSame(r1, r2);
        Assert.False(ReferenceEquals(r1, r2));

        Assert.Equal(r1, r2);
        Assert.True(r1.Equals(r2));
        Assert.True(r1 == r2);
        Assert.Equal(r1.GetHashCode(), r2.GetHashCode());
    }

    [Fact]
    public void class_two_equal_instances_differ_by_reference()
    {
        var c1 = new PointClass(1, 2);
        var c2 = new PointClass(1, 2);

        Assert.NotSame(c1, c2);
        Assert.False(ReferenceEquals(c1, c2));
        Assert.False(c1.Equals(c2));

        var alias = c1;
        Assert.Same(c1, alias);
        Assert.True(c1.Equals(alias));
    }

    [Fact]
    public void closure_over_shared_loop_variable_captures_final_value()
    {
        var captured = new List<Func<int>>();
        for (int i = 0; i < 3; i++)
        {
            captured.Add(() => i);
        }

        Assert.Equal(new[] { 3, 3, 3 }, captured.Select(f => f()).ToArray());
    }

    [Fact]
    public void closure_over_foreach_variable_captures_distinct_values()
    {
        var captured = new List<Func<int>>();
        foreach (var x in Enumerable.Range(0, 3))
        {
            captured.Add(() => x);
        }

        Assert.Equal(new[] { 0, 1, 2 }, captured.Select(f => f()).ToArray());
    }
}
