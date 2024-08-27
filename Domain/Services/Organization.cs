using Domain.Interfaces;
using Mapster;


namespace Domain.Services
{
    public class OrganizationService : Service, IOrganizationService
    {
        public OrganizationService(IDatabaseUnit unit, IDatabaseCommand command) : base(unit, command)
        {
        }


		public async Task<int> Create(OrganizationView view)
		{
			view.Descr = view.Descr.ToUpper();
			Organization entity = new(view.Descr);
			await _database.Organization.CreateAsync(entity, default);
			return entity.Id;
		}

		public async Task<int> Update(OrganizationView view)
		{
			view.Descr = view.Descr.ToUpper();
			Organization entity = await _database.Organization.GetAsync(view.Id);
			view.Adapt(entity);
			await _database.Organization.UpdateAsync(entity, default);
			return entity.Id;
		}


		public async Task<OrganizationView> ViewById(int id)
		{
			return new OrganizationView(await _database.Organization.GetAsync(id));
		}



		

		public async Task<IReadOnlyCollection<OrganizationView>> Index(UserCredential credential)
        {
            var user = credential.Id;
            if (credential.Roles != null && credential.Roles.Contains("Administrador"))
            {
                user = "*";
            }
            return await _command.ReadCollection<OrganizationView>("OrganizationCollection", new { user });
        }

        public async Task<IReadOnlyCollection<OrganizationView>> Buildings()
        {
			return await _command.ReadCollection<OrganizationView>("BuildingCollection");
		}

		public async Task<IReadOnlyCollection<TowerView>> Towers()
        {
			return await _command.ReadCollection<TowerView>("TowerCollection");
		}





		public async Task<short> OrganizationCreate(string descr)
        {
            Organization entity = new(descr);
            await _database.Organization.CreateAsync(entity, default);
            await _database.SaveChangesAsync();
            return (short)entity.Id;
        }
        public async Task<short> BuildingCreate(string descr, short organizationId )
        {
            Building entity = new(descr, organizationId);
            await _database.Building.CreateAsync(entity, default);
            await _database.SaveChangesAsync();
            return (short)entity.Id;
        }

        public async Task<short> TowerCreate(string descr, short buildingId)
        {
            Tower entity = new(descr, buildingId);
            await _database.Tower.CreateAsync(entity, default);
            await _database.SaveChangesAsync();
            return (short)entity.Id;
        }


        public async Task<IList<OrganizationUser>> User(int organization, string user = "", bool remove = false, CancellationToken token = default)
        {
            IList<OrganizationUser> result = [];

            using var command = await _command.Initialize("OrganizationUserRelation", new { organization, user, remove }, null, token);
            using var reader = await command.ExecuteReaderAsync(token);

            while (await reader.ReadAsync(token))
            {
                result.Add(new OrganizationUser()
                {
                    OrganizationId = reader.ReadInteger("OrganizationId"),
                    UserId = reader.ReadString("UserId"),
                    UserName = reader.ReadString("UserName"),
                });
            }
            return result;
        }

        public async Task<IList<OrganizationCategory>> Category(int organization, int category = 0, bool remove = false, CancellationToken token = default)
        {
            IList<OrganizationCategory> result = [];

            using var command = await _command.Initialize("OrganizationCategoryRelation", new { organization, category, remove }, null, token);
            using var reader = await command.ExecuteReaderAsync(token);

            while (await reader.ReadAsync(token))
            {
                result.Add(new OrganizationCategory()
                {
                    OrganizationId = reader.ReadInteger("OrganizationId"),
                    CategoryId = reader.ReadInteger("CategoryId"),
                    Category = reader.ReadString("Descr"),
                });
            }
            return result;
        }

    }
}
