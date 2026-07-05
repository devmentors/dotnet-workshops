namespace Exercises.Types;

// =====================================================================
// ZADANIE (03_types) - Kasa kawiarni: operatory i przeciążenia
// =====================================================================
//
// KONTEKST:
//   Rozwijasz oprogramowanie kawiarni „Ziarno". Zaczynasz od kasy - barista
//   nabija produkty: czasem jeden ("sernik 12.50"), czasem kilka naraz
//   ("3 x espresso po 9.00").
//   Kasa sumuje wszystko w jednej walucie i trzyma wynik w Total. Kwoty
//   reprezentuje klasa Money - żeby kasa mogła liczyć, Money musi umieć się
//   dodawać i mnożyć przez liczbę sztuk. To materiał tej sekcji: przeciążanie
//   operatorów i metod (kompilator wybiera wariant po typach argumentów).
//
// ZADANIE (całe deklaracje piszesz sam - poniżej są tylko TODO):
//   1) Zadeklaruj operator + dla dwóch Money: nowy Money z sumą kwot;
//      przy różnych walutach rzuć InvalidOperationException.
//   2) Zadeklaruj operator * dla pary Money i int: nowy Money z kwotą
//      pomnożoną przez liczbę sztuk.
//   3) Napisz dwie metody Scan w CashRegister: Scan(price) dolicza cenę
//      do Total, Scan(price, quantity) dolicza cenę razy liczba sztuk.
//      W obu użyj swoich operatorów z punktów 1 i 2.
//
// OCZEKIWANY REZULTAT:
//   Po nabiciu "3 x espresso po 9.00" i "sernik 12.50" kasa pokazuje
//   Total = 39.50 PLN, a mieszanie walut kończy się wyjątkiem.

public class Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    // TODO: zadeklaruj operator + (Money + Money).

    // TODO: zadeklaruj operator * (Money * int).
}

public class CashRegister
{
    public Money Total { get; set; }

    public CashRegister(string currency)
    {
        Total = new Money(0, currency);
    }

    // TODO: napisz dwie metody Scan (wariant bez ilości i z ilością).
}
