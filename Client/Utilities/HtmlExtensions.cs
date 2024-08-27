using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.ObjectModel;
using System.Linq.Expressions;

namespace Client.Utilities
{
	public static class HtmlHelperExtensions
	{
		public static SelectList SelectFromCollection<T>(this IHtmlHelper htmlHelper, IEnumerable<T> items, string dataValueField, string dataTextField)
		{
			return new SelectList(items, dataValueField, dataTextField);
		}
	}
}
