
using Client.Controllers;
using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;

namespace Client.Pages
{
	[Authorize(Roles = "Administrador,Supervisor")]
	[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
	public class EquipmentModel(IServiceUnit service, IUserAccount user) : PageModel
	{ 

		private readonly IUserAccount _user = user;
		private readonly IServiceUnit _service = service;

        public EquipmentEdit Input { get; set; }
		public MaintenanceView Maintenance { get; set; }

        public async Task<IActionResult> OnGet()
		{
			Input = new EquipmentEdit(_service, _user);
			return Page();
		}
	}
}
