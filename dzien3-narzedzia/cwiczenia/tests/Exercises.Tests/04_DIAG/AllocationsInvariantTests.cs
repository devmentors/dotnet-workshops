using System.Text;
using Xunit;

namespace Exercises.Tests._04_DIAG;

public class AllocationsInvariantTests
{
    private static string BuildWithPlusEquals(int count)
    {
        var result = string.Empty;
        for (var i = 0; i < count; i++)
        {
            result += i;
        }

        return result;
    }

    private static string BuildWithStringBuilder(int count)
    {
        var builder = new StringBuilder();
        for (var i = 0; i < count; i++)
        {
            builder.Append(i);
        }

        return builder.ToString();
    }

    [Fact]
    public void plus_equals_and_string_builder_produce_identical_result()
    {
        const int count = 1000;

        var viaPlus = BuildWithPlusEquals(count);
        var viaBuilder = BuildWithStringBuilder(count);

        Assert.Equal(viaPlus, viaBuilder);
    }
}
