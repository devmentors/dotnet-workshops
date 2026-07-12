using Xunit;
using Greetings;

namespace Greetings.Tests;

public class GreeterTests
{
    [Fact]
    public void hello_zwraca_powitanie_z_imieniem()
    {
        var result = Greeter.Hello("Ada");

        Assert.Equal("Cześć, Ada!", result);
    }
}
