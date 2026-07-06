using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shop.Core.Catalog;

namespace Shop.Core.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> product)
    {
        product.Property(p => p.Name).IsRequired().HasMaxLength(200);
        product.Property(p => p.Price).HasPrecision(18, 2);
        product.HasIndex(p => p.Name);
    }
}
