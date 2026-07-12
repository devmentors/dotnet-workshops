using LeakDemo;

Console.WriteLine("LeakDemo: celowy wyciek pamięci. Podłącz dotnet-counters / dotnet-gcdump.");
Console.WriteLine($"PID = {Environment.ProcessId}. Ctrl+C aby zatrzymać.");
Console.WriteLine();

var publisher = new TickPublisher();
var created = 0;

while (true)
{
    var subscriber = new Subscriber(publisher);
    _ = subscriber;

    created++;

    if (created % 1000 == 0)
    {
        Console.WriteLine($"Żywych subscriberów: {publisher.SubscriberCount}");
    }

    Thread.Sleep(1);
}
