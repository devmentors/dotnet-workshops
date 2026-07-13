namespace MySpot.Modules.Availability.Shared.DTO;

public record AddResourceDto(Guid ResourceId, int Capacity, IEnumerable<string> Tags);
