using Microsoft.EntityFrameworkCore;
using MySpot.Modules.Availability.Core.Entities;
using MySpot.Shared.Infrastructure.Messaging.Outbox;

namespace MySpot.Modules.Availability.Infrastructure.DAL;

internal class AvailabilityDbContext : DbContext
{
    public DbSet<InboxMessage> Inbox { get; set; }
    public DbSet<OutboxMessage> Outbox { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Resource> Resources { get; set; }
        
    public AvailabilityDbContext(DbContextOptions<AvailabilityDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("availability");
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}