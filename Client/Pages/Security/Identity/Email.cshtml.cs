using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;


namespace Client.Pages.Security
{
	[AllowAnonymous]
	public class EmailModel : PageModel
	{

		public EmailModel()
		{
		}
		public string EmailServer { get; set; }

		public IActionResult OnGet(string email)
		{
			EmailServer = string.Concat("http://", email[(email.LastIndexOf("@") + 1)..]);
			return Page();
		}
	}
}
