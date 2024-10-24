using Client.Utilities;
using Domain;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;

namespace Client.Pages.Security
{
	[AllowAnonymous]
	public class LoginModel : PageModel
	{
		private readonly SignInManager<User> _signInManager;
		private readonly UserManager<User> _userManager;
		private readonly ILogger<LoginModel> _logger;
        public LoginModel(SignInManager<User> signInManager, UserManager<User> userManager, ILogger<LoginModel> logger)
		{
			_signInManager = signInManager;
			_userManager = userManager;
			_logger = logger;
		}

		[BindProperty]
		public InputModel Input { get; set; }

		[ViewData]
		public string ReturnUrl { get; set; }
        public class InputModel
        {
            [Required]
            [Display(Name = "Usuario")]
            public string User { get; set; }

            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [Display(Name = "Recordarme?")]
            public bool RememberMe { get; set; }
        }


        public async Task OnGetAsync(string returnUrl = null)
		{
            ReturnUrl = returnUrl ?? Url.Content("~/");
            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
		}

        public async Task<IActionResult> OnPostAsync()
        {
            string error = "Error al validar las credenciales.";

            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(Input.User);

                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, Input.Password, Input.RememberMe, false);
                    // To enable password failures to trigger account lockout, set lockoutOnFailure: true

                    if (result.Succeeded)
                    {
                        HttpContext.Session.Set("User", user);

                        if (User.IsInRole("Administrador")) {
                            return RedirectToPage("/Equipment");
                        }
						if (User.IsInRole("Supervisor"))
						{
							return RedirectToPage("/Index");
						}
						if (User.IsInRole("Cliente"))
						{
							return RedirectToPage("/Maintenance");
						}
						return RedirectToPage("/Scan");
					}
					else
                    {
                        user.AccessFailedCount++;
                        ModelState.AddModelError(string.Empty, error);
                    }
                    if (result.RequiresTwoFactor)
                    {
                        return RedirectToPage("./LoginWith2fa", new { Input.RememberMe });
                    }
                    if (result.IsLockedOut)
                    {
                        _logger.LogWarning("Cuenta de usuario bloqueada.");
                        return RedirectToPage("./Lockout");
                    }
                }
            }
            return Page();
        }
    }
}
