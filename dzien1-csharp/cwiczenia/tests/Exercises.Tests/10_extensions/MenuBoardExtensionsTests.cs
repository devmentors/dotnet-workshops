using Exercises.Extensions;
using Xunit;

namespace Exercises.Tests.Extensions;

public class MenuBoardExtensionsTests
{
    [Fact]
    public void Shorten_keeps_a_text_that_fits()
    {
        Assert.Equal("Espresso", "Espresso".Shorten(12));
        Assert.Equal("Dokładnie12!", "Dokładnie12!".Shorten(12));
    }

    [Fact]
    public void Shorten_cuts_a_long_text_and_appends_an_ellipsis()
    {
        var result = "Sernik baskijski z konfiturą malinową".Shorten(12);

        Assert.Equal("Sernik bask…", result);
        Assert.Equal(12, result.Length);
    }

    [Fact]
    public void OrPlaceholder_substitutes_blank_text()
    {
        Assert.Equal("wkrótce", "".OrPlaceholder("wkrótce"));
        Assert.Equal("wkrótce", "   ".OrPlaceholder("wkrótce"));
    }

    [Fact]
    public void OrPlaceholder_keeps_real_text()
    {
        Assert.Equal("Kruche ciastka", "Kruche ciastka".OrPlaceholder("wkrótce"));
    }
}
