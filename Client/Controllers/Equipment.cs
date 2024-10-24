using Domain.Interfaces;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Client.Utilities;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Memory;


namespace Client.Controllers
{

	public class EquipmentEdit
	{
		public EquipmentItem Input { get; set; }
		public IReadOnlyCollection<PartView> PartCollection { get; set; }
		public PaginatedResult<EquipmentItem> Result { get; set; }
		public SelectList OrganizationCollection { get; set; }
		public SelectList CategoryCollection { get; set; }

		[BindProperty]
		public Priority PriorityList { get; set; }

		public EquipmentEdit(IServiceUnit service, IUserAccount user)
		{
			Input = new EquipmentItem();
			var credential = user.Credential().Result;
			if (credential != null)
			{
				Result = new() { Pages = new() { Entity = "Equipment" } };
				OrganizationCollection = new SelectList(service.Organization.Index(credential).Result, "Id", "Descr");
				if (OrganizationCollection.Count() != 0)
				{
					CategoryCollection = new SelectList(service.Category.Index(Convert.ToInt32(OrganizationCollection.First().Value)).Result, nameof(CategoryView.Id), nameof(CategoryView.Descr));
				}
			}
		}
	}



	[Route("[controller]")]

	public class Equipment(IServiceUnit service, IUserAccount user) : SolutionController(service, user)
	{
        [HttpPost("Filter")]
		public async Task<IActionResult> Filter(EquipmentFilter equipment, Pagination? pages = null)
		{
            return PartialView("Equipment/Result", await _service.Equipment.Filter(equipment, pages));
		}

		[Produces("application/json")]
		[HttpPost("PhysicalFileAutocomplete")]
		public async Task<JsonResult> PhysicalFileAutocomplete(string search)
		{
			return new JsonResult(await _service.Equipment.PhysicalFileAutocomplete(search));
		}

		[HttpPost("History")]
		public async Task<IActionResult> History(int id, Pagination pages = null)
		{
			return PartialView("Equipment/History", await _service.Equipment.History(id, pages));
		}

		[HttpPost("Edit")]
		public async Task<IActionResult> Edit(int id = 0)
		{
			EquipmentEdit model = new(_service, _user)
			{
				Input = await _service.Equipment.ViewById(id)
			};
			model.PartCollection = await _service.Equipment.PartCollection(model.Input.CategoryId, model.Input.Id);

			return PartialView("Equipment/Edit", model);
		}

		[HttpPost("Update")]
		public async Task<int> Update(EquipmentItem input)
		{
			if (ModelState.IsValid)
			{
				if (input.Id == 0)
				{
					input.Id = await _service.Equipment.Create(input);
				}
				else
				{
					await _service.Equipment.Update(input);
				}
			}
			return input.Id; 
		}

		[HttpPost("Delete")]
		public async Task Delete(EquipmentFilter filter)
		{
			await _service.Equipment.Delete(filter);
		}

		[HttpPost("Part")]
		public async Task<IActionResult> Part(EquipmentItem filter)
		{
			return PartialView("Equipment/Part", await _service.Equipment.PartCollection(filter.CategoryId, filter.Id));
		}

		[HttpPost("PartUpdate")]
		public async Task<IActionResult> PartUpdate(int equipmentId, int partId, decimal nominalValue)
		{
			await _service.Equipment.PartUpdate(equipmentId, partId, nominalValue);
			return PartialView("Equipment/Part", await _service.Equipment.PartCollection(equipmentId));
		}
	}
}
