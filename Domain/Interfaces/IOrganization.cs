
namespace Domain.Interfaces
{
    public interface IOrganizationService
    {
        Task<IReadOnlyCollection<OrganizationView>> Buildings();
        Task<short> OrganizationCreate(string descr);
        Task<IReadOnlyCollection<OrganizationView>> Index(UserCredential credential);
        Task<IReadOnlyCollection<TowerView>> Towers();
        Task<short> BuildingCreate(string descr, short organizationId);
        Task<short> TowerCreate(string descr, short buildingId);
		Task<OrganizationView> ViewById(int id);
		Task<int> Update(OrganizationView view);
		Task<int> Create(OrganizationView view);
        Task<IList<OrganizationUser>> User(int organization, string user = "", bool remove = false, CancellationToken token = default);
        Task<IList<OrganizationCategory>> Category(int organization, int category = 0, bool remove = false, CancellationToken token = default);
    }
}