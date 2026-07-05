# 07_generics - Generyki (metody, typy, constrainty)

Cel sekcji: napisać logikę raz, dla wielu typów. Metoda generyczna z inference,
typ generyczny oraz constraint `where T`, który odblokowuje operacje na `T`.

## Zadanie (1 x ~10 min) - kawiarnia „Ziarno”
1. **Repozytorium encji** (`Repository.cs`, ~10 min): jedno `Repository<T>`
   dla różnych encji - Add/GetById/Count. Sedno: constraint
   `where T : class, IHasId`, bez którego `item.Id` się nie kompiluje.

## Jak odpalić
```bash
dotnet test --filter "FullyQualifiedName~Tests.Generics.RepositoryTests"
dotnet run --project src/Exercises -- 07
```
