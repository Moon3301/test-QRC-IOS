
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.ObjectModel;

namespace Client.Utilities
{
	public static class Common
	{
		public static SelectList ToSelectList<T>(this ReadOnlyCollection<T> collection,
													 Func<T, string> textSelector,
													 Func<T, object> valueSelector)
		{
			if (collection == null)
				throw new ArgumentNullException(nameof(collection));
			if (textSelector == null)
				throw new ArgumentNullException(nameof(textSelector));
			if (valueSelector == null)
				throw new ArgumentNullException(nameof(valueSelector));

			var items = collection.Select(item => new SelectListItem
			{
				Text = textSelector(item),
				Value = valueSelector(item)?.ToString()
			}).ToList();

			return new SelectList(items, "Value", "Text");
		}
		public static string ToLocalDate(this DateTime date, HttpContext context)
		{
			date = ConvertToLocalDateTime(date, context);
			// if there is no offset in session return the datetime in server timezone
			return date.ToString("dd/MM/yy");
		}

		public static string ToLocalDateTime(this DateTime date, HttpContext context)
		{
			date = ConvertToLocalDateTime(date, context);
			// if there is no offset in session return the datetime in server timezone
			return date.ToString("dd/MM/yyyy HH:mm tt");
		}

		private static DateTime ConvertToLocalDateTime(DateTime dt, HttpContext context)
		{
			// read the value from session
			var timeOffSet = context.Request.Cookies["_time_zone"];

			if (dt.Year > 1 && timeOffSet != null)
			{
				var offset = int.Parse(timeOffSet.ToString());
				dt = dt.AddMinutes(-1 * offset);
			}
			return dt;
		}
		public static string CombineUploadsPath(string file)
		{
			return string.Concat("/uploads/", file);
		}

		public static string GetCurrentRootUrl(HttpContext context)
		{
			return string.Format("{0}://{1}", context.Request.Scheme, context.Request.Host);
		}

		public static string GetCurrentUrl(HttpContext context)
		{
			return string.Format("{0}://{1}{2}{3}", context.Request.Scheme, context.Request.Host, context.Request.Path, context.Request.QueryString);
		}

    }

}
