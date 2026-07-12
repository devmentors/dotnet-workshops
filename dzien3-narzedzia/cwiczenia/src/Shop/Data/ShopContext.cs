using Microsoft.EntityFrameworkCore;

namespace Shop.Data;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
}

public class AuditEntry
{
    public int Id { get; set; }
    public string CorrelationId { get; set; } = "";
    public string Action { get; set; } = "";
}

public class ShopContext : DbContext
{
    public ShopContext(DbContextOptions<ShopContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<AuditEntry> AuditEntries => Set<AuditEntry>();
}
