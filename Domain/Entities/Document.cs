using Domain;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{

	public class HistoryView
	{
		public EquipmentItem Equipment { get; set; }
		public PaginatedResult<MaintenanceView> Maintenances { get; set; } = new PaginatedResult<MaintenanceView>();
		public string BaseUrl { get; set; }
	}
	public class PrintView
	{
		public int MaintenanceId { get; set; }
		public ICollection<MaintenanceView> MaintenanceCollection { get; set; } = new List<MaintenanceView>();
		public ICollection<LaborView> LaborCollection { get; set; } = new List<LaborView>();
		public ICollection<MeasurementView> MeasurementCollection { get; set; } = new List<MeasurementView>();
		public ICollection<MeasurementView> MeasurementHierarchy { get; set; } = new List<MeasurementView>();

		public string BaseUrl { get; set; }

		public MaintenanceView Maintenance { get; set; }

		public void ConvertToHierarchy()
		{
			foreach (var item in MeasurementCollection)
			{
				var measurement = MeasurementHierarchy.FirstOrDefault(_ => _.MeasurementId == item.MeasurementId);
				if (measurement == null)
				{
					measurement = new MeasurementView
					{
						MeasurementId = item.MeasurementId,
						MeasurementDescr = item.MeasurementDescr
					};
					MeasurementHierarchy.Add(measurement);
				}

				if (item.MeasurementPartId != 0)
				{
					var part = measurement.Parts.FirstOrDefault(_ => _.Id == item.MeasurementPartId);
					if (part == null)
					{
						part = new MeasurementPartView
						{
							Id = item.MeasurementPartId ?? 0, // Use a default value if PartId is null
							Descr = item.MeasurementPartDescr ?? string.Empty, // Use an empty string if PartDescr is null
							MeasurementValue = item.MeasurementValue
						};

						measurement.Parts.Add(part);
					}
					var step = part.Steps.FirstOrDefault(_ => _.Id == item.MeasurementStepId);
					if (step == null)
					{
						step = new MeasurementStepView
						{
							Id = item.MeasurementStepId,
							Descr = item.MeasurementStepDescr,
							MeasurementValue = item.MeasurementValue
						};
						part.Steps.Add(step);
					}
				}
				else
				{
					var step = measurement.Steps.FirstOrDefault(_ => _.Id == item.MeasurementStepId);
					if (step == null)
					{
						step = new MeasurementStepView
						{
							Id = item.MeasurementStepId,
							Descr = item.MeasurementStepDescr,
							MeasurementValue = item.MeasurementValue
						};
						measurement.Steps.Add(step);
					}
				}
			}
		}
	}

	public class LabelView
	{
		public OrganizationView Organization { get; set; }
		public EquipmentItem Equipment { get; set; }
		public string BaseUrl { get; set; }
		public LabelView() { }

	}
}


