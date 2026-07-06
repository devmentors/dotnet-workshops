using Shop.Core.Catalog;
using Shop.Core.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Exercises.Tests;

public class ProductQueryTests
{
    private static ShopContext NewContext()
    {
        var options = new DbContextOptionsBuilder<ShopContext>()
            .UseInMemoryDatabase($"products-{Guid.NewGuid():n}")
            .Options;
        return new ShopContext(options);
    }

    [Fact]
    public async Task returns_only_available_sorted_by_name()
    {
        await using var db = NewContext();
        db.Products.AddRange(
            new Product { Id = 1, Name = "Zeszyt", Price = 5m, Available = true },
            new Product { Id = 2, Name = "Atrament", Price = 9m, Available = true },
            new Product { Id = 3, Name = "Ołówek", Price = 2m, Available = false },
            new Product { Id = 4, Name = "Marker", Price = 7m, Available = true });
        await db.SaveChangesAsync();

        var result = await ProductQueries.Available(db);

        // Tylko dostępne (3 z 4), posortowane rosnąco po Name.
        Assert.Equal(new[] { "Atrament", "Marker", "Zeszyt" }, result.Select(p => p.Name).ToArray());
        Assert.DoesNotContain(result, p => p.Name == "Ołówek");
    }
}
