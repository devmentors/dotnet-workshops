namespace Shop.Core.Persistence;

public record PagedResult<T>(IReadOnlyList<T> Items, int TotalCount, int Page, int Limit);
