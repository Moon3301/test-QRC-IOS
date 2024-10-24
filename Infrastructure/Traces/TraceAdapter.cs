using Domain;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Traces
{
	public class TraceAdapter<T> : ITracer<T>
	{
		private readonly ILogger<T> _logger;
		public TraceAdapter(ILoggerFactory loggerFactory)
		{
			_logger = loggerFactory.CreateLogger<T>();
		}

		public void LogWarning(string message, params object[] args)
		{
			_logger.LogWarning(message, args);
		}

		public void LogInformation(string message, params object[] args)
		{
			_logger.LogInformation(message, args);
		}

		public void LogError(string message, params object[] args)
		{
			_logger.LogError(message, args);
		}
	}
}
