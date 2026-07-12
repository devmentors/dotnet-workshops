namespace IlDemo;

public static class StateMachine
{
    public static async Task<string> Demo()
    {
        var data = await Fetch();
        return Parse(data);
    }

    private static Task<string> Fetch() => Task.FromResult("42");

    private static string Parse(string value) => $"parsed:{value}";
}
