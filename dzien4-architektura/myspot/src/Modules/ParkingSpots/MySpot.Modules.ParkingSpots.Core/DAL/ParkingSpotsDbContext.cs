using Microsoft.EntityFrameworkCore;
using MySpot.Modules.ParkingSpots.Core.Entities;
using MySpot.Shared.Infrastructure.Messaging.Outbox;

namespace MySpot.Modules.ParkingSpots.Core.DAL;

internal class ParkingSpotsDbContext : DbContext
{
    public DbSet<InboxMessage> Inbox { get; set; }
    public DbSet<OutboxMessage> Outbox { get; set; }
    public DbSet<ParkingSpot> ParkingSpots { get; set; }
        
    public ParkingSpotsDbContext(DbContextOptions<ParkingSpotsDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("parking_spots");
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}