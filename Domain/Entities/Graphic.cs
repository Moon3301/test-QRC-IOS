using System.Collections.ObjectModel;

namespace Domain
{
    public class Graphic
    {
        public int Pending { get; set; }
        public int Finished { get; set; }

		public List<int> FinishedPriority { get; set; }

		public List<int> PendingPriority { get; set; }

		public int Total
        {
            get { return Pending + Finished; }
        }

        public Graphic()
        {
        }
    }

    public class GraphicFilter
    {
        public int OrganizationId { get; set; }
        public int Month { get; set; }
		public int Year { get; set; }
        public int Shift { get; set; }

		public GraphicFilter() { }

    }
}
