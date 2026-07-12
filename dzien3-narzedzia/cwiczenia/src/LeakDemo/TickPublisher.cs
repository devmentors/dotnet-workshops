using System.Runtime.CompilerServices;

namespace LeakDemo;

public sealed class TickPublisher
{
    private static readonly List<Subscriber> _subscribers = new();

    public int SubscriberCount => _subscribers.Count;

    public void Subscribe(Subscriber subscriber) => _subscribers.Add(subscriber);

    public void Unsubscribe(Subscriber subscriber) => _subscribers.Remove(subscriber);
}

[InlineArray(4096)]
public struct Payload
{
    private byte _element0;
}

public sealed class Subscriber
{
    private readonly TickPublisher _publisher;
    private Payload _payload;

    public Subscriber(TickPublisher publisher)
    {
        _publisher = publisher;
        _payload[0] = 1;
        _publisher.Subscribe(this);
    }
}
