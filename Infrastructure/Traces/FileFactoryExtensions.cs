using Infrastructure.Traces.RollingFile;
using Microsoft.Extensions.DependencyInjection;

namespace Microsoft.Extensions.Logging
{
	/// <summary>
	/// Extensions for adding the <see cref="FileProvider" /> to the <see cref="ILoggingBuilder" />
	/// </summary>
	public static class FileFactoryExtensions
	{
		/// <summary>
		/// Adds a file logger named 'File' to the factory.
		/// </summary>
		/// <param name="builder">The <see cref="ILoggingBuilder"/> to use.</param>
		public static ILoggingBuilder AddFileLogger(this ILoggingBuilder builder)
		{
			builder.Services.AddSingleton<ILoggerProvider, FileProvider>();
			return builder;
		}

		/// <summary>
		/// Adds a file logger named 'File' to the factory.
		/// </summary>
		/// <param name="builder">The <see cref="ILoggingBuilder"/> to use.</param>
		/// <param name="filename">Sets the filename prefix to use for log files</param>
		public static ILoggingBuilder AddFileLogger(this ILoggingBuilder builder, string filename = "trace-")
		{
			builder.AddFileLogger(options => options.FileName = filename);
			return builder;
		}

		/// <summary>
		/// Adds a file logger named 'File' to the factory.
		/// </summary>
		/// <param name="builder">The <see cref="ILoggingBuilder"/> to use.</param>
		/// <param name="configure">Configure an instance of the <see cref="FileOptions" /> to set logging options</param>
		public static ILoggingBuilder AddFileLogger(this ILoggingBuilder builder, Action<Infrastructure.Traces.RollingFile.FileOptions> configure)
		{
			if (configure == null)
			{
				throw new ArgumentNullException(nameof(configure));
			}
			builder.AddFileLogger();
			builder.Services.Configure(configure);

			return builder;
		}
	}
}
