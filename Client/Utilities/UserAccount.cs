using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Domain.Services;
using Microsoft.AspNetCore.Identity;


namespace Client.Utilities
{


	public interface IUserAccount
	{
		public Task<UserCredential> Credential();
	}

	public class UserAccount(IHttpContextAccessor accessor, IUserService user) : IUserAccount
	{
		private readonly IHttpContextAccessor _accessor = accessor;
		private readonly IUserService _user = user;

        public async Task<UserCredential> Credential()
		{
			UserCredential user = _accessor.HttpContext.Session.Get<UserCredential>("User");
			if (_accessor.HttpContext.User.Identity.IsAuthenticated)
			{
				if (user == null)
				{
					user = await _user.ReadCredential(_accessor.HttpContext.User.Identity.Name);
					if (user != null)
					{
						_accessor.HttpContext.Session.Set("User", user);
					}
				}
			}
			return user;
		}

		

	}
}
