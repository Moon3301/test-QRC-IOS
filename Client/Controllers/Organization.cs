using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers
{
	[Route("[controller]")]

	public class Organization(IUserAccount user, IServiceUnit service) : Controller
	{
		private readonly IUserAccount _user = user;
		private readonly IServiceUnit _service = service;

		[HttpPost("Edit")]
		public async Task<IActionResult> Edit(int id = 0)
		{
			OrganizationView view;
			if (id == 0)
			{
				view = new OrganizationView();
			}
			else
			{
				view = await _service.Organization.ViewById(id);
			}
			return PartialView("Organization/Edit", view);
		}

		[HttpPost("Update")]
		public async Task Update(OrganizationView input)
		{
			if (ModelState.IsValid)
			{
				if (input.Id == 0)
				{
					input.Id = await _service.Organization.Create(input);
				}
				else
				{
					await _service.Organization.Update(input);
				}
			}
		}

		[HttpPost("UserCollection")]
		public async Task<IActionResult> UserCollecion(int organizationId)
		{
			var supervisor = await _service.User.Collection(organizationId, Position.Supervisor);
			var technician = await _service.User.Collection(organizationId, Position.Tecnico);
			var helper = await _service.User.Collection(organizationId, Position.Ayudante);

			var user = new { supervisor, technician, helper };
			return new JsonResult(user);
		}

		[HttpPost("UserRelation")]
		public async Task<IActionResult> UserRelation(int organization, string user, bool remove, CancellationToken token)
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return PartialView("/Pages/Shared/Organization/Users.cshtml", await _service.Organization.User(organization, user, remove, token));
            }
            return BadRequest();
        }

		[HttpPost("CategoryRelation")]
		public async Task<IActionResult> CategoryRelation(int organization, int category, bool remove, CancellationToken token)
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return PartialView("/Pages/Shared/Organization/Categories.cshtml", await _service.Organization.Category(organization, category, remove, token));
            }
            return BadRequest();
        }
	}
}
