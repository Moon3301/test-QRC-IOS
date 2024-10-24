using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;


namespace Client.Pages.Security
{
	//[Authorize]
	public partial class IndexModel : PageModel
	{
		private readonly UserManager<User> _userManager;
		private readonly SignInManager<User> _signInManager;


		public IndexModel(
			UserManager<User> user,
			SignInManager<User> signInManager)
		{
			_userManager = user;
			_signInManager = signInManager;
		}

		[TempData]
		public string StatusMessage { get; set; }

		[BindProperty]
		public Domain.User Input { get; set; }




		public async Task<IActionResult> OnGetAsync()
		{
			var user = await _userManager.GetUserAsync(User);
			if (user == null)
			{
				return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
			}

			Input = user;

			return Page();
		}

		public async Task<IActionResult> OnPostAsync()
		{
			var user = await _userManager.GetUserAsync(User);
			if (user == null)
			{
				return NotFound($"Unable to load user '{User.Identity?.Name}'.");
			}
			else if (user.UserName != Input.UserName && await _userManager.FindByNameAsync(Input.UserName) != null)
			{
				ModelState.AddModelError(string.Empty, "Otro usuario ya está utilizando ese identificador.");
				return Page();
			}

			if (!ModelState.IsValid)
			{
				ModelState.AddModelError(string.Empty, "Existe un error en los datos.");
				return Page();
			}

			if (user.UserName != Input.UserName)
			{
				await _userManager.UpdateAsync(user);
			}

			user.UserName = Input.UserName;
			user.PhoneNumber = Input.PhoneNumber ?? string.Empty;

			await _userManager.UpdateAsync(user);
			await _signInManager.RefreshSignInAsync(user);

			StatusMessage = "Los datos han sido actualizados.";
			return Page();
		}
	}
}
