using Domain;
using Domain.Interfaces;
using Domain.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Client.Models;
using Microsoft.Identity.Client;
using Client.Utilities;

namespace Client.Controllers
{

	public class PasswordView
	{
		public string Id { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}

	public class UserRoleModel
	{
		public string UserId { get; set; }
		public string UserName { get; set; }
		public List<UserRoleView> Roles { get; set; }

	}
	public class UserRoleView
	{
		public string Name { get; set; }
		public bool Associated { get; set; }
	}


	[Route("[controller]")]

	public class Security(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IUserAccount account, IServiceUnit service) : Controller
	{
		private readonly UserManager<User> _userManager = userManager;
		private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly IUserAccount _account = account;
        private readonly IServiceUnit _service = service;

		public List<User> Collection { get; set; } = [];

		[HttpPost("Result")]
		public async Task<IActionResult> Result()
		{
			return PartialView("Security/Result", await _userManager.Users.ToListAsync());
		}

		[HttpPost("Edit")]
		public async Task<IActionResult> Edit(string id = "")
		{
			UserEdit input;
			if (id == null || id == "")
			{
				var user = await _userManager.FindByNameAsync(User.Identity.Name);
				input = new UserEdit() { Id = "" };
			}
			else
			{
				var user = await _userManager.FindByIdAsync(id);
				input = new UserEdit() { Id = user.Id, Email = user.Email, UserName = user.UserName, Name = user.Name, Position = user.Position }; ;
				input.Organizations = await _service.Organization.Index(await _account.Credential());
			}
			return PartialView("Security/Edit", input);
		}


        [HttpPost("Update")]
        public async Task<IActionResult> Update(UserEdit input)
        {
            User user;
            if (input.Id != null && input.Id != string.Empty)
            {
                user = await _userManager.FindByIdAsync(input.Id);
                if (user != null)
                {
					//user.UserName = input.UserName;
					user.Position = input.Position;
					user.Email = input.Email;
					user.Name = input.Name;
                    await _userManager.UpdateAsync(user);

					await UserRoleUpdate(user.Id, [user.Position.ToString()]);
                }
            }
            else
            {
                user = new User()
                {
                    Email = input.Email,
                    UserName = input.Email,
                    Position = input.Position,
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(user, GeneratePassword());
            }
            return await Result();
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete(string id = "")
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user != null)
            {
                await _userManager.DeleteAsync(user);
            }
            return await Result();
        }

        [HttpPost("PasswordReset")]
		public IActionResult PasswordReset(string id = "")
		{
			return PartialView("Security/Password", new PasswordView() { Id = id, Password = "" });
		}

		[HttpPost("PasswordUpdate")]
		public async Task<IActionResult> PasswordUpdate(UserCredential input)
		{
			User user;
			if (input.Id != null && input.Id != string.Empty)
			{
				user = await _userManager.FindByIdAsync(input.Id);
				if (user != null)
				{
					if (!string.IsNullOrEmpty(input.Password))
					{
						var token = await _userManager.GeneratePasswordResetTokenAsync(user);
						await _userManager.ResetPasswordAsync(user, token, input.Password);
					}
				}
			}
			
			return Ok();
		}



		[HttpPost("UserRole")]
		public async Task<IActionResult> UserRole(string id)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null)
				return NotFound();

			var allRoles = _roleManager.Roles.ToList();
			var userRoles = await _userManager.GetRolesAsync(user);

			var rolesAssociation = allRoles.Select(role => new UserRoleView
			{
				Name = role.Name,
				Associated = userRoles.Contains(role.Name)
			}).ToList();

			var model = new UserRoleModel
			{
				UserId = user.Id,
				UserName = user.UserName,
				Roles = rolesAssociation
			};

			return PartialView("Security/UserRole", model);
		}

		[HttpPost("UserRoleUpdate")]
		public async Task<IActionResult> UserRoleUpdate(string userId, string[] roles)
		{
			var user = await _userManager.FindByIdAsync(userId);

			var currentRoles = await _userManager.GetRolesAsync(user);
			var rolesToAdd = roles.Except(currentRoles);
			var rolesToRemove = currentRoles.Except(roles);

			await _userManager.AddToRolesAsync(user, rolesToAdd);
			await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

			return new OkResult();
		}


		[HttpPost("Role")]
		public IActionResult Role()
		{
			return PartialView("Security/Role");
		}

		[HttpPost("RoleIndex")]
		public IActionResult RoleIndex()
		{
			return new JsonResult(_roleManager.Roles.Select(_ => new { id = _.Id, name = _.Name }));
		}

		[HttpPost("RoleCreate")]
		public async Task<IActionResult> RoleCreate(string input)
		{
			var newRole = new IdentityRole { Name = input };
			var result = await _roleManager.CreateAsync(newRole);
			if (result.Succeeded)
			{
				return RoleIndex();
			}
			else
			{
				return BadRequest(result.Errors);
			}
		}

		[HttpPost("RoleDelete")]
		public async Task<IActionResult> RoleDelete(string id)
		{
			var role = _roleManager.Roles.FirstOrDefault(r => r.Id == id);
			if (role == null)
			{
				return BadRequest();
			}

			var result = await _roleManager.DeleteAsync(role);
			if (result.Succeeded)
			{
				return RoleIndex();
			}
			else
			{
				return BadRequest(result.Errors);
			}
		}


		public IActionResult ToggleRoleForUser(string userId, string roleName)
		{
			var user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
			if (user == null)
			{
				return BadRequest();
			}

			if (_userManager.IsInRoleAsync(user, roleName).Result)
			{
				_userManager.RemoveFromRoleAsync(user, roleName).Wait();
			}
			else
			{
				_userManager.AddToRoleAsync(user, roleName).Wait();
			}

			return new OkResult();
		}

		private string GeneratePassword()
		{
			var options = _userManager.Options.Password;

			int length = options.RequiredLength;

			bool nonAlphanumeric = options.RequireNonAlphanumeric;
			bool digit = options.RequireDigit;
			bool lowercase = options.RequireLowercase;
			bool uppercase = options.RequireUppercase;

			StringBuilder password = new();
			Random random = new();

			while (password.Length < length)
			{
				char c = (char)random.Next(32, 126);

				password.Append(c);

				if (char.IsDigit(c))
					digit = false;
				else if (char.IsLower(c))
					lowercase = false;
				else if (char.IsUpper(c))
					uppercase = false;
				else if (!char.IsLetterOrDigit(c))
					nonAlphanumeric = false;
			}

			if (nonAlphanumeric)
				password.Append((char)random.Next(33, 48));
			if (digit)
				password.Append((char)random.Next(48, 58));
			if (lowercase)
				password.Append((char)random.Next(97, 123));
			if (uppercase)
				password.Append((char)random.Next(65, 91));

			return password.ToString();
		}


	}
}
