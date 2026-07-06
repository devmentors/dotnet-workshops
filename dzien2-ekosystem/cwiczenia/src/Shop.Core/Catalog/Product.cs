namespace Shop.Core.Catalog;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public bool Available { get; set; }
}

public record CreateProductRequest(string Name, decimal Price);

public record UpdatePriceRequest(decimal Price);
