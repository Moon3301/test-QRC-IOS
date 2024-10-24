using Mapster;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    public enum EquipmentCalendar
    {
		Selecciona = 0,
        Quincenal = 15,
        Mensual = 1,
		Bimestral = 2,
        Trimestral = 3,
        Cuatrimestral = 4,
        Semestral =6,
        Anual = 12
    }

    public enum Shift
    {
		Selecciona,
		DIA,
        NOCHE
    }

    public enum Priority
    {
		Selecciona = 0,
        UNO = 1,
        DOS = 2,
        TRES = 3,
		CUATRO = 4
    }

    public class Equipment: Entity
    {
        public Equipment() { }

        public Equipment(int id): base(id) { }
		public int QR { get; protected set; }

		public short OrganizationId { get; protected set; } = 0;
		public short BuildingId { get; protected set; } = 0;
		public short TowerId { get; protected set; } = 0;

		public Shift Shift { get; protected set; } = Shift.Selecciona;
		public Priority Priority { get; protected set; } = Priority.Selecciona;
		public short CategoryId { get; protected set; } = 0;


		public string? Descr { get; protected set; } = "";
		public string? Location { get; protected set; } = "";
		public string? PhysicalFile { get; protected set; } = "";

		public string? Asset { get; protected set; } = "";
		public string? Brand { get; protected set; } = "";
		public string? Model { get; protected set; } = "";
		public string? Serial { get; protected set; } = "";

		public bool Accreditation { get; protected set; } = false;

		public EquipmentCalendar Calendar { get; protected set; } = 0;

		[DataType(DataType.Date)]
		[DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
		public DateTime? LastMaintenance { get; protected set; } = null;
		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public DateTime? NextMaintenance { get; private set; } = null;
		public bool Deleted { get; protected set; } = false;

		public List<EquipmentPart> Parts { get; set; } = [];


		public Equipment(EquipmentItem view)
		{
			view.Adapt(this);
		}

		public void Change(Equipment entity)
		{
			Asset = entity.Asset;
			Brand = entity.Brand;
			Calendar = entity.Calendar;
			Descr = entity.Descr;
			Model = entity.Model;
			Serial = entity.Serial;
			Location = entity.Location;
			Shift = entity.Shift;
			Priority = entity.Priority;
			LastMaintenance = LastMaintenance;
			Parts = entity.Parts;
		}
	}

	public class EquipmentPart : Entity
	{
		public int EquipmentId { get; protected set; }
		public int PartId { get; protected set; }
		public decimal NominalValue { get; protected set; }

		public EquipmentPart() { }
		public EquipmentPart(int partId, decimal nominalValue) 
		{
			PartId = partId;
			NominalValue = nominalValue;
		}
	}

	public class EquipmentFilter
	{
		public int Id { get; set; } = 0;
		public int OrganizationId { get; set; } = 0;
		public Priority Priority { get; set; } = Priority.Selecciona;
		public Shift Shift { get; set; } = Shift.Selecciona;
		public int CategoryId { get; set; } = 0;
		public EquipmentCalendar Calendar { get; set; } = EquipmentCalendar.Selecciona;
		public string Asset { get; set; } = "";
		public string? Descr { get; set; } = "";
		public string? Location { get; set; } = "";
		public string? PhysicalFile { get; set; } = "";
		public string Serial { get; set; } = "";
		public string Brand { get; set; } = "";
		public string Model { get; set; } = "";
		public bool Accreditation { get; set; } = false;
		public int Month { get; set; } = 0;

		public EquipmentFilter()
		{
		}

	}

	public class EquipmentItem : View
	{
		public int QR { get; set; }
		public short OrganizationId { get; set; } = 0;
		public short BuildingId { get; set; } = 0;
		public short TowerId { get; set; } = 0;

		public string? Organization { get; set; } = "";
		public string? Building { get; set; } = "";
		public string? Tower { get; set; } = "";

		public Shift Shift { get; set; } = Shift.Selecciona;
		public Priority Priority { get; set; } = Priority.Selecciona;
		public short CategoryId { get; set; } = 0;
		public string? Category { get; set; } = "";
		public string? Descr { get; set; } = "";
		public string? Location { get; set; } = "";
		public string? PhysicalFile { get; set; } = "";
		public string? Asset { get; set; } = "";
		public string? Serial { get; set; } = "";
		public string? Brand { get; set; } = "";
		public string? Model { get; set; } = "";
		public bool Accreditation { get; set; } = false;
		public bool HasObservation { get; set; } = false;
		public bool Deleted { get; set; } = false;
		public EquipmentCalendar Calendar { get; set; } = 0;
		public DateTime? LastMaintenance { get; set; } = null;
		public DateTime? Programmed { get; set; } = null;

		public string? Images { get; set; } = "";
		public bool HasImages { get { return !string.IsNullOrEmpty(Images); } }

        public EquipmentItem()
		{
		}

		public EquipmentItem(Equipment entity)
		{
			entity.Adapt(this);
		}
	}



}
