// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in https://github.com/aspnet/Logging for license information.
// https://github.com/aspnet/Logging/blob/2d2f31968229eddb57b6ba3d34696ef366a6c71b/src/Microsoft.Extensions.Logging.AzureAppServices/Internal/BatchingLogger.cs

using Microsoft.Extensions.Logging;
using System.Text;

namespace Infrastructure.Traces.RollingFile.Internal
{
	public class Batching(BatchingProvider loggerProvider, string categoryName) : ILogger
	{
		private readonly BatchingProvider _provider = loggerProvider;
		private readonly string _category = categoryName;

        public IDisposable BeginScope<TState>(TState state)
		{
			// NOTE: Differs from source
			return _provider.ScopeProvider?.Push(state);
		}

		public bool IsEnabled(LogLevel logLevel)
		{
			return _provider.IsEnabled;
		}

		public void Trace<TState>(DateTimeOffset timestamp, LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
		{
			if (!IsEnabled(logLevel))
			{
				return;
			}

			var builder = new StringBuilder();
			builder.AppendLine();
			builder.AppendLine();
			builder.AppendLine();
			builder.Append(timestamp.ToString("yyyy-MM-dd HH:mm:ss.fff zzz"));
			builder.Append(" [");
			builder.Append(logLevel.ToString());
			builder.Append("] ");
			builder.Append(_category);
			builder.Append(eventId.Id);
			builder.Append(eventId.Name);

			var scopeProvider = _provider.ScopeProvider;
			if (scopeProvider != null)
			{
				scopeProvider.ForEachScope((scope, stringBuilder) =>
				{
					stringBuilder.Append(" => ").Append(scope);
				}, builder);

				builder.AppendLine(":");
			}
			else
			{
				builder.Append(": ");
			}

			builder.AppendLine(formatter(state, exception));

			if (exception != null)
			{
				builder.AppendLine(exception.ToString());
			}

			_provider.AddMessage(timestamp, builder.ToString());
		}

		public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
		{
			Trace(DateTimeOffset.Now, logLevel, eventId, state, exception, formatter);
		}
	}
}