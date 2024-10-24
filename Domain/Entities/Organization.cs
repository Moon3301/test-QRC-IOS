using Mapster;

namespace Domain
{
    public class Organization : Entity
    {
        public string Descr { get; protected set; } = string.Empty;
		public string ManagerPhone { get; protected set; } = string.Empty;
		public string SupervisorPhone { get; protected set; } = string.Empty;

		public Organization()
        {
        }

        public Organization(string descr)
        {
            Descr = descr;
        }
        public Organization(short id, string descr)
        {
            Id = id;
            Descr = descr;
        }

		public Organization(OrganizationView view)
		{
			view.Adapt(this);
		}

		
	}


	public class Building : Entity
	{
		public string Descr { get; protected set; } = string.Empty;
		public short OrganizationId { get; protected set; } = 0;

        public Building()
        {

        }

		public Building(string descr, short organizationId)
		{
            Descr = descr;
            OrganizationId = organizationId;
        }
        public Building(short id, string descr, short organizationId)
        {
            Id = id;
            Descr = descr;
            OrganizationId = organizationId;
        }
	}

	public class Tower : Entity
    {
		public string Descr { get; protected set; } = string.Empty;
		public short BuildingId { get; protected set; } = 0;
        public Tower()
        {
        }

        public Tower(string descr, short buildingId)
        {
            Descr = descr;
            BuildingId = buildingId;
        }
        public Tower(short id, string descr, short buildingId)
		{
			Id = id;
            Descr = descr;
            BuildingId = buildingId;
		}
	}

	public class OrganizationView : View
	{
		public string Descr { get; set; } = string.Empty;
		public string ManagerPhone { get; set; } = string.Empty;
		public string SupervisorPhone { get; set; } = string.Empty;
		public IReadOnlyCollection<BuildingView> Buildings { get; set; } = [];

		public OrganizationView()
		{
		}
		public OrganizationView(int id, string descr)
		{
			Id = id;
			Descr = descr;
		}

		public OrganizationView(Organization entity)
		{
			entity.Adapt(this);
		}
	}

	public class BuildingView : View
	{
		public string Descr { get; set; } = string.Empty;
		public short OrganizationId { get; set; }
		public IReadOnlyCollection<TowerView> Towers { get; set; } = new List<TowerView>();
		public BuildingView()
		{
		}
		public BuildingView(int id, string descr, short organizationId)
		{
			Id = id;
			Descr = descr;
			OrganizationId = organizationId;
		}

	}

	public class TowerView : View
	{
		public string Descr { get; set; } = string.Empty;
		public short BuildingId { get; set; }

		public TowerView()
		{
		}
		public TowerView(int id, string descr, short buildingId)
		{
			Id = id;
			Descr = descr;
			BuildingId = buildingId;
		}
	}

    public class OrganizationUser
    {
        public int OrganizationId { get; set; } = 0;
        public string UserId { get; set; } = "";
        public string UserName { get; set; } = "";
    }

    public class OrganizationCategory
    {
        public int OrganizationId { get; set; } = 0;
        public int CategoryId { get; set; } = 0;
        public string Category { get; set; } = "";
    }

}
