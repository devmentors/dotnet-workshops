using Microsoft.Extensions.Logging;

namespace Shop.Loyalty;

public interface ILoyaltyApi
{
    Task<int> GetPointsAsync(int customerId, CancellationToken ct = default);

    Task<IReadOnlyDictionary<int, int>> GetPointsBatchAsync(
        IReadOnlyCollection<int> customerIds, CancellationToken ct = default);
}

public sealed class SimulatedLoyaltyApi(ILogger<SimulatedLoyaltyApi> logger) : ILoyaltyApi
{
    public const int RoundTripMs = 200;

    public async Task<int> GetPointsAsync(int customerId, CancellationToken ct = default)
    {
        logger.LogInformation("Round-trip do usługi lojalnościowej: klient {CustomerId}", customerId);
        await Task.Delay(RoundTripMs, ct);
        return customerId * 10;
    }

    public async Task<IReadOnlyDictionary<int, int>> GetPointsBatchAsync(
        IReadOnlyCollection<int> customerIds, CancellationToken ct = default)
    {
        var ids = customerIds.Distinct().ToList();
        logger.LogInformation("Round-trip wsadowy do usługi lojalnościowej: {Count} klientów", ids.Count);
        await Task.Delay(RoundTripMs, ct);
        return ids.ToDictionary(id => id, id => id * 10);
    }
}
