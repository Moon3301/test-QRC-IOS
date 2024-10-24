
namespace Domain
{   
    public class Work : View
    {
        public MaintenanceView Maintenance { get; set; }
		public List<LaborView> Labor { get; set; }
		public List<MeasurementView> Measurement { get; set; }


		public Work()
        {
            Labor = new List<LaborView>(); 
            Measurement = new List<MeasurementView>();
        }
	}
}
