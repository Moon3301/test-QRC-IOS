using Domain.Services;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces;
using DocumentFormat.OpenXml.Spreadsheet;
using Client.Utilities;

namespace Client.Controllers
{
	[Route("[controller]")]

	public class Category(IUserAccount user, IServiceUnit service) : Controller
	{
        private readonly IServiceUnit _service = service;
        private readonly IUserAccount _user = user;

        [Produces("application/json")]
        [HttpPost("Autocomplete")]
        public async Task<IActionResult> Autocomplete(string term = "*", CancellationToken token = default)
        {
            return new JsonResult(await _service.Category.Autocomplete(term, token));
        }

        [HttpPost("Index")]
		public async Task<IActionResult> Index(int organization)
		{
			return new JsonResult(await _service.Category.Index(organization));
		}

		[HttpPost("Edit")]
		public async Task<IActionResult> Edit(int id = 0)
		{
			CategoryView view;
			if (id == 0)
			{
				view = new CategoryView();
			}
			else
			{
				view = await _service.Category.ViewById(id);
			}
			return PartialView("Category/Edit", view);
		}

		[HttpPost("Update")]
		public async Task Update(CategoryView input)
		{
			if (ModelState.IsValid)
			{
				if (input.Id == 0)
				{
					input.Id = await _service.Category.Create(input);
				}
				else
				{
					await _service.Category.Update(input);
				}
			}
		}


		[HttpPost("Labor")]
		public async Task<IActionResult> Labor(int parentId)
		{
			return PartialView("Category/Labor", await _service.Category.LaborCollection(parentId));
		}


		[HttpPost("Step")]
		public async Task<IActionResult> Step(int parentId)
		{
			return PartialView("Category/Step", await _service.Category.StepCollection(parentId));
		}

		[HttpPost("Part")]
		public async Task<IActionResult> Part(int parentId)
		{
			return PartialView("Category/Part", await _service.Category.PartCollection(parentId));
		}

		[HttpPost("LaborUpdate")]
		public async Task LaborUpdate(int id = 0, int categoryId = 0, int laborId = 0, int sort = 0)
		{
			await _service.Category.LaborUpdate(id, categoryId, laborId, sort);
		}

		[HttpPost("StepUpdate")]
		public async Task StepUpdate(int id = 0, int categoryId = 0, int stepId = 0, int sort = 0)
		{
			await _service.Category.StepUpdate(id, categoryId, stepId, sort);
		}

		[HttpPost("PartUpdate")]
		public async Task PartUpdate(int id = 0, int categoryId = 0, int partId = 0, int sort = 0)
		{
			await _service.Category.PartUpdate(id, categoryId, partId, sort);
		}
	}
}
