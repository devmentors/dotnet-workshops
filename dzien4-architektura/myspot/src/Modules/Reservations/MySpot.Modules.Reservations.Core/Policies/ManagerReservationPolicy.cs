using MySpot.Modules.Reservations.Core.Entities;
using MySpot.Modules.Reservations.Core.ValueObjects;

namespace MySpot.Modules.Reservations.Core.Policies;

// TODO: Zadanie 3 - Zaimplementuj politykę rezerwacji dla managera
//
// Reguła biznesowa jest osobnym typem: każda implementacja IReservationPolicy odpowiada
// jednemu stanowisku i mówi, ile rezerwacji w tygodniu wolno mieć pracownikowi.
// Domena wybiera politykę po jobTitle (CanBeApplied) i pyta ją o zgodę (CanReserve).
//
// Wymagania:
// 1. Klasa: internal sealed class ManagerReservationPolicy : IReservationPolicy.
// 2. CanBeApplied zwraca true dla jobTitle równego JobTitle.Manager.
// 3. CanReserve pozwala managerowi mieć maksymalnie 4 rezerwacje
//    (policz elementy kolekcji reservations i porównaj z limitem).
//
// Wskazówka: zobacz BossReservationPolicy i RegularEmployeeReservationPolicy w tym folderze.
