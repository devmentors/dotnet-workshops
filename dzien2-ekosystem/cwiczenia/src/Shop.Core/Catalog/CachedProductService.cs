using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Shop.Core.Persistence;

namespace Shop.Core.Catalog;

public interface IProductSource
{
    Task<Product?> Load(int id);
    Task<int> Count();
}

// Singleton sięga po scoped ShopContext przez własny scope — bez captive dependency.
public class DefaultProductSource : IProductSource
{
    private readonly IServiceScopeFactory _scopes;

    public DefaultProductSource(IServiceScopeFactory scopes) => _scopes = scopes;

    public async Task<Product?> Load(int id)
    {
        using var scope = _scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShopContext>();
        return await db.Products.FindAsync(id);
    }

    public async Task<int> Count()
    {
        using var scope = _scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShopContext>();
        return await db.Products.CountAsync();
    }
}

public class CachedProductService
{
    private readonly IDistributedCache _cache;
    private readonly IProductSource _source;

    public CachedProductService(IDistributedCache cache, IProductSource source)
    {
        _cache = cache;
        _source = source;
    }

    // Cache-aside na IDistributedCache
    public async Task<int> CountAsync()
    {
        var cached = await _cache.GetStringAsync("catalog:count");
        if (int.TryParse(cached, out var n))
            return n;

        var count = await _source.Count();
        await _cache.SetStringAsync("catalog:count", count.ToString(),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
        return count;
    }

    // ZADANIE: GetAsync — ręczny cache-aside dla produktu, unikalny klucz per Id,
    // Load woływane raz przy chybieniu. RED: stub rzuca.
    public Task<Product?> GetAsync(int id)
    {
        // TODO: zaimplementuj cache-aside dla produktu.
        throw new NotImplementedException("Zaimplementuj GetAsync: ręczny cache-aside na IDistributedCache (GetString -> null -> Load -> serializacja -> SetString), unikalny klucz per Id.");
    }
}
