using System.ComponentModel;
using System.Runtime.InteropServices;

namespace Domain
{
	public class Measurement : Entity
	{
		public string Descr { get; protected set; } = string.Empty;
		public Measurement() { }
		public Measurement(int id, string descr)
		{
			Id = id;
			Descr = descr;
		}
	}

	public class MeasurementStep : Entity
	{
		public string Descr { get; protected set; } = string.Empty;
		public int MeasurementId { get; protected set; }
		public MeasurementStep() { }

		public MeasurementStep(int id, string descr, int measurementId)
		{
			Id = id;
			Descr = descr;
			MeasurementId = measurementId;
		}
	}






	public class MeasurementView : View
	{
		public string Descr { get; set; }
		public bool Associated { get; set; }
		public int MaintenanceId { get; set; }
		public int MeasurementId { get; set; }
		public string MeasurementDescr { get; set; }
		public int? MeasurementPartId { get; set; }
		public string? MeasurementPartDescr { get; set; }
		public int MeasurementStepId { get; set; }
		public string MeasurementStepDescr { get; set; }
		public decimal? MeasurementValue { get; set; }
		public List<MeasurementStepView> Steps { get; set; } = new List<MeasurementStepView>();
		public List<MeasurementPartView> Parts { get; set; } = new List<MeasurementPartView>();

		public MeasurementView() { }
	}

	public class MeasurementPartView : View
	{
		public string Descr { get; set; } = string.Empty;
		public decimal? MeasurementValue { get; set; }
		public List<MeasurementStepView> Steps { get; set; } = new List<MeasurementStepView>();

		public MeasurementPartView() { }
	}

	public class MeasurementStepView : View
	{
		public string Descr { get; set; }
		public decimal? MeasurementValue { get; set; }


		public MeasurementStepView() { }
	}
}
