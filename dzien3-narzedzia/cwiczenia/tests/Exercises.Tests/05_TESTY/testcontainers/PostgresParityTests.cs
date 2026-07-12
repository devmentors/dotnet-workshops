using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shop.Data;
using Testcontainers.PostgreSql;
using Xunit;

namespace Exercises.Tests._05_TESTY.testcontainers;

public class PostgresParityTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder().Build();
    private WebApplicationFactory<Program> _app = null!;

    public async Task InitializeAsync()
    {
        await _container.StartAsync();

        _app = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<DbContextOptions<ShopContext>>();
                services.RemoveAll<ShopContext>();
                services.AddDbContext<ShopContext>(options =>
                    options.UseNpgsql(_container.GetConnectionString()));
            });
        });
    }

    public async Task DisposeAsync()
    {
        await _app.DisposeAsync();
        await _container.DisposeAsync().AsTask();
    }

    [Fact]
    public async Task the_whole_app_runs_against_real_postgres_in_the_container()
    {
        var client = _app.CreateClient();

        var response = await client.GetAsync("/orders-report");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task real_postgres_enforces_relational_rules_that_inmemory_ignores()
    {
        using var scope = _app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ShopContext>();

        context.Orders.Add(new Order { CustomerId = 999 });

        await Assert.ThrowsAnyAsync<DbUpdateException>(() => context.SaveChangesAsync());
    }
}
