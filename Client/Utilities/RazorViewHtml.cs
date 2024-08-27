using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace Client.Utilities
{

	public interface IRazorViewHtml
	{
		Task<string> RenderPartialToStringAsync<TModel>(string partialName, TModel model);
	}

	public class RazorViewHtml : IRazorViewHtml
	{
		private IRazorViewEngine _viewEngine;
		private ITempDataProvider _tempDataProvider;
		private IServiceProvider _serviceProvider;
		public RazorViewHtml(
			IRazorViewEngine viewEngine,
			ITempDataProvider tempDataProvider,
			IServiceProvider serviceProvider)
		{
			_viewEngine = viewEngine;
			_tempDataProvider = tempDataProvider;
			_serviceProvider = serviceProvider;
		}
		public async Task<string> RenderPartialToStringAsync<TModel>(string partialName, TModel model)
		{
			var actionContext = GetActionContext();
			var partial = FindView(actionContext, partialName);

			using (var output = new StringWriter())
			{
				var viewContext = new ViewContext(
					actionContext,
					partial,
					new ViewDataDictionary<TModel>(
						metadataProvider: new EmptyModelMetadataProvider(),
						modelState: new ModelStateDictionary())
					{
						Model = model
					},
					new TempDataDictionary(
						actionContext.HttpContext,
						_tempDataProvider),
					output,
					new HtmlHelperOptions()
				);
				await partial.RenderAsync(viewContext);
				return output.ToString();
			}
		}

		public async Task<string> RenderViewToString<TModel>(string name, TModel model)
		{
			var actionContext = GetActionContext();

			var viewEngineResult = _viewEngine.FindView(actionContext, name, false);

			if (!viewEngineResult.Success)
			{
				throw new InvalidOperationException(string.Format("Couldn't find view '{0}'", name));
			}

			var view = viewEngineResult.View;

			using (var output = new StringWriter())
			{
				var viewContext = new ViewContext(
					actionContext,
					view,
					new ViewDataDictionary<TModel>(new EmptyModelMetadataProvider(), new ModelStateDictionary())
					{
						Model = model
					},
					new TempDataDictionary(actionContext.HttpContext, _tempDataProvider),
					output,
					new HtmlHelperOptions()
				);

				await view.RenderAsync(viewContext);

				return output.ToString();
			}
		}

		private IView FindView(ActionContext actionContext, string partialName)
		{
			var getPartialResult = _viewEngine.GetView(null, partialName, false);
			if (getPartialResult.Success)
			{
				return getPartialResult.View;
			}
			var findPartialResult = _viewEngine.FindView(actionContext, partialName, false);
			if (findPartialResult.Success)
			{
				return findPartialResult.View;
			}
			var searchedLocations = getPartialResult.SearchedLocations.Concat(findPartialResult.SearchedLocations);
			var errorMessage = string.Join(
				Environment.NewLine,
				new[] { $"Unable to find partial '{partialName}'. The following locations were searched:" }.Concat(searchedLocations)); ;
			throw new InvalidOperationException(errorMessage);
		}
		private ActionContext GetActionContext()
		{
			var httpContext = new DefaultHttpContext
			{
				RequestServices = _serviceProvider
			};
			return new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
		}
	}
}