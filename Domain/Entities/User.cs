using Mapster;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
	
	public enum Role
	{
		Administrador,
		Supervisor,
		Tecnico
	}
	public class User : IdentityUser
    {
        [MaxLength(128)]
        public string Name { get; set; } = string.Empty;
		public Position Position { get; set; } = 0;
        public string Signature { get; set; } = string.Empty;

		public User()
        {
        }


    }

    public enum Position
    {
		Administrador,
        Supervisor,
        Tecnico,
        Ayudante, 
		Cliente
    }

	public class UserCredential
	{
		public string Id { get; set; }
		public string Email { get; set; }
		public string UserName { get; set; }
		public string Password { get; set; }
		public string Name { get; set; }
		public string Phone { get; set; }
		public Position Position { get; set; }
        public IList<string>? Roles { get; set; } = null;



        public UserCredential() { }
		public UserCredential(User entity)
		{
			entity.Adapt(this);
		}
	}
}
