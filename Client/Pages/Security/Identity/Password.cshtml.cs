
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

namespace Client.Pages.Security
{
	[Authorize]
	public class PasswordModel(
		UserManager<User> userManager,
		SignInManager<User> signInManager) : PageModel
	{
		private readonly UserManager<User> _userManager = userManager;
		private readonly SignInManager<User> _signInManager = signInManager;

		[BindProperty]
		public InputModel Input { get; set; } = new InputModel();

		[TempData]
		public string StatusMessage { get; set; }

		public class InputModel
		{
			[Required(ErrorMessage = Constants.RequiredMessage)]
			[DataType(DataType.Password)]
			[Display(Name = "Contraseña Actual")]
			public string OldPassword { get; set; } = string.Empty;

			[Required(ErrorMessage = Constants.RequiredMessage)]
			[StringLength(100, ErrorMessage = "La {0} debe tener al menos {2} y como máximo {1} caracteres.", MinimumLength = 6)]
			[DataType(DataType.Password)]
			[Display(Name = "Contraseña Nueva")]
			public string NewPassword { get; set; } = string.Empty;

			[DataType(DataType.Password)]
			[Display(Name = "Confirmar Contraseña Nueva")]
			[Compare("NewPassword", ErrorMessage = "La nueva contraseña y su confirmación no coinciden.")]
			public string ConfirmPassword { get; set; } = string.Empty;
		}

		public IActionResult OnGet()
		{
			return Page();
		}

		public async Task<IActionResult> OnPostAsync()
		{
			if (!ModelState.IsValid)
			{
				return Page();
			}

			var user = await _userManager.GetUserAsync(User);
			if (user == null)
			{
				return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
			}

			var result = await _userManager.ChangePasswordAsync(user, Input.OldPassword, Input.NewPassword);
			if (!result.Succeeded)
			{
				foreach (var error in result.Errors)
				{
					ModelState.AddModelError(string.Empty, error.Description);
				}
				return Page();
			}

			await _signInManager.RefreshSignInAsync(user);
			StatusMessage = "Tu contraseña ha sido cambiada con éxito.";

			return RedirectToPage();
		}
	}
}
