using Shop.Core.Catalog;
using Shop.Core.Persistence;

namespace Shop.Api.Catalog;

public static class CatalogEndpoints
{
    public static void MapCatalog(this WebApplication app)
    {
        app.MapGet("/products/{id:int}", async (int id, ShopContext db) =>
            await db.Products.FindAsync(id) is { } product ? Results.Ok(product) : Results.NotFound());

        app.MapGet("/products", (ShopContext db) => ProductQueries.All(db));

        // ZADANIE (query): dostępne produkty — odpali Twój stub ProductQueries.Available.
        app.MapGet("/products/available", (ShopContext db) => ProductQueries.Available(db));

        // Wzór stronicowania: strona produktów + total (Skip/Take + Count).
        app.MapGet("/products/page", (ShopContext db, int page = 1, int limit = 5)
            => ProductQueries.Page(db, page, limit));

        // ZADANIE (ProductPagingTests): filtry + stronicowanie — odpali Twój stub ProductQueries.Browse.
        app.MapGet("/products/browse", (ShopContext db, string? name = null, decimal? minPrice = null, decimal? maxPrice = null, int page = 1, int limit = 20)
            => ProductQueries.Browse(db, name, minPrice, maxPrice, page, limit));

        // Wzór cache-aside (liczba produktów): CountAsync zapisuje klucz w cache.
        app.MapGet("/products/count", (CachedProductService cache) => cache.CountAsync());

        // ZADANIE (cache): cache-aside — odpali Twój stub CachedProductService.GetAsync.
        app.MapGet("/products/{id:int}/cached", (int id, CachedProductService cache) => cache.GetAsync(id));

        // ZADANIE (ProductEndpointTests): POST /products — zwaliduj wejście (400) i zapisz produkt do bazy (201).
        app.MapPost("/products", IResult (CreateProductRequest req, ShopContext db) =>
            throw new NotImplementedException("ZADANIE: zwaliduj wejście (400) i zapisz produkt przez SaveChangesAsync (201)."));

        app.MapPost("/products/{id:int}/price", async Task<IResult> (int id, UpdatePriceRequest req, ShopContext db) =>
        {
            var product = await db.Products.FindAsync(id);
            if (product is null)
                return Results.NotFound();

            product.Price = req.Price;
            await db.SaveChangesAsync();
            return Results.Ok(product);
        });
    }
}
