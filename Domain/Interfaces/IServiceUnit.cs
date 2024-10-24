namespace Domain.Interfaces
{
	public interface IServiceUnit
	{
		IUserService User { get; }
		ICategoryService Category { get; }
		IEquipmentService Equipment { get; }
		IMaintenanceService Maintenance { get; }
		IOrganizationService Organization { get; }
		ILaborService Labor { get; }
	}
}