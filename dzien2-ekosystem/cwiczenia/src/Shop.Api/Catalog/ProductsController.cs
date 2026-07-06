using Microsoft.AspNetCore.Mvc;
using Shop.Core.Persistence;

namespace Shop.Api.Catalog;

// Kontroler MVC — kontrast dla Minimal API (ControllerBase + atrybuty, /mvc).
[ApiController]
[Route("mvc/products")]
public class ProductsController : ControllerBase
{
    private readonly ShopContext _db;

    public ProductsController(ShopContext db) => _db = db;

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var product = await _db.Products.FindAsync(id);
        return product is null ? NotFound() : Ok(product);
    }
}
