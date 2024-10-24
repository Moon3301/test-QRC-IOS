using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace Client.Pages.Security
{
	[AllowAnonymous]
	public class SuccessModel : PageModel
	{
		private readonly UserManager<User> _userManager;
		private readonly SignInManager<User> _signInManager;

		private readonly IDatabaseUnit _unit;
		public string ReturnUrl { get; set; } = "";
		public string UserName { get; set; } = "";
		public SuccessModel(UserManager<User> userManager, SignInManager<Domain.User> signInManager, IDatabaseUnit unit)
		{
			_userManager = userManager;
			_signInManager = signInManager;

			_unit = unit;
		}

		public async Task<IActionResult> OnGetAsync(string email, string code, string url = "")
		{
			if (email == null || code == null)
			{
				return RedirectToPage("/");
			}


			var user = await _userManager.FindByEmailAsync(email);
			if (user == null)
			{
				return NotFound($"Unable to load user with Email '{email}'.");
			}
			if (!user.EmailConfirmed)
			{
				UserName = user.UserName;
				var tokenDecodedBytes = WebEncoders.Base64UrlDecode(code);
				var tokenDecoded = Encoding.UTF8.GetString(tokenDecodedBytes);

				var result = await _userManager.ConfirmEmailAsync(user, tokenDecoded);

				if (result.Succeeded)
				{
					//sign in user
					await _signInManager.SignInAsync(user, false);
					ReturnUrl = url;
				}
				else
				{
					throw new InvalidOperationException($"Error confirming email for user with Email '{email}':");
				}

			}
			return Page();
		}
	}
}
