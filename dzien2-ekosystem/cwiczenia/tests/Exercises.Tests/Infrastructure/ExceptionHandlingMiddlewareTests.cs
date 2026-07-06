using System.Net;
using Xunit;

namespace Exercises.Tests;

public class ExceptionHandlingMiddlewareTests : IClassFixture<TestingWebAppFactory>
{
    private readonly TestingWebAppFactory _factory;

    public ExceptionHandlingMiddlewareTests(TestingWebAppFactory factory) => _factory = factory;

    [Fact]
    public async Task domain_exception_becomes_problem_details()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/demo/domain-error");

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);   // 409 z DomainException.StatusCode
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }
}
