using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Memory;

namespace Client.Pages
{
	[Authorize]
	[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
	public class IndexModel(IServiceUnit service, IUserAccount user) : PageModel
    {

        private IServiceUnit _service { get; set; } = service;
        private IUserAccount _user { get; set; } = user;


        public SelectList OrganizationList { get; set; }

        public async Task OnGet()
        {
            var credential = await _user.Credential();
            if (credential != null)
            {
                OrganizationList = new SelectList(await _service.Organization.Index(credential), nameof(OrganizationView.Id), nameof(OrganizationView.Descr));
            }
        }
        public async Task<IActionResult> OnPostQR(int qr)
        {
            if (User.IsInRole("Administrador") || User.IsInRole("Supervisor") || User.IsInRole("Tecnico") || User.IsInRole("Ayudante"))
            {
                return Partial("Maintenance/Work", await _service.Maintenance.WorkQR(qr));
            }
            else
            {
                return Partial("Equipment/History", await _service.Equipment.HistoryQR(qr, new Pagination()));
            }
        }

        public async Task<IActionResult> OnPostStatusGraphic(GraphicFilter filter)
        {
            var result = new JsonResult(await _service.Maintenance.StatusGraphic(filter));
            return result;
        }

        public async Task<IActionResult> OnPostPriorityGraphic(GraphicFilter filter)
        {
			var result = new JsonResult(await _service.Maintenance.PriorityGraphic(filter));
            return result;
        }
    }
}
