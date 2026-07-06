using Microsoft.EntityFrameworkCore;
using Shop.Core.Ordering;
using Shop.Core.Persistence;

namespace Shop.Api.Ordering;

// ZADANIE (OrderQueueTests): worker w tle (BackgroundService).
// Konsumuj OrderQueue, zrób follow-up i zapisz ProcessedOrder IDEMPOTENTNIE (at-least-once). Wzór: GenerateReportWorker.
// Cel: imitujemy offloading z watku HTTP na bg thread
public class QueueWorker : BackgroundService
{
    private readonly OrderQueue _queue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<QueueWorker> _logger;

    public QueueWorker(OrderQueue queue, IServiceScopeFactory scopeFactory, ILogger<QueueWorker> logger)
    {
        _queue = queue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // TODO: konsumuj OrderQueue; dla każdego NOWEGO zamówienia zrób follow-up
        //       (_logger.LogInformation(...)) i zapisz ProcessedOrder idempotentnie.
        return Task.CompletedTask;
    }
}
