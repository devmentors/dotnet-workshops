using Shop.Core.Catalog;
using Shop.Core.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Exercises.Tests;

public class ProductPagingTests
{
    private static ShopContext NewContext()
    {
        var options = new DbContextOptionsBuilder<ShopContext>()
            .UseInMemoryDatabase($"paging-{Guid.NewGuid():n}")
            .Options;
        return new ShopContext(options);
    }

    // Nazwy bez znaków diakrytycznych → deterministyczny sort alfabetyczny na InMemory.
    private static async Task<ShopContext> Seeded()
    {
        var db = NewContext();
        db.Products.AddRange(
            new Product { Id = 1, Name = "Atrament", Price = 9m,  Available = true },
            new Product { Id = 2, Name = "Blok",     Price = 12m, Available = true },
            new Product { Id = 3, Name = "Cyrkiel",  Price = 3m,  Available = true },
            new Product { Id = 4, Name = "Dlugopis", Price = 4m,  Available = true },
            new Product { Id = 5, Name = "Ekierka",  Price = 7m,  Available = true },
            new Product { Id = 6, Name = "Farby",    Price = 2m,  Available = true },
            new Product { Id = 7, Name = "Gumka",    Price = 5m,  Available = true });
        await db.SaveChangesAsync();
        return db;
    }

    [Fact]
    public async Task first_page_is_sorted_and_total_counts_all_matches()
    {
        await using var db = await Seeded();

        var result = await ProductQueries.Browse(db, name: null, minPrice: null, maxPrice: null, page: 1, limit: 3);

        Assert.Equal(7, result.TotalCount);   // total = wszystkie pasujące, nie rozmiar strony
        Assert.Equal(new[] { "Atrament", "Blok", "Cyrkiel" }, result.Items.Select(p => p.Name).ToArray());
    }

    [Fact]
    public async Task second_page_continues_where_first_ended()
    {
        await using var db = await Seeded();

        var result = await ProductQueries.Browse(db, null, null, null, page: 2, limit: 3);

        Assert.Equal(new[] { "Dlugopis", "Ekierka", "Farby" }, result.Items.Select(p => p.Name).ToArray());
    }

    [Fact]
    public async Task filters_by_max_price_before_paging()
    {
        await using var db = await Seeded();
        
        var result = await ProductQueries.Browse(db, name: null, minPrice: null, maxPrice: 5m, page: 1, limit: 10);

        Assert.Equal(4, result.TotalCount);
        Assert.All(result.Items, p => Assert.True(p.Price <= 5m));
    }

    [Fact]
    public async Task filters_by_name_substring()
    {
        await using var db = await Seeded();

        var result = await ProductQueries.Browse(db, name: "Blok", minPrice: null, maxPrice: null, page: 1, limit: 10);

        Assert.Equal(1, result.TotalCount);
        Assert.Equal("Blok", Assert.Single(result.Items).Name);
    }
}
