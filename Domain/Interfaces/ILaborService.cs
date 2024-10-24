namespace Domain.Interfaces
{
	public interface ILaborService
	{
		Task<int> Create(LaborView view);
		Task<int> Create(string descr);
		Task<IReadOnlyCollection<LaborView>> Index();
		Task<int> Update(LaborView view);
		Task<LaborView> ViewById(int id);
	}
}