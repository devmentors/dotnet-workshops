using StackExchange.Redis;

namespace Shop.Loyalty;

public sealed class RedisPointsCache(IConnectionMultiplexer redis, ILoyaltyApi inner) : ILoyaltyApi
{
    private IDatabase Cache => redis.GetDatabase();

    public Task<int> GetPointsAsync(int customerId, CancellationToken ct = default) =>
        throw new NotImplementedException(
            "ĆW14: cache-aside — Cache.StringGetAsync(key); przy pudle inner.GetPointsAsync + Cache.StringSetAsync");

    public Task<IReadOnlyDictionary<int, int>> GetPointsBatchAsync(
        IReadOnlyCollection<int> customerIds, CancellationToken ct = default) =>
        inner.GetPointsBatchAsync(customerIds, ct);
}
