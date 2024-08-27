using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Client.Pages.Shared.Organization
{
    public class IndexModel(IServiceUnit service, IUserAccount user) : PageModel
    {
        protected readonly IServiceUnit _service = service;
        protected readonly IUserAccount _user = user;
		public SelectList OrganizationSelect { get; set; }

		public IReadOnlyCollection<OrganizationView> Organizations { get; set; }
        public async Task OnGet()
        {
			var credential = await _user.Credential();
			Organizations = await _service.Organization.Index(credential);
		}
	}
}
