using Exercises.Generics;
using Xunit;

namespace Exercises.Tests.Generics;

public class RepositoryTests
{
    [Fact]
    public void Add_increases_the_count()
    {
        var repo = new Repository<Product>();

        repo.Add(new Product(1, "Latte"));
        repo.Add(new Product(2, "Espresso"));

        Assert.Equal(2, repo.Count);
    }

    [Fact]
    public void GetById_returns_the_matching_entity()
    {
        var repo = new Repository<Product>();
        repo.Add(new Product(1, "Latte"));
        repo.Add(new Product(2, "Espresso"));

        Assert.Equal("Espresso", repo.GetById(2)?.Name);
    }

    [Fact]
    public void GetById_returns_null_when_nothing_matches()
    {
        var repo = new Repository<Product>();
        repo.Add(new Product(1, "Latte"));

        Assert.Null(repo.GetById(99));
    }

    [Fact]
    public void The_same_repository_class_works_for_another_entity_type()
    {
        var repo = new Repository<Customer>();
        repo.Add(new Customer(10, "Darek"));

        Assert.Equal("Darek", repo.GetById(10)?.Name);
    }
}
