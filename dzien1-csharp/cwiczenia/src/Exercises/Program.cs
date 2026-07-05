using Exercises.Types.Examples;
using Exercises.Null.Examples;
using Exercises.Encapsulation.Examples;
using Exercises.Immutability.Examples;
using Exercises.Delegates.Examples;
using Exercises.Match.Examples;
using Exercises.Generics.Examples;
using Exercises.Extensions.Examples;
using Exercises.Linq.Examples;
using Exercises.Async.Examples;

// Punkt wejścia aplikacji konsolowej Dnia 1 - prosty dispatcher do przykładów na żywo.
//
// Struktura każdej sekcji (numer folderu = numer sekcji na slajdach):
//   src/Exercises/0X_temat/
//     examples/    działające przykłady 1:1 ze slajdami (jedna klasa = jeden przykład)
//     exercises/   zadania RED -> GREEN (stuby weryfikowane przez `dotnet test`)
//
// Przykłady na żywo:   dotnet run --project src/Exercises -- 03
// Weryfikacja zadań:   dotnet test

if (args.Length == 0)
{
    Console.WriteLine(".NET 10 / C# 14 - Dzień 1: Idiomatyczny C#");
    Console.WriteLine();
    Console.WriteLine("Przykłady na żywo (examples danej sekcji):");
    Console.WriteLine("  dotnet run --project src/Exercises -- 03   # System typów");
    Console.WriteLine("  dotnet run --project src/Exercises -- 04   # null i wartości domyślne");
    Console.WriteLine("  dotnet run --project src/Exercises -- 05   # Hermetyzacja");
    Console.WriteLine("  dotnet run --project src/Exercises -- 06   # Niemutowalność (record)");
    Console.WriteLine("  dotnet run --project src/Exercises -- 07   # Generyki");
    Console.WriteLine("  dotnet run --project src/Exercises -- 08   # Pattern matching");
    Console.WriteLine("  dotnet run --project src/Exercises -- 09   # Delegaty, Func/Action");
    Console.WriteLine("  dotnet run --project src/Exercises -- 10   # Metody rozszerzające");
    Console.WriteLine("  dotnet run --project src/Exercises -- 11   # LINQ");
    Console.WriteLine("  dotnet run --project src/Exercises -- 12   # Asynchroniczność");
    Console.WriteLine();
    Console.WriteLine("Zadania rozwiązujesz w src/Exercises/0X_*/exercises/, a weryfikuje je:");
    Console.WriteLine("  dotnet test");
    return;
}

switch (args[0])
{
    case "03":
        ClassVsStructExample.Run();
        Console.WriteLine();
        VarInferenceExample.Run();
        Console.WriteLine();
        StaticPolymorphismExample.Run();
        break;
    case "04":
        DefaultValuesExample.Run();
        Console.WriteLine();
        NullOperatorsExample.Run();
        Console.WriteLine();
        NullableReferenceTypesExample.Run();
        break;
    case "05":
        FieldVsPropertyExample.Run();
        Console.WriteLine();
        AccessModifiersExample.Run();
        Console.WriteLine();
        PrimaryConstructorExample.Run();
        break;
    case "06":
        RecordVsClassExample.Run();
        Console.WriteLine();
        WithExpressionExample.Run();
        Console.WriteLine();
        DeconstructionExample.Run();
        break;
    case "07":
        GenericMethodsExample.Run();
        Console.WriteLine();
        ReifiedGenericsExample.Run();
        Console.WriteLine();
        GenericTypesExample.Run();
        Console.WriteLine();
        ConstraintsExample.Run();
        break;
    case "08":
        SwitchExpressionExample.Run();
        Console.WriteLine();
        PatternTypesExample.Run();
        Console.WriteLine();
        ExhaustivenessExample.Run();
        break;
    case "09":
        TargetTypingExample.Run();
        Console.WriteLine();
        FuncVsExpressionExample.Run();
        break;
    case "10":
        ExtensionMethodsExample.Run();
        Console.WriteLine();
        ExtensionMembersExample.Run();
        break;
    case "11":
        DeferredExecutionExample.Run();
        Console.WriteLine();
        YieldReturnExample.Run();
        Console.WriteLine();
        MultipleEnumerationExample.Run();
        Console.WriteLine();
        OperatorChainExample.Run();
        break;
    case "12":
        await ThreadHoppingExample.Run();
        Console.WriteLine();
        await WhenAllExample.Run();
        Console.WriteLine();
        await AsyncWithoutAwaitExample.Run();
        Console.WriteLine();
        await CancellationExample.Run();
        break;
    default:
        Console.WriteLine($"Nieznana sekcja '{args[0]}'. Dostępne: 03, 04, 05, 06, 07, 08, 09, 10, 11, 12.");
        break;
}
