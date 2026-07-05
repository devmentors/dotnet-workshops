using Exercises.Linq;
using Xunit;

namespace Exercises.Tests.Linq;

public class SalesReportTests
{
    private static readonly OrderLine[] Day =
    [
        new("Latte", 13m, 10),       // utarg 130
        new("Espresso", 9m, 20),     // utarg 180
        new("Sernik", 12.50m, 6),    // utarg 75
        new("Herbata", 8m, 0),       // niesprzedana - ma wypaść
    ];

    [Fact]
    public void BestSellers_skips_lines_with_no_sales()
    {
        var report = SalesReport.BestSellers(Day).ToArray();

        Assert.DoesNotContain(report, p => p.Product == "Herbata");
        Assert.Equal(3, report.Length);
    }

    [Fact]
    public void BestSellers_orders_by_revenue_descending()
    {
        var names = SalesReport.BestSellers(Day).Select(p => p.Product).ToArray();

        Assert.Equal(["Espresso", "Latte", "Sernik"], names);
    }

    [Fact]
    public void BestSellers_projects_each_line_to_a_ProductSummary_with_revenue()
    {
        var top = SalesReport.BestSellers(Day).First();

        Assert.Equal("Espresso", top.Product);
        Assert.Equal(180m, top.Revenue);
    }
}
