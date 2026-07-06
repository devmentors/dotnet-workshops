using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Shop.Core.Persistence;

public class ShopContextFactory : IDesignTimeDbContextFactory<ShopContext>
{
    public ShopContext CreateDbContext(string[] args)
    {
        // Design-time (dotnet ef): generowanie migracji nie potrzebuje żywej bazy,
        // tylko providera. Ten sam Postgres co runtime (docker compose).
        var options = new DbContextOptionsBuilder<ShopContext>()
            .UseNpgsql("Host=localhost;Port=55432;Database=Shop;Username=postgres;Password=")
            .Options;
        return new ShopContext(options);
    }
}
