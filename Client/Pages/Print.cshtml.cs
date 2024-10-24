using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Client.Pages
{
    public class PrintModel(IServiceUnit service) : PageModel
    {
		readonly IServiceUnit _service = service;

		[BindProperty]
		public PrintView Result {  get; set; }
		public async Task OnGet(int id)
        {
            Result = await _service.Maintenance.Print(id);
        }
    }
}
