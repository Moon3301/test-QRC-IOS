
namespace Domain.Interfaces
{
	public interface ICategoryService
	{
		Task<IReadOnlyCollection<CategoryView>> Index(int organization);
		Task<int> Create(CategoryView view);
		Task<int> Create(string descr);
		Task<int> Update(CategoryView view);
		Task<IReadOnlyCollection<LaborView>> LaborCollection(int categoryId);
		Task LaborUpdate(int id, int categoryId = 0, int laborId = 0, int sort = 0);
		Task<IReadOnlyCollection<MeasurementView>> StepCollection(int categoryId);
		Task StepUpdate(int id, int categoryId = 0, int stepId = 0, int sort = 0);
		Task<IReadOnlyCollection<MeasurementView>> PartCollection(int categoryId);
		Task PartUpdate(int id, int categoryId = 0, int laborId = 0, int sort = 0);
		Task<CategoryView> ViewById(int id);
        Task<IEnumerable<AutocompleteItem>> Autocomplete(string search, CancellationToken token);
    }
}