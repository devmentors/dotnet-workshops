using Xunit;

namespace Exercises.Tests._05_TESTY.testcontainers;

public class RedisPointsCacheTests
{
    [Fact(Skip = "Wymaga Dockera: napisz test round-trip cache-aside z Redisem w Testcontainers")]
    public void second_call_for_same_customer_is_served_from_redis_not_the_slow_api()
    {
        Assert.Fail(
            "ĆW14: podnieś RedisBuilder().Build(), połącz ConnectionMultiplexer, podstaw atrapę pod inner ILoyaltyApi i udowodnij, że drugie wywołanie GetPointsAsync nie dotyka inner");
    }
}
