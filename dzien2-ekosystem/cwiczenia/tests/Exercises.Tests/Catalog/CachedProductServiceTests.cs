using Shop.Core.Catalog;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Xunit;

namespace Exercises.Tests;

public class CachedProductServiceTests
{
    private static IDistributedCache NewCache()
        => new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions()));

    private sealed class CountingSource : IProductSource
    {
        public int LoadCount { get; private set; }

        public Task<Product?> Load(int id)
        {
            LoadCount++;
            return Task.FromResult<Product?>(new Product { Id = id, Name = "Z cache", Price = 1m, Available = true });
        }

        public Task<int> Count() => Task.FromResult(1);
    }

    [Fact]
    public async Task second_get_serves_from_cache_and_hits_source_once()
    {
        var source = new CountingSource();
        var sut = new CachedProductService(NewCache(), source);

        var first = await sut.GetAsync(1);
        var second = await sut.GetAsync(1);

        Assert.Equal(1, source.LoadCount);
        Assert.NotNull(first);
        Assert.NotNull(second);
        Assert.Equal(1, first!.Id);
        Assert.Equal(first.Id, second!.Id);
    }

    // Klucz MUSI być unikalny per Id: inne Id to inny wpis, więc źródło musi być odpytane
    // ponownie. Wspólny/globalny klucz oddałby produkt nr 1 pod dwójką i utrwaliłby LoadCount==1.
    [Fact]
    public async Task different_id_is_a_separate_cache_entry_and_reloads_from_source()
    {
        var source = new CountingSource();
        var sut = new CachedProductService(NewCache(), source);

        var one = await sut.GetAsync(1);
        var two = await sut.GetAsync(2);

        Assert.Equal(2, source.LoadCount);
        Assert.NotNull(one);
        Assert.NotNull(two);
        Assert.Equal(1, one!.Id);
        Assert.Equal(2, two!.Id);
    }
}
