using Client.Controllers;
using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Domain.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Client.Pages
{
    public class MaintenanceModel(IServiceUnit service, IUserAccount user) : PageModel
    {
        private readonly IServiceUnit _service = service;
        private readonly IUserAccount _user = user;
        [BindProperty]
        public MaintenanceFilter Input { get; set; }
        public SelectList OrganizationSelect { get; set; }

        public SelectList CategorySelect {  get; set; }

        public PaginatedResult<MaintenanceView> Result { get; set; }
        public async Task<IActionResult> OnGet()
        {
            if (Input == null)
            {
                Input = new MaintenanceFilter()
                {
                    Status = MaintenanceStatus.Finalizada,
                    OrganizationId = 0,
                    CategoryId = 0,
                    Month = DateTime.Now.Month,
                    Year = DateTime.Now.Year
                };
            }
            OrganizationSelect = new SelectList(service.Organization.Index(user.Credential().Result).Result, "Id", "Descr");
            CategorySelect = new(service.Category.Index(Convert.ToInt32(OrganizationSelect.First().Value)).Result, "Id", "Descr");
            Result = await _service.Maintenance.Filter(Input, new Pagination() { Entity = "Maintenance"});
            return Page();
        }
    }
}
