using Shop.Core.Persistence;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Testcontainers.PostgreSql;
using Xunit;

namespace Exercises.Tests;

public class MigrationsTests
{
    [Fact(Skip = "Ćwiczenie OPCJONALNE - usuń Skip, żeby je aktywować (wymaga Dockera; patrz README: Migracje EF Core).")]
    public async Task migracja_dodaje_kolumne_sku_do_tabeli_products()
    {
        // Jednorazowy Postgres w kontenerze (izolowany, sprzątany po teście).
        await using var postgres = new PostgreSqlBuilder()
            .WithImage("postgres:16")
            .Build();
        await postgres.StartAsync();

        var options = new DbContextOptionsBuilder<ShopContext>()
            .UseNpgsql(postgres.GetConnectionString())
            .Options;

        await using (var db = new ShopContext(options))
            await db.Database.MigrateAsync();

        // Odczyt kolumn tabeli Products wprost ze schematu (information_schema).
        await using var conn = new NpgsqlConnection(postgres.GetConnectionString());
        await conn.OpenAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT column_name FROM information_schema.columns WHERE table_name = 'Products';";
        var columns = new List<string>();
        await using (var reader = await cmd.ExecuteReaderAsync())
            while (await reader.ReadAsync())
                columns.Add(reader.GetString(0));

        Assert.Contains("Sku", columns);
    }
}
