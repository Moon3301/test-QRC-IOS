using Domain.Interfaces;

namespace Domain.Services
{
	public class CategoryService(IDatabaseUnit unit, IDatabaseCommand command) : Service(unit, command), ICategoryService
	{
        public async Task<IEnumerable<AutocompleteItem>> Autocomplete(string search, CancellationToken token)
        {
            var result = new List<AutocompleteItem>();
            using var reader = await _command.ExecuteReader("CategoryAutocomplete", new { search }, null, token);
            while (await reader.ReadAsync(token))
            {
                var item = new AutocompleteItem()
                {
                    Id = reader.ReadString("Id"),
                    Title = reader.ReadString("Descr"),
                };
                result.Add(item);
            }
            return result;
        }
        public async Task<int> Create(string descr)
		{
			return await Create(new CategoryView() { Descr = descr });
		}

		public async Task<int> Create(CategoryView view)
		{
			view.Descr = view.Descr.ToUpper();
			Category entity = new(view);
			await _database.Category.CreateAsync(entity, default);
			return entity.Id;
		}

		public async Task<int> Update(CategoryView view)
		{
			view.Descr = view.Descr.ToUpper();
			Category entity = await EntityById(view.Id);
			entity.Change(view);
			await _database.Category.UpdateAsync(entity, default);
			return entity.Id;
		}

		private async Task<Category> EntityById(int id)
		{
			return await _database.Category.GetAsync(id);
		}

		public async Task<CategoryView> ViewById(int id)
		{
			return new CategoryView(await EntityById(id));
		}

		public async Task<IReadOnlyCollection<CategoryView>> Index(int organization = 0)
		{
			return await _command.ReadCollection<CategoryView>("CategoryCollection", new { organization });
		}

		
		public async Task<IReadOnlyCollection<LaborView>> LaborCollection(int categoryId)
		{
			var parameters = new { categoryId };
			return await _command.ReadCollection<LaborView>("CategoryLaborCollection", parameters);
		}

		public async Task LaborUpdate(int id, int categoryId = 0, int laborId = 0, int sort = 0)
		{
			var parameters = new { id, categoryId, laborId, sort };
			await _command.ExecuteNonQuery("CategoryLaborUpdate", parameters);
		}


		public async Task<IReadOnlyCollection<MeasurementView>> PartCollection(int categoryId)
		{
			List<MeasurementView> measurements = new();
			var parameters = new { categoryId };
			var reader = await _command.ExecuteReader("CategoryPartCollection", parameters);

			using (reader)
			{
				MeasurementView currentMeasurement = null;

				while (reader.Read())
				{
					int id = reader.GetInt32(0);
					string descr = reader.GetString(1);

					if (currentMeasurement == null || currentMeasurement.Id != id)
					{
						currentMeasurement = new MeasurementView
						{
							Id = id,
							Descr = descr,
							Parts = new List<MeasurementPartView>()
						};
						measurements.Add(currentMeasurement);
					}
					currentMeasurement.Parts.Add(new MeasurementPartView
					{
						Id = reader.GetInt32(2),
						Descr = reader.GetString(4),
					});
				}
			}

			return measurements;
		}


		public async Task PartUpdate(int id, int categoryId = 0, int partId = 0, int sort = 0)
		{
			var parameters = new { id, categoryId, partId, sort };
			await _command.ExecuteNonQuery("CategoryPartUpdate", parameters);
		}


		public async Task<IReadOnlyCollection<MeasurementView>> StepCollection(int categoryId)
		{
			List<MeasurementView> measurements = new();
			var parameters = new { categoryId };
			var reader = await _command.ExecuteReader("CategoryStepCollection", parameters);

			using (reader)
			{
				MeasurementView currentMeasurement = null;

				while (reader.Read())
				{
					int id = reader.GetInt32(0);
					string descr = reader.GetString(1);

					if (currentMeasurement == null || currentMeasurement.Id != id)
					{
						currentMeasurement = new MeasurementView
						{
							Id = id,
							Descr = descr,
							Steps = new List<MeasurementStepView>()
						};
						measurements.Add(currentMeasurement);
					}


						currentMeasurement.Steps.Add(new MeasurementStepView
						{
							Id = reader.GetInt32(2),
							Descr = reader.GetString(4),
						});
				}
			}

			return measurements;
		}

		public async Task StepUpdate(int id, int categoryId = 0, int stepId = 0, int sort = 0)
		{
			var parameters = new { id, categoryId, stepId, sort };
			await _command.ExecuteNonQuery("CategoryStepUpdate", parameters);
		}
	}
}
