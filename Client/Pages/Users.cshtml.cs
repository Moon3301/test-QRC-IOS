using Client.Utilities;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace Client.Pages
{
    public class UsersModel(IUserService user) : PageModel
    {
		private readonly IUserService _user = user;
		public IList<UserCredential> Collection { get; set; } = [];
		public async Task OnGet(CancellationToken token)
        {
			if (User.Identity != null)
			{
				Collection = await _user.ReadAll(token);
			}
			
		}
    }
}
