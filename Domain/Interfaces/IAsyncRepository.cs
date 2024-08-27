namespace Domain
{
	public interface IAsyncRepository<Entity>
	{
		//IDatabaseCommand Command { get; }

		Task<Entity?> GetAsync(int id, CancellationToken token = default);
		Task<Entity?> FirstAsync(ISpecification<Entity> spec, CancellationToken token = default);
		Task<IReadOnlyCollection<Entity>> CollectionAsync(CancellationToken token = default);
		Task<IReadOnlyCollection<Entity>> CollectionAsync(ISpecification<Entity> spec, CancellationToken token = default);
		Task<int> CountAsync(ISpecification<Entity> spec, CancellationToken token = default);
		Task<bool> ContainsAsync(ISpecification<Entity> specification, CancellationToken token = default);
		Task<List<Entity>> ListAsync(ISpecification<Entity> specification, CancellationToken token = default);
		Task<Entity> CreateAsync(Entity entity, bool save = true, CancellationToken token = default);
		Task UpdateAsync(Entity entity, bool save = true, CancellationToken token = default);
		Task DeleteAsync(Entity entity, bool save = true, CancellationToken token = default);
	}
	
}
