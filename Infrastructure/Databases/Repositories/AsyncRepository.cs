using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Databases
{
	public class AsyncRepository<Entity> : IAsyncRepository<Entity> where Entity : class
	{
		protected readonly DbContext _context;
		//protected readonly Lazy<IDatabaseCommand> _command;

		public AsyncRepository(DbContext context)
		{
			_context = context;
			//_command = new Lazy<IDatabaseCommand>(() => new DatabaseCommand(_context.Database.GetDbConnection()));
		}

		//public IDatabaseCommand Command => _command.Value;



		public async Task<Entity> CreateAsync(Entity entity, bool save = true, CancellationToken token = default)
		{
			await _context.Set<Entity>().AddAsync(entity, token);
			if (save)
			{
				await _context.SaveChangesAsync(token);
			}
			return entity;
		}

        public async Task UpdateAsync(Entity entity, bool saveChanges = true, CancellationToken token = default)
        {
            // Mark the main entity as modified
            _context.Entry(entity).State = EntityState.Modified;

            // Iterate through the related entities and mark them as modified
            foreach (var navigationEntry in _context.Entry(entity).Navigations)
            {
                if (navigationEntry.CurrentValue is IEnumerable<object> collection)
                {
                    foreach (var relatedEntity in collection)
                    {
                        _context.Entry(relatedEntity).State = EntityState.Modified;
                    }
                }
                else if (navigationEntry.CurrentValue is object relatedEntity)
                {
                    _context.Entry(relatedEntity).State = EntityState.Modified;
                }
            }

            // Save changes if required
            if (saveChanges)
            {
                await _context.SaveChangesAsync(token);
            }
        }


        public async Task DeleteAsync(Entity entity, bool saveChanges = true, CancellationToken token = default)
		{
			_context.Set<Entity>().Remove(entity);
			if (saveChanges)
			{
				await _context.SaveChangesAsync(token);
			}
		}


		public async Task<Entity?> GetAsync(int id, CancellationToken token = default)
		{
			var keyValues = new object[] { id };
			return await _context.Set<Entity>().FindAsync(keyValues, token);
		}


		public async Task<List<Entity>> ListAsync(ISpecification<Entity> spec, CancellationToken token = default)
		{
            var queryable = ApplySpecification(spec);
            return await queryable.ToListAsync(token);
		}

		public async Task<Entity?> FirstAsync(ISpecification<Entity> spec, CancellationToken token = default)
		{
			var list = await ListAsync(spec, token);
			return list.Count > 0 ? list[0] : null;
		}


		public async Task<IReadOnlyCollection<Entity>> CollectionAsync(CancellationToken token = default)
		{
			return await _context.Set<Entity>().ToListAsync(token);
		}

		public async Task<IReadOnlyCollection<Entity>> CollectionAsync(ISpecification<Entity> spec, CancellationToken token = default)
		{
			var specificationResult = ApplySpecification(spec);
			return await specificationResult.ToListAsync(token);
		}

		public async Task<int> CountAsync(ISpecification<Entity> spec, CancellationToken token = default)
		{
			var specificationResult = ApplySpecification(spec);
			return await specificationResult.CountAsync(token);
		}

		public async Task<bool> ContainsAsync(ISpecification<Entity> specification, CancellationToken token = default)
		{
			return await CountAsync(specification, token) > 0;
		}







		


        private IQueryable<T> ApplySpecification<T>(ISpecification<T> spec) where T : class
        {
            var query = _context.Set<T>().AsQueryable();

            if (spec.Criteria != null)
            {
                query = query.Where(spec.Criteria).DefaultIfEmpty();
            }

            foreach (var include in spec.Includes)
            {
                query = query.Include(include).DefaultIfEmpty();
            }

            foreach (var includeAggregate in spec.IncludeAggregates)
            {
                query = includeAggregate(query).DefaultIfEmpty();
            }

            // Apply ordering
            if (spec.OrderBy != null)
            {
                query = spec.OrderBy(query);
            }
            else if (spec.OrderByDescending != null)
            {
                query = spec.OrderByDescending(query);
            }

            return query;
        }




    }
}
