namespace IlDemo;

public static class ClosureCapture
{
    public static (int[] forLoop, int[] forEach) Demo()
    {
        var forLoop = new List<Func<int>>();
        for (int i = 0; i < 3; i++)
        {
            forLoop.Add(() => i);
        }

        var forEach = new List<Func<int>>();
        foreach (var x in Enumerable.Range(0, 3))
        {
            forEach.Add(() => x);
        }

        return (forLoop.Select(f => f()).ToArray(), forEach.Select(f => f()).ToArray());
    }
}
