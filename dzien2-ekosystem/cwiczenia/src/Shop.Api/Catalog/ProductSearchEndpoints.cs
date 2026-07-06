using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shop.Core.Catalog;
using Shop.Core.Persistence;

namespace Shop.Api.Catalog;

// Model binding — [FromQuery], [FromServices].
public static class ProductSearchEndpoints
{
    public static void MapProductSearch(this WebApplication app)
    {
        app.MapGet("/products/search", async (
            [FromQuery] string name,
            [FromQuery] decimal? max,
            [FromServices] ShopContext db) =>
        {
            var query = db.Products.Where(p => p.Name.Contains(name));
            if (max is not null)
                query = query.Where(p => p.Price <= max);
            return await query.OrderBy(p => p.Name).ToListAsync();
        });
    }
}
