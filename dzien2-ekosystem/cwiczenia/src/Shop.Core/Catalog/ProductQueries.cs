using Microsoft.EntityFrameworkCore;
using Shop.Core.Persistence;

namespace Shop.Core.Catalog;

public static class ProductQueries
{
    public static Task<List<Product>> All(ShopContext db)
        => db.Products
            .OrderBy(p => p.Name)
            .ToListAsync();

    // ZADANIE (ProductQueryTests): Available — dostępne produkty (Available == true), sort po nazwie;
    public static Task<List<Product>> Available(ShopContext db)
    {
        // TODO: zwróć dostępne produkty.
        throw new NotImplementedException("Zaimplementuj Available: dostępne produkty posortowane po nazwie.");
    }
    
    public static async Task<PagedResult<Product>> Page(ShopContext db, int page, int limit)
    {
        var query = db.Products.OrderBy(p => p.Name);
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();
        return new PagedResult<Product>(items, total, page, limit);
    }

    // ZADANIE (ProductPagingTests): Browse — filtry (nazwa zawiera, przedział ceny) + sort + stronicowanie → PagedResult.
    public static Task<PagedResult<Product>> Browse(
        ShopContext db, string? name, decimal? minPrice, decimal? maxPrice, int page, int limit)
    {
        // TODO: nałóż filtry (Where dla name/min/max, gdy podane), posortuj po nazwie,
        //       policz total (CountAsync), pobierz stronę (Skip/Take) i zwróć PagedResult. Wzoruj się na Page.
        throw new NotImplementedException("Zaimplementuj Browse: filtry + sort + stronicowanie → PagedResult.");
    }
}
