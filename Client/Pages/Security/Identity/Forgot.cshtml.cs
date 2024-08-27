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
	public class ForgotModel : PageModel
	{
		private readonly UserManager<User> _userManager;
		private readonly IEmailSender _emailSender;

		public ForgotModel(UserManager<User> userManager, IEmailSender emailSender)
		{
			_userManager = userManager;
			_emailSender = emailSender;
		}

		[BindProperty]
		public InputModel Input { get; set; }

		public class InputModel
		{
			[Required(ErrorMessage = Constants.RequiredMessage)]
			[EmailAddress]
			public string Email { get; set; }
		}
		public void OnGet()
		{

		}
		public async Task<IActionResult> OnPostAsync()
		{
			if (ModelState.IsValid)
			{
				var user = await _userManager.FindByEmailAsync(Input.Email);
				if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
				{
					ModelState.AddModelError(string.Empty, "A usted no lo conocemos.");
					// Don't reveal that the user does not exist or is not confirmed
					return Page();
				}
				var tokenGenerated = await _userManager.GeneratePasswordResetTokenAsync(user);
				byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(tokenGenerated);
				var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
				var confirmationLink = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Security/Identity/Reset?email={user.Email}&code={tokenEncoded}";

				// For more information on how to enable account confirmation and password reset please 
				// visit https://go.microsoft.com/fwlink/?LinkID=532713


				await _emailSender.SendEmailAsync(
					Input.Email,
					"Restablecer Contraseña",
					$"Si no recuerdas tu contraseña puedes <a href='{confirmationLink}'>reestablecerla</a>.");

				return Redirect($"/Security/Identity/Email/{Input.Email}");
			}

			return Page();
		}
	}
}
