using Packable;
using Xunit;

namespace Exercises.Tests._06_NUGET;

public class PackableConsumerTests
{
    [Fact]
    public void slugify_turns_text_into_url_slug()
    {
        var slug = SlugGenerator.Slugify("Hello, World!");

        Assert.Equal("hello-world", slug);
    }

    [Fact]
    public void parse_reads_semver_into_value_record()
    {
        var parsed = SemanticVersion.Parse("1.2.3");

        Assert.Equal(new SemanticVersion(1, 2, 3), parsed);
    }

    [Fact]
    public void compare_orders_minor_numerically_not_lexically()
    {
        var older = SemanticVersion.Parse("1.2.0");
        var newer = SemanticVersion.Parse("1.10.0");

        Assert.True(older.CompareTo(newer) < 0);
    }
}
