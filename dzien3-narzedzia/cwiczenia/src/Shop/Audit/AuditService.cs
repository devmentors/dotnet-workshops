using Microsoft.EntityFrameworkCore;
using Shop.Correlation;
using Shop.Data;

namespace Shop.Audit;

public sealed class AuditService(CorrelationAccessor correlation, ShopContext db)
{
    private string CorrelationId => correlation.CorrelationId;
    private DbSet<AuditEntry> Entries => db.AuditEntries;

    public Task<AuditEntry> RecordAsync(string action) =>
        throw new NotImplementedException(
            "ĆW1: zbuduj AuditEntry z CorrelationId (z CorrelationAccessor) + action, dodaj do Entries i SaveChangesAsync");
}
