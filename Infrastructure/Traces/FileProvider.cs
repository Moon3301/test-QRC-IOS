// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in https://github.com/aspnet/Logging for license information.
// https://github.com/aspnet/Logging/blob/2d2f31968229eddb57b6ba3d34696ef366a6c71b/src/Microsoft.Extensions.Logging.AzureAppServices/Internal/FileLoggerProvider.cs

using Infrastructure.Traces.RollingFile.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Traces.RollingFile
{
	/// <summary>
	/// An <see cref="ILoggerProvider" /> that writes logs to a file
	/// </summary>
	[ProviderAlias("File")]
	public class FileProvider : BatchingProvider
	{
		private readonly string _path;
		private readonly string _fileName;
		private readonly string _extension;
		private readonly int? _maxFileSize;
		private readonly int? _maxRetainedFiles;
		private readonly PeriodicityOptions _periodicity;

		/// <summary>
		/// Creates an instance of the <see cref="FileProvider" /> 
		/// </summary>
		/// <param name="options">The options object controlling the logger</param>
		public FileProvider(IOptionsMonitor<FileOptions> options) : base(options)
		{
			var loggerOptions = options.CurrentValue;
			_path = loggerOptions.LogDirectory;
			_fileName = loggerOptions.FileName;
			_extension = loggerOptions.Extension;
			_maxFileSize = loggerOptions.FileSizeLimit;
			_maxRetainedFiles = loggerOptions.RetainedFileCountLimit;
			_periodicity = loggerOptions.Periodicity;
		}

		/// <inheritdoc />
		protected override async Task WriteMessagesAsync(IEnumerable<TraceMessage> messages, CancellationToken cancellationToken)
		{
			Directory.CreateDirectory(_path);

			foreach (var group in messages.GroupBy(GetGrouping))
			{
				var fullName = GetFullName(group.Key);
				var fileInfo = new FileInfo(fullName);
				if (_maxFileSize > 0 && fileInfo.Exists && fileInfo.Length > _maxFileSize)
				{
					return;
				}

				using var streamWriter = File.AppendText(fullName);
				foreach (var item in group)
				{
					await streamWriter.WriteAsync(item.Message);
				}
			}

			RollFiles();
		}

		private string GetFullName((int Year, int Month, int Day, int Hour, int Minute) group)
		{
			return _periodicity switch
			{
				PeriodicityOptions.Minutely => Path.Combine(_path, $"{_fileName}{group.Year:0000}{group.Month:00}{group.Day:00}{group.Hour:00}{group.Minute:00}.{_extension}"),
				PeriodicityOptions.Hourly => Path.Combine(_path, $"{_fileName}{group.Year:0000}{group.Month:00}{group.Day:00}{group.Hour:00}.{_extension}"),
				PeriodicityOptions.Daily => Path.Combine(_path, $"{_fileName}{group.Year:0000}{group.Month:00}{group.Day:00}.{_extension}"),
				PeriodicityOptions.Monthly => Path.Combine(_path, $"{_fileName}{group.Year:0000}{group.Month:00}.{_extension}"),
				_ => throw new InvalidDataException("Invalid periodicity"),
			};
		}

		private (int Year, int Month, int Day, int Hour, int Minute) GetGrouping(TraceMessage message)
		{
			return (message.Timestamp.Year, message.Timestamp.Month, message.Timestamp.Day, message.Timestamp.Hour, message.Timestamp.Minute);
		}

		/// <summary>
		/// Deletes old log files, keeping a number of files defined by <see cref="FileOptions.RetainedFileCountLimit" />
		/// </summary>
		protected void RollFiles()
		{
			if (_maxRetainedFiles > 0)
			{
				var files = new DirectoryInfo(_path)
					.GetFiles(_fileName + "*")
					.OrderByDescending(f => f.Name)
					.Skip(_maxRetainedFiles.Value);

				foreach (var item in files)
				{
					item.Delete();
				}
			}
		}
	}
}
