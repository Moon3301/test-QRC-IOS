using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Client.Pages
{
	[Authorize]
	public class ScanModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
