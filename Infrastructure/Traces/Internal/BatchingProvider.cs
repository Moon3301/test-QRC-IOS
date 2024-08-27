// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in https://github.com/aspnet/Logging for license information.
// https://github.com/aspnet/Logging/blob/2d2f31968229eddb57b6ba3d34696ef366a6c71b/src/Microsoft.Extensions.Logging.AzureAppServices/Internal/BatchingLoggerProvider.cs

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;

namespace Infrastructure.Traces.RollingFile.Internal
{
	public abstract class BatchingProvider : ILoggerProvider, ISupportExternalScope
	{
		private readonly List<TraceMessage> _currentBatch = [];
		private readonly TimeSpan _interval;
		private readonly int? _queueSize;
		private readonly int? _batchSize;
		private readonly IDisposable _optionsChangeToken;

		private BlockingCollection<TraceMessage> _messageQueue;
		private Task _outputTask;
		private CancellationTokenSource _cancellationTokenSource;

		private bool _includeScopes;
		private IExternalScopeProvider _scopeProvider;

		internal IExternalScopeProvider ScopeProvider => _includeScopes ? _scopeProvider : null;

		protected BatchingProvider(IOptionsMonitor<BatchingOptions> options)
		{
			// NOTE: Only IsEnabled and IncludeScopes are monitored

			var loggerOptions = options.CurrentValue;
			if (loggerOptions.BatchSize <= 0)
			{
				throw new ArgumentOutOfRangeException(nameof(loggerOptions.BatchSize), $"{nameof(loggerOptions.BatchSize)} must be a positive number.");
			}
			if (loggerOptions.FlushPeriod <= TimeSpan.Zero)
			{
				throw new ArgumentOutOfRangeException(nameof(loggerOptions.FlushPeriod), $"{nameof(loggerOptions.FlushPeriod)} must be longer than zero.");
			}

			_interval = loggerOptions.FlushPeriod;
			_batchSize = loggerOptions.BatchSize;
			_queueSize = loggerOptions.BackgroundQueueSize;

			_optionsChangeToken = options.OnChange(UpdateOptions);
			UpdateOptions(options.CurrentValue);
		}

		public bool IsEnabled { get; private set; }

		private void UpdateOptions(BatchingOptions options)
		{
			var oldIsEnabled = IsEnabled;
			IsEnabled = options.IsEnabled;
			_includeScopes = options.IncludeScopes;

			if (oldIsEnabled != IsEnabled)
			{
				if (IsEnabled)
				{
					Start();
				}
				else
				{
					Stop();
				}
			}

		}

		protected abstract Task WriteMessagesAsync(IEnumerable<TraceMessage> messages, CancellationToken token);

		private async Task ProcessLogQueue()
		{
			while (!_cancellationTokenSource.IsCancellationRequested)
			{
				var limit = _batchSize ?? int.MaxValue;

				while (limit > 0 && _messageQueue.TryTake(out var message))
				{
					_currentBatch.Add(message);
					limit--;
				}

				if (_currentBatch.Count > 0)
				{
					try
					{
						await WriteMessagesAsync(_currentBatch, _cancellationTokenSource.Token);
					}
					catch
					{
						// ignored
					}

					_currentBatch.Clear();
				}
				await IntervalAsync(_interval, _cancellationTokenSource.Token);
			}
		}

		protected virtual Task IntervalAsync(TimeSpan interval, CancellationToken cancellationToken)
		{
			return Task.Delay(interval, cancellationToken);
		}

		internal void AddMessage(DateTimeOffset timestamp, string message)
		{
			if (!_messageQueue.IsAddingCompleted)
			{
				try
				{
					_messageQueue.Add(new TraceMessage { Message = message, Timestamp = timestamp }, _cancellationTokenSource.Token);
				}
				catch
				{
					//cancellation token canceled or CompleteAdding called
				}
			}
		}

		private void Start()
		{
			_messageQueue = _queueSize == null ?
				new BlockingCollection<TraceMessage>(new ConcurrentQueue<TraceMessage>()) :
				new BlockingCollection<TraceMessage>(new ConcurrentQueue<TraceMessage>(), _queueSize.Value);

			_cancellationTokenSource = new CancellationTokenSource();
			_outputTask = Task.Run(ProcessLogQueue);
		}

		private void Stop()
		{
			_cancellationTokenSource.Cancel();
			_messageQueue.CompleteAdding();

			try
			{
				_outputTask.Wait(_interval);
			}
			catch (TaskCanceledException)
			{
			}
			catch (AggregateException ex) when (ex.InnerExceptions.Count == 1 && ex.InnerExceptions[0] is TaskCanceledException)
			{
			}
		}

		public void Dispose()
		{
			_optionsChangeToken?.Dispose();
			if (IsEnabled)
			{
				Stop();
			}
			GC.SuppressFinalize(this);
		}

		public ILogger CreateLogger(string categoryName)
		{
			return new Batching(this, categoryName);
		}

		void ISupportExternalScope.SetScopeProvider(IExternalScopeProvider scopeProvider)
		{
			_scopeProvider = scopeProvider;
		}
	}
}
