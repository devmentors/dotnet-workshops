namespace IlDemo;

public static class UsingBlock
{
    public static long Demo()
    {
        using (var file = File.OpenRead(typeof(UsingBlock).Assembly.Location))
        {
            return file.Length;
        }
    }
}
