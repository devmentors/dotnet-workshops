namespace Exercises.Encapsulation;

// =====================================================================
// ZADANIE (05_encapsulation) - Karta prepaid kawiarni „Ziarno"
// =====================================================================
//
// KONTEKST:
//   Kawiarnia „Ziarno" wprowadza karty przedpłacone: klient doładowuje
//   kartę, a potem płaci nią przy kasie. Stan karty musi być nie do
//   popsucia: nikt z zewnątrz nie może wpisać salda ręcznie, saldo nie
//   może zejść poniżej zera, a imię właściciela ma być zawsze przycięte
//   i niepuste. To materiał tej sekcji: właściwość jako punkt kontroli
//   i metody pilnujące inwariantów.
//
// ZADANIE (całe deklaracje piszesz sam - poniżej jest tylko TODO):
//   1) Napisz właściwość Owner (string) z jawnym set: przytnij wartość
//      (Trim), a pustą lub złożoną z białych znaków odrzuć wyjątkiem
//      ArgumentException. Magazyn trzymaj w słowie kluczowym `field` (C# 14).
//   2) Napisz właściwość Balance (decimal) z prywatnym set: odczyt
//      publiczny, zmiana wyłącznie metodami karty.
//   3) Napisz metodę TopUp(decimal amount): kwota <= 0 -> rzuć
//      ArgumentOutOfRangeException; poprawną dolicz do salda.
//   4) Napisz metodę Pay(decimal amount): kwota <= 0 -> rzuć
//      ArgumentOutOfRangeException; kwota wyższa niż saldo -> rzuć
//      InvalidOperationException; poprawną odejmij od salda.
//
// OCZEKIWANY REZULTAT:
//   Karta po doładowaniu 50 zł i zapłacie 12.50 zł pokazuje 37.50 zł,
//   " Darek " zapisuje się jako "Darek", a każda próba zepsucia stanu
//   (ujemna kwota, płatność ponad saldo, saldo wpisane z zewnątrz)
//   kończy się wyjątkiem.

public class PrepaidCard
{
    // TODO: napisz tutaj właściwości Owner i Balance oraz metody TopUp i Pay.
}
