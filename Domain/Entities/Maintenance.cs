using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public enum MaintenanceStatus
    {
        Selecciona,
		Asignada,
		Iniciada,
		Acceso,
        Repuesto,
        Finalizada,
	}

    
    public class Maintenance: Entity
    {
        public int EquipmentId { get; init; }
		public string SupervisorId { get; init; }
		public string SupervisorName { get; init; }

		public string TechnicianId { get; init; }
		public string TechnicianName { get; init; }

		public string HelperId { get; init; }
		public string HelperName { get; init; }


        public DateTime Programmed { get; protected set; }
		public DateTime? Finished { get; protected set; }
		public MaintenanceStatus Status { get; protected set; }
		public string? Observation { get; protected set; }
		public bool ObservationVisibleInPdf { get; set; } = false;
		public string? Images { get; set; } = string.Empty;

		public Maintenance() { }
        public Maintenance(MaintenanceView view)
        {
            EquipmentId = view.EquipmentId; 
            TechnicianId = view.TechnicianId; 
            HelperId = view.HelperId;
            var last = (view.LastMaintenance == null || view.LastMaintenance.Value.Year < 2000) ? DateTime.UtcNow.AddDays((double)view.EquipmentCalendar * -1) : view.LastMaintenance;
            Programmed = last.Value.AddDays((double)view.EquipmentCalendar);
            Finished = null; 
            Status = MaintenanceStatus.Asignada;
        }

        public void Finish()
        { 
            Finished = DateTime.UtcNow; 
            Status = MaintenanceStatus.Finalizada;
        }		
	}

	public class MaintenanceFilter
	{
		public int Id { get; set; } = 0;
		public int EquipmentId { get; set; } = 0;
		public int OrganizationId { get; set; } = 0;
		public int CategoryId { get; set; } = 0;
		public string PhysicalFile { get; set; } = string.Empty;
		public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Selecciona;
		public int Month { get; set; } = 0;
		public int Year { get; set; } = 0;

	}

	public class MaintenanceLabor : Entity
	{
		public int MaintenanceId { get; protected set; }
		public int LaborId { get; protected set; }
		public bool Finished { get; protected set; } = false;

		public MaintenanceLabor() { }
	}
	public class MaintenanceMeasurement : Entity
	{
		public int MaintenanceId { get; protected set; }
		public int MeasurementId { get; protected set; }
		public string MeasurementDescr { get; protected set; }
		public int? PartId { get; protected set; }
		public string? PartDescr { get; protected set; }
		public int MeasurementStepId { get; protected set; }
		public string MeasurementStepDescr { get; protected set; }
		public decimal? MeasurementValue { get; protected set; }
		public MaintenanceMeasurement() { }
	}

	//public class MaintenanceFilter : View
	//{
	//	public DateTime From { get; set; }
	//	public DateTime To { get; set; }
	//	public int EquipmentId { get; set; }
	//	public string SupervisorId { get; set; } = string.Empty;
	//	public string TechnicianId { get; set; } = string.Empty;
	//	public string HelperId { get; set; } = string.Empty;

	//	public MaintenanceStatus Status { get; set; }


	//	public MaintenanceFilter()
	//	{
	//	}

	//}



	public class MaintenanceView : View
	{
		public DateTime From { get; set; }
		public DateTime To { get; set; }
		public int EquipmentId { get; set; }

		public string SupervisorId { get; set; } = string.Empty;
		public string SupervisorName { get; set; }


		public string TechnicianId { get; set; } = string.Empty;
		public string TechnicianName { get; set; }


		public string HelperId { get; set; } = string.Empty;
		public string HelperName { get; set; }

		public MaintenanceStatus Status { get; set; }

		[DataType(DataType.Date)]
		public DateTime Programmed { get; set; }

		[DataType(DataType.Date)]
		public DateTime? Finished { get; set; }

		public EquipmentCalendar EquipmentCalendar { get; set; }
		public DateTime? LastMaintenance { get; set; }

		public string? Observation { get; set; } = string.Empty;
		public bool ObservationVisibleInPdf { get; set; } = false;
		public string Category { get; set; } = string.Empty;
		public string Serial { get; set; } = string.Empty;
		public EquipmentItem Equipment { get; set; }
		public ICollection<LaborView> Labor { get; set; } = new List<LaborView>();
		public ICollection<MeasurementView> Measurement { get; set; } = new List<MeasurementView>();
		public string? Images { get; set; } = string.Empty;

		public MaintenanceView()
		{
		}


		public MaintenanceView(Maintenance entity)
		{
			Change(entity);
		}



		public void Change(Maintenance entity)
		{
			TechnicianId = entity.TechnicianId;
			HelperId = entity.HelperId;
			Programmed = entity.Programmed;
			Finished = entity.Finished;
			Status = entity.Status;
		}

	}

}
