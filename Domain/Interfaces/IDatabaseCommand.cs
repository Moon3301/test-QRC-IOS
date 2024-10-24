using System.Data.Common;

namespace Domain
{
	public interface IDatabaseCommand
	{
        Task<DbCommand> Initialize(string procedure, object? parameters = null, Pagination? pages = null, CancellationToken token = default);
        Task ExecuteNonQuery(string procedure, object? parameters = null, CancellationToken token = default);
		Task<DbDataReader> ExecuteReader(string procedure, object? parameters = null, Pagination? pages = null, CancellationToken token = default);
		Task<object?> ExecuteScalar(string procedure, object? parameters = null, CancellationToken token = default);
        Task<IReadOnlyCollection<Item>> ReadCollection<Item>(string procedure, object? parameters = null, Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default) where Item : class, new();
        Task<Item> ReadItem<Item>(string procedure, object? parameters = null, Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default) where Item : class, new();
        Task<Item> ReadItem<Entity, Item>(int id, Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default) where Item : class, new();
		Task<PaginatedResult<Item>> ReadPage<Item>(string procedure, object? parameters = null, Pagination? pages = null, Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default);
        Task<PaginatedResult<Item>> ReadPage<Entity, Item>(object? parameters = null, Pagination? pages = null, Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default);

    }
}
