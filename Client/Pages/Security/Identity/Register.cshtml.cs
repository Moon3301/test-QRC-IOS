using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Transactions;

namespace Client.Pages.Security
{
	[AllowAnonymous]
	public class RegisterModel : PageModel
	{
		private readonly UserManager<User> _userManager;
		private readonly IEmailSender _emailSender;

		public RegisterModel(UserManager<User> userManager, IEmailSender emailSender)
		{
			_userManager = userManager;
			_emailSender = emailSender;
		}
		[BindProperty]
		public InputModel Input { get; set; }
		[BindProperty]
		public string? Reference { get; set; }
		public class InputModel
		{
			[Required(ErrorMessage = Constants.RequiredMessage)]
			[EmailAddress]
			[Display(Name = "Email")]
			public string Email { get; set; } = "";

			[Required(ErrorMessage = Constants.RequiredMessage)]
			[StringLength(100, ErrorMessage = "La {0} debe tener al menos {2} y como máximo {1} caracteres.", MinimumLength = 6)]
			[DataType(DataType.Password)]
			[Display(Name = "Contraseña")]
			public string Password { get; set; } = "";

			[DataType(DataType.Password)]
			[Display(Name = "Confirmación de Contraseña")]
			[Compare("Password", ErrorMessage = "La contraseña y la confirmación deben coincidir.")]
			public string ConfirmPassword { get; set; } = "";
		}

		public void OnGet(string reference = "")
		{
			Reference = reference;
		}

		public async Task<IActionResult> OnPostAsync()
		{
			if (ModelState.IsValid)
			{
				//using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

                string email = Input.Email;
                string userName = $"{email[..email.IndexOf("@")]}{DateTime.UtcNow:ms}";
                var user = new User { UserName = userName, Email = email };

                var result = await _userManager.CreateAsync(user, Input.Password);
                if (result.Succeeded)
                {
                    var tokenGenerated = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(tokenGenerated);
                    var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
                    var confirmationLink = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Security/Identity/Success?email={user.Email}&code={tokenEncoded}";

                    await _emailSender.SendEmailAsync(user.Email, "Confirmación de Registro",
                        $"Por favor <a href='{confirmationLink}'>confirma tu email</a> para comenzar a utilizar la aplicación.");

                    return Redirect($"/Security/Identity/Email/{Input.Email}");
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }


            }

			// If we got this far, something failed, redisplay form
			return Page();
		}
	}
}
