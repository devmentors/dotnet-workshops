using System.Net;
using System.Text;

namespace AiLab.Tests;

// Zliczający fake domenowego API (Calls) — podmieniany jako handler TicketsApiClient.
internal sealed class StubHttpMessageHandler : HttpMessageHandler
{
    private readonly Func<HttpRequestMessage, (HttpStatusCode, string)> _responder;

    public int Calls { get; private set; }
    public List<string> Paths { get; } = [];
    public List<string?> UserIds { get; } = [];

    public StubHttpMessageHandler(Func<HttpRequestMessage, (HttpStatusCode, string)> responder)
        => _responder = responder;

    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken cancellationToken)
    {
        Calls++;
        Paths.Add(request.RequestUri?.PathAndQuery ?? "");
        UserIds.Add(request.Headers.TryGetValues("X-User-Id", out var v) ? v.FirstOrDefault() : null);

        var (code, body) = _responder(request);
        return Task.FromResult(new HttpResponseMessage(code)
        {
            Content = new StringContent(body, Encoding.UTF8, "application/json"),
        });
    }
}
