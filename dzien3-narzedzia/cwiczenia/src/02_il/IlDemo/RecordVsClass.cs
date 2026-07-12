namespace IlDemo;

public record PointRecord(int X, int Y);

public class PointClass(int x, int y)
{
    public int X { get; } = x;
    public int Y { get; } = y;
}

public static class RecordVsClass
{
    public static bool Demo()
    {
        var byValue = new PointRecord(1, 2) == new PointRecord(1, 2);
        var byReference = new PointClass(1, 2).Equals(new PointClass(1, 2));
        return byValue && byReference;
    }
}
