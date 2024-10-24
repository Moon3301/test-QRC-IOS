﻿using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Client.Pages.Security
{
	[AllowAnonymous]
	public class LogoutModel : PageModel
	{
		private readonly SignInManager<User> _signInManager;

		public LogoutModel(SignInManager<User> signInManager)
		{
			_signInManager = signInManager;
		}

		public async Task<IActionResult> OnGet()
		{
			await _signInManager.SignOutAsync();
			return Redirect("~/");
		}
	}
}