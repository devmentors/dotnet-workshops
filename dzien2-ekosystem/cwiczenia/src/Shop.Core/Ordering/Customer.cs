namespace Shop.Core.Ordering;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

public class ProcessedOrder
{
    public int Id { get; set; }
    public int OrderId { get; set; }
}
