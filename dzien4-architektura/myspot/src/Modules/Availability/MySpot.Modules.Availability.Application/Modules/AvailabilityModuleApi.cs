using System.Threading.Tasks;
using MySpot.Modules.Availability.Application.Commands;
using MySpot.Modules.Availability.Shared;
using MySpot.Modules.Availability.Shared.DTO;
using MySpot.Shared.Abstractions.Dispatchers;

namespace MySpot.Modules.Availability.Application.Modules;

// TODO: Zadanie 4 - Zaimplementuj współdzielony kontrakt modułu Availability
//
// Inne moduły nie widzą wnętrza Availability. Widzą tylko publiczny interfejs
// IAvailabilityModuleApi i DTO z paczki MySpot.Modules.Availability.Shared.
// Implementacja kontraktu żyje tutaj, w warstwie Application, i jest internal:
// granicę modułu wyznaczają modyfikatory dostępności.
//
// Wymagania:
// 1. Klasa: internal sealed class AvailabilityModuleApi : IAvailabilityModuleApi.
// 2. Wstrzyknij IDispatcher przez konstruktor.
// 3. W AddResourceAsync przetłumacz AddResourceDto na wewnętrzną komendę AddResource
//    (ResourceId, Capacity, Tags) i wyślij ją przez _dispatcher.SendAsync(...).
// 4. Odkomentuj rejestrację w Extensions.cs tego projektu (AddApplication).
