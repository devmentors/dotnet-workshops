using MySpot.Modules.Availability.Shared.DTO;

namespace MySpot.Modules.Availability.Shared;

public interface IAvailabilityModuleApi
{
    Task AddResourceAsync(AddResourceDto dto);
}
