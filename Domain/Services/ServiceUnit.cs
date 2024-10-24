using Domain;
using Domain.Interfaces;


namespace Domain.Services
{


	public class ServiceUnit : IServiceUnit
	{
		protected Lazy<IUserService> _agent;
		protected Lazy<ICategoryService> _category;
		protected Lazy<IOrganizationService> _organization;
		protected Lazy<ILaborService> _labor;
		protected Lazy<IEquipmentService> _equipment;
		protected Lazy<IMaintenanceService> _maintenance;

		public ServiceUnit(IDatabaseUnit database, IDatabaseCommand command)
		{
			_agent = new Lazy<IUserService>(() => new UserService(database, command));
			_category = new Lazy<ICategoryService>(() => new CategoryService(database, command));
			_organization = new Lazy<IOrganizationService>(() => new OrganizationService(database, command));
			_labor = new Lazy<ILaborService>(() => new LaborService(database, command));
			_equipment = new Lazy<IEquipmentService>(() => new EquipmentService(database, command));
			_maintenance = new Lazy<IMaintenanceService>(() => new MaintenanceService(database, command));
		}

		public IUserService User => _agent.Value;
		public ICategoryService Category => _category.Value;
		public IOrganizationService Organization => _organization.Value;
		public ILaborService Labor => _labor.Value;
		public IEquipmentService Equipment => _equipment.Value;
		public IMaintenanceService Maintenance => _maintenance.Value;

	}

}
