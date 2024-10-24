using Domain;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Client.Models
{
	public class UserEdit : UserCredential
	{
		public IReadOnlyCollection<OrganizationView> Organizations { get; set; } = [];
		public SelectList OrganizationsSelectList
		{
			get
			{
				var items = Organizations.Select(item => new SelectListItem
				{
					Value = item.Id.ToString(),
					Text = item.Descr.ToString(),
				}).ToList();

				return new SelectList(items, "Value", "Text");
			}

		}
	}
}
