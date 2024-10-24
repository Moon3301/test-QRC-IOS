namespace Infrastructure.Traces.RollingFile.Internal
{
	public struct TraceMessage
	{
		public DateTimeOffset Timestamp { get; set; }
		public string Message { get; set; }
	}
}
