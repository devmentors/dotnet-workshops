namespace Shop.Catalog;

public sealed class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public bool Available { get; set; }
}

public record CreateProductRequest(string Name, decimal Price);

public sealed class ProductService
{
    private readonly Dictionary<int, Product> _store = new()
    {
        [1] = new Product { Id = 1, Name = "Książka o .NET", Price = 49.99m, Available = true },
    };

    private int _nextId = 2;

    public Product? Find(int id)
        => _store.TryGetValue(id, out var product) ? product : null;

    public Product Add(string name, decimal price)
    {
        var product = new Product { Id = _nextId++, Name = name, Price = price, Available = true };
        _store[product.Id] = product;
        return product;
    }
}
