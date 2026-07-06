using Microsoft.EntityFrameworkCore;
using Shop.Core.Persistence;

namespace Shop.Api.Infrastructure;

// Ciężki raport (/orders-report) generowany cyklicznie w tle, żeby nie obciążać żądań.
// Worker to singleton, a ShopContext jest scoped → bierzemy go przez własny scope.
public class GenerateReportWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopes;
    private readonly ILogger<GenerateReportWorker> _log;

    public GenerateReportWorker(IServiceScopeFactory scopes, ILogger<GenerateReportWorker> log)
    {
        _scopes = scopes;
        _log = log;
    }

    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        while (!stop.IsCancellationRequested)
        {
            using (var scope = _scopes.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ShopContext>();
                var report = await db.Orders
                    .Select(o => new { o.Id, Customer = o.Customer!.Name })
                    .ToListAsync(stop);
                _log.LogInformation("Raport zamówień wygenerowany w tle: {Count} pozycji.", report.Count);
            }

            try { await Task.Delay(TimeSpan.FromSeconds(30), stop); }
            catch (OperationCanceledException) { break; }
        }
    }
}
