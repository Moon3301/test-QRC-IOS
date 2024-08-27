using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Client.Pages.Security
{
	[AllowAnonymous]
	public class ResetModel : PageModel
	{
		private readonly UserManager<User> _userManager;

		public ResetModel(UserManager<Domain.User> userManager)
		{
			_userManager = userManager;
		}

		[BindProperty]
		public InputModel Input { get; set; }

		public class InputModel
		{
			[Required(ErrorMessage = Constants.RequiredMessage)]
			[EmailAddress]
			public string Email { get; set; } = "";

			[Required(ErrorMessage = Constants.RequiredMessage)]
			[DataType(DataType.Password)]
			[Display(Name = "Contraseña")]
			[StringLength(100, ErrorMessage = "La {0} debe tener al menos {2} y como máximo {1} caracteres.", MinimumLength = 6)]
			public string Password { get; set; } = "";

			[DataType(DataType.Password)]
			[Display(Name = "Confirmación de Contraseña")]
			[Compare("Password", ErrorMessage = "La nueva contraseña y su confirmación no coinciden.")]
			public string ConfirmPassword { get; set; } = "";

			public string Code { get; set; } = "";
		}

		public IActionResult OnGet(string code = "")
		{
			if (code == null)
			{
				return BadRequest("A code must be supplied for password reset.");
			}
			else
			{
				var tokenDecodedBytes = WebEncoders.Base64UrlDecode(code);
				var tokenDecoded = Encoding.UTF8.GetString(tokenDecodedBytes);
				Input = new InputModel
				{
					Code = tokenDecoded
				};
				return Page();
			}
		}

		public async Task<IActionResult> OnPostAsync()
		{
			if (!ModelState.IsValid)
			{
				return Page();
			}

			var user = await _userManager.FindByEmailAsync(Input.Email);
			if (user == null)
			{
				// Don't reveal that the user does not exist
				return Page();
			}

			var result = await _userManager.ResetPasswordAsync(user, Input.Code, Input.Password);
			if (result.Succeeded)
			{
				return RedirectToPage("./Changed");
			}

			foreach (var error in result.Errors)
			{
				ModelState.AddModelError(string.Empty, error.Description);
			}
			return Page();
		}
	}
}
