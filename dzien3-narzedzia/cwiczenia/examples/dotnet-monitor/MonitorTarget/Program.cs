using System.Runtime.CompilerServices;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddSimpleConsole(o => o.SingleLine = true);
builder.Services.AddHostedService<LoadGenerator>();

var app = builder.Build();

app.MapGet("/", () => new { status = "ok", pid = Environment.ProcessId, utc = DateTime.UtcNow });

app.MapGet("/burn", (int ms) =>
{
    var sw = System.Diagnostics.Stopwatch.StartNew();
    long hot = 0, reference = 0;
    while (sw.ElapsedMilliseconds < ms)
    {
        hot += HotPath();
        reference += Reference();
    }
    return new { burnedMs = sw.ElapsedMilliseconds, hot, reference };
});

var held = new List<byte[]>();
app.MapGet("/leak", (int mb) =>
{
    for (var i = 0; i < mb; i++) held.Add(new byte[1024 * 1024]);
    return new { heldMb = held.Count };
});

app.Logger.LogInformation("MonitorTarget wystartował. PID = {Pid}", Environment.ProcessId);
app.Run();

[MethodImpl(MethodImplOptions.NoInlining)]
static long HotPath()
{
    long acc = 0;
    for (long i = 0; i < 19_000_000; i++) acc += (i * i) & 0x3FF;
    return acc;
}

[MethodImpl(MethodImplOptions.NoInlining)]
static long Reference()
{
    long acc = 0;
    for (long i = 0; i < 1_000_000; i++) acc += (i * i) & 0x3FF;
    return acc;
}

sealed class LoadGenerator(ILogger<LoadGenerator> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        var rounds = 0;
        while (!ct.IsCancellationRequested)
        {
            long acc = 0;
            for (var i = 0; i < 200; i++) acc += Fib(24);
            _ = new byte[256 * 1024];
            if (++rounds % 20 == 0)
                logger.LogInformation("Runda {Round}: acc={Acc}", rounds, acc);
            await Task.Delay(150, ct);
        }
    }

    static long Fib(int n) => n < 2 ? n : Fib(n - 1) + Fib(n - 2);
}
