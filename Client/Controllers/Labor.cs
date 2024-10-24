using Domain.Interfaces;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers
{
	[Route("[controller]")]
	public class Labor : Controller
	{
		private readonly IServiceUnit _service;

		public IReadOnlyCollection<LaborView> List { get; set; } = new List<LaborView>();



		public Labor(IServiceUnit service)
		{
			_service = service;
		}

		[HttpPost("")]
		public async Task<IActionResult> OnPost()
		{
			return PartialView("Labor/Index", await _service.Labor.Index());
		}

		[HttpPost("Input")]
		public async Task<IActionResult> OnPostInput(int id = 0)
		{
			LaborView view;
			if (id == 0)
			{
				view = new LaborView() { Id = 0 };
			}
			else
			{
				view = await _service.Labor.ViewById(id);
			}

			return PartialView("Labor/Input", view);
		}

		[HttpPost("Change")]
		public async Task OnPostChange(LaborView input)
		{
			if (ModelState.IsValid)
			{
				if (input.Id == 0)
				{
					input.Id = await _service.Labor.Create(input);
				}
				else
				{
					await _service.Labor.Update(input);
				}
			}
		}
	}
}
