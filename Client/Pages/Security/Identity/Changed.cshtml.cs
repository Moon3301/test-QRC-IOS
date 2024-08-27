using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Client.Pages.Security
{
	[AllowAnonymous]
	public class ChangedModel : PageModel
	{
		public void OnGet()
		{

		}
	}
}
