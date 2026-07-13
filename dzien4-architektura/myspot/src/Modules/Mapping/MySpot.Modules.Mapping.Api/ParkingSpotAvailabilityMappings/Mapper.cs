using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Commands;
using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Events;
using MySpot.Shared.Abstractions.Events;
using MySpot.Shared.Abstractions.Messaging;

namespace MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings;

// TODO: Zadanie 5 - Zaimplementuj Mapper dla asynchronicznej komunikacji sterowanej zdarzeniami
//
// Ta klasa jest warstwą tłumaczącą (anti-corruption) między modułami ParkingSpots i Availability.
// Zamiast bezpośredniego wywołania (ciasne sprzężenie) używamy zdarzeń:
//
// Przepływ: ParkingSpots -> publikuje event ParkingSpotCreated -> Mapper go obsługuje
//           -> publikuje komendę AddResource -> Availability
//
// Wymagania:
// 1. Klasa implementuje IEventHandler<ParkingSpotCreated> oraz IEventHandler<ParkingSpotDeleted>.
// 2. Wstrzyknij IMessageBroker przez konstruktor.
// 3. W HandleAsync(ParkingSpotCreated):
//    - utwórz komendę AddResource: ResourceId = event.ParkingSpotId, Capacity = 2, Tags = ["parking_spot"],
//    - opublikuj ją przez _messageBroker.PublishAsync(...).
// 4. W HandleAsync(ParkingSpotDeleted):
//    - utwórz komendę DeleteResource: ResourceId = event.ParkingSpotId,
//    - opublikuj ją przez _messageBroker.PublishAsync(...).
//
// Wskazówka: komendy (AddResource, DeleteResource) i eventy (ParkingSpotCreated, ParkingSpotDeleted)
// są już zdefiniowane w folderze ParkingSpotAvailabilityMappings tego modułu.
