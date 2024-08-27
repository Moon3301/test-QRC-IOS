using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
	public class Part : Entity
	{
		public int MeasurementId { get; protected set; }
		public string Descr { get; protected set; }

		public Part() { }

		public Part(int id, string descr, int measurementId, bool triphasic = false)
		{
			Id = id;
			Descr = descr;
			MeasurementId = measurementId;
		}
	}

	public class PartView : View
	{
		public string Descr { get; set; }
		public bool Associated { get; set; }

		public int PartId { get; set; }
		public int EquipmentId { get; set; }

		public decimal NominalValue { get; set; }
		public PartView()
		{

		}
	}
	public class PartUpdateParameters
	{
		public int Id { get; set; }
		public int PartId { get; set; }
		public decimal NominalValue { get; set; }
	}
	

}
