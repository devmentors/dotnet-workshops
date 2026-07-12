namespace IlDemo;

public static class Program
{
    public static async Task Main()
    {
        _ = RecordVsClass.Demo();
        _ = ClosureCapture.Demo();
        _ = UsingBlock.Demo();
        _ = await StateMachine.Demo();
    }
}
