using Client.Controllers;
using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Client.Pages.Organization
{
    public class ConfigurationModel(IServiceUnit service) : PageModel
    {
        private readonly IServiceUnit _service = service;

        public int OrganizationId { get; set; }
        public string Organization { get; set; }

        public IList<OrganizationUser> Users { get; set; }
        public IList<OrganizationCategory> Categories { get; set; }

        public async Task OnGet(int id, string descr, CancellationToken token)
        {
            OrganizationId = id;
            Organization = descr.FromUrl().ToUpper();

            Users = await _service.Organization.User(id, "", false, token);
            Categories = await _service.Organization.Category(id, 0, false, token);
        }
    }
}
