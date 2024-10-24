using Domain.Interfaces;

namespace Domain.Services
{
	public class LaborService : Service, ILaborService
	{
		public LaborService(IDatabaseUnit unit, IDatabaseCommand command) : base(unit, command)
		{
		}
		public async Task<int> Create(string descr)
		{
			return await Create(new LaborView() { Descr = descr });
		}

		public async Task<int> Create(LaborView view)
		{
			view.Descr = view.Descr.ToUpper();
			Labor entity = new(view);
			await _database.Labor.CreateAsync(entity, default);
			return entity.Id;
		}

		public async Task<int> Update(LaborView view)
		{
			Labor entity = await EntityById(view.Id);
			entity.Change(view);
			await _database.Labor.UpdateAsync(entity, default);
			return entity.Id;
		}

		private async Task<Labor> EntityById(int id)
		{
			return await _database.Labor.GetAsync(id);
		}

		public async Task<LaborView> ViewById(int id)
		{
			return new LaborView(await EntityById(id));
		}

		public async Task<IReadOnlyCollection<LaborView>> Index()
		{
			var entities = await _database.Labor.CollectionAsync();
			List<LaborView> views = entities.Select(entity => new LaborView(entity)).ToList();
			return views;
		}
	}
}
