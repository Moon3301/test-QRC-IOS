
using Domain.Interfaces;
using System.Net;
using System.Reflection.Metadata.Ecma335;

namespace Domain.Services
{
	public class UserService(IDatabaseUnit unit, IDatabaseCommand command) : Service(unit, command), IUserService
	{
		public async Task<IEnumerable<AutocompleteItem>> Autocomplete(string search, CancellationToken token)
		{
			var result = new List<AutocompleteItem>();
			using var reader = await _command.ExecuteReader("UserAutocomplete", new { search }, null, token);
			while (await reader.ReadAsync(token))
			{
				var item = new AutocompleteItem()
				{
					Id = reader.ReadString("Id"),
					Title = reader.ReadString("UserName"),
				};
				result.Add(item);
			}
			return result;
		}

		public async Task<IReadOnlyCollection<UserCredential>> Collection(int organization, Position position)
		{
			return await _command.ReadCollection<UserCredential>("UserRead", new { organization, position });
		}


		


		public async Task<UserCredential> ReadCredential(string user, CancellationToken token = default)
		{
			using var reader = await _command.ExecuteReader("UserRead", new { user }, null, token);
			var result = new UserCredential();

			if (await reader.ReadAsync(token))
			{
				result.Id = reader.ReadString("Id");
				result.UserName = reader.ReadString("UserName");
				result.Position = reader.ReadPosition("Position");
			}


			if (await reader.NextResultAsync(token))
			{
				result.Roles = [];
				while (await reader.ReadAsync(token))
				{
					result.Roles.Add(reader.ReadString("Name"));
				}
			}
			return result;
		}

        public async Task<IList<UserCredential>> ReadAll(CancellationToken token = default)
        {
            using var reader = await _command.ExecuteReader("UserRead", null, null, token);
            IList<UserCredential> result = [];

            while (await reader.ReadAsync(token))
            {
                result.Add(new UserCredential()
                {
                    Id = reader.ReadString("Id"),
                    Email = reader.ReadString("Email"),
                    UserName = reader.ReadString("UserName"),
                    Name = reader.ReadString("Name"),
                    Position = reader.ReadPosition("Position"),
                });
            }
            return result;
        }


        public async Task<IList<UserCredential>> ReadRelated(int organization, CancellationToken token = default)
		{
			using var reader = await _command.ExecuteReader("UserRead", new { organization }, null, token);
			IList<UserCredential> result = [];

			while (await reader.ReadAsync(token))
			{
				result.Add(new UserCredential()
				{
					Id = reader.ReadString("Id"),
					Email = reader.ReadString("Email"),
					UserName = reader.ReadString("UserName"),
					Name = reader.ReadString("Name"),
					Position = reader.ReadPosition("Position"),
				});
			}
			return result;
		}
	}
}
