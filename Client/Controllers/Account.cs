using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers
{
	[Route("[controller]")]
	public class Account(IUserService user) : Controller
	{
        readonly IUserService _user = user;

		[Produces("application/json")]
		[HttpPost("Autocomplete")]
		public async Task<IActionResult> Autocomplete(string term = "*", CancellationToken token = default)
		{
			return new JsonResult(await _user.Autocomplete(term, token));
		}
	}
}
