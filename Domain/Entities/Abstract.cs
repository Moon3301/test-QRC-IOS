using Mapster;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
	public class SolutionException(string message, Exception? inner = null): ApplicationException(message, inner)
    { 
		
	}
    public static class Constants
	{
		public const string RequiredMessage = "Por favor envía esta información.";
	}

	public class AutocompleteItem
	{
		public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
	}


}
