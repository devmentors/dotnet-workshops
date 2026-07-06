using Microsoft.EntityFrameworkCore;
using Shop.Core.Catalog;
using Shop.Core.Ordering;
using Shop.Core.Persistence;

namespace Shop.Api.Utils;

public static class DemoData
{
    public static void Seed(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShopContext>();

        if (app.Environment.IsEnvironment("Testing"))
            db.Database.EnsureCreated();
        else
            db.Database.Migrate();

        if (!db.Products.Any())
        {
            db.Products.AddRange(
                new Product { Name = "Książka o .NET", Price = 49.99m, Available = true },
                new Product { Name = "Klawiatura mechaniczna", Price = 199.99m, Available = true },
                new Product { Name = "Mysz bezprzewodowa", Price = 89.00m, Available = true },
                new Product { Name = "Monitor 27 cali", Price = 899.00m, Available = true },
                new Product { Name = "Kabel USB-C", Price = 19.99m, Available = true },
                new Product { Name = "Laptop 14 cali", Price = 3499.00m, Available = true },
                new Product { Name = "Słuchawki ANC", Price = 249.00m, Available = false },
                new Product { Name = "Podkładka pod mysz", Price = 39.00m, Available = true },
                new Product { Name = "Kamera internetowa", Price = 159.00m, Available = false },
                new Product { Name = "Pendrive 64GB", Price = 29.99m, Available = true },
                new Product { Name = "Dysk SSD 1TB", Price = 349.00m, Available = true },
                new Product { Name = "Ładowarka 65W", Price = 59.00m, Available = true });
            db.SaveChanges();
        }

        if (!db.Customers.Any())
        {
            var p = db.Products.OrderBy(x => x.Id).ToList();
            var ada = new Customer { Name = "Ada" };
            var bartek = new Customer { Name = "Bartek" };
            var celina = new Customer { Name = "Celina" };
            var damian = new Customer { Name = "Damian" };
            var ewa = new Customer { Name = "Ewa" };
            db.Customers.AddRange(ada, bartek, celina, damian, ewa);
            db.SaveChanges();

            db.Orders.AddRange(
                new Order { Customer = ada,    Lines = { new() { ProductId = p[0].Id, Quantity = 1 }, new() { ProductId = p[4].Id, Quantity = 2 } } },
                new Order { Customer = bartek, Lines = { new() { ProductId = p[1].Id, Quantity = 1 } } },
                new Order { Customer = ada,    Lines = { new() { ProductId = p[3].Id, Quantity = 1 }, new() { ProductId = p[9].Id, Quantity = 3 } } },
                new Order { Customer = celina, Lines = { new() { ProductId = p[5].Id, Quantity = 1 } } },
                new Order { Customer = damian, Lines = { new() { ProductId = p[2].Id, Quantity = 2 } } },
                new Order { Customer = ewa,    Lines = { new() { ProductId = p[10].Id, Quantity = 1 }, new() { ProductId = p[4].Id, Quantity = 4 } } },
                new Order { Customer = bartek, Lines = { new() { ProductId = p[7].Id, Quantity = 1 } } },
                new Order { Customer = ada,    Lines = { new() { ProductId = p[11].Id, Quantity = 2 } } },
                new Order { Customer = celina, Lines = { new() { ProductId = p[1].Id, Quantity = 1 }, new() { ProductId = p[2].Id, Quantity = 1 } } },
                new Order { Customer = damian, Lines = { new() { ProductId = p[3].Id, Quantity = 1 } } });
            db.SaveChanges();
        }
    }
}
