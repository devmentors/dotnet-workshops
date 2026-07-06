using System.Threading.Channels;

namespace Shop.Core.Ordering;

public class OrderQueue
{
    private readonly Channel<Order> _channel = Channel.CreateUnbounded<Order>();

    public ValueTask Enqueue(Order order) => _channel.Writer.WriteAsync(order);

    public IAsyncEnumerable<Order> ReadAllAsync(CancellationToken ct) => _channel.Reader.ReadAllAsync(ct);
}
