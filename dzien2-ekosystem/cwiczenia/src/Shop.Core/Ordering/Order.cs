namespace Shop.Core.Ordering;

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<OrderLine> Lines { get; set; } = new List<OrderLine>();
}

public class OrderLine
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
