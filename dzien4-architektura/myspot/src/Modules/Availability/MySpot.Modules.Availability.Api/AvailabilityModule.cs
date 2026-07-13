using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySpot.Modules.Availability.Application;
using MySpot.Modules.Availability.Application.Commands;
using MySpot.Modules.Availability.Infrastructure;
using MySpot.Shared.Abstractions.Dispatchers;
using MySpot.Shared.Abstractions.Modules;
using MySpot.Shared.Infrastructure.Modules;

namespace MySpot.Modules.Availability.Api;

// TODO: Zadanie 1 - Zaimplementuj IModule dla modułu Availability
//
// Host nie zna modułów po nazwie klasy: ModuleLoader odnajduje wszystkie implementacje IModule
// przez refleksję i woła ich Register/Use/Expose. Dopóki ta klasa nie istnieje, moduł Availability
// nie jest częścią aplikacji.
//
// Wymagania:
// 1. Klasa: internal sealed class AvailabilityModule : IModule, właściwość Name = "Availability".
// 2. W Register zarejestruj warstwy modułu: services.AddApplication().AddInfrastructure(configuration).
// 3. W Use podepnij obsługę żądań modułu: app.UseModuleRequests()
//    .Subscribe<AddResource>("availability/resources/add", ...) delegując do IDispatcher.SendAsync.
// 4. Expose może zostać puste.
//
// Wskazówka: wzoruj się na innych modułach (ParkingSpotsModule, UsersModule).
