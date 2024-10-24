namespace Domain
{
    public class Labor : Entity
    {
        public string Descr { get; protected set; } = string.Empty;

        public Labor() { }
        public Labor(short id, string descr) 
        { 
            var view = new LaborView() { Id = id, Descr = descr };
            Change(view);
        }
		public Labor(LaborView view) 
        {
            Change(view);
        }

        public void Change(LaborView view)
        {
            Id = view.Id;
            Descr = view.Descr;
        }

	}


	public class LaborView : View
	{
		public string Descr { get; set; }
		public bool Associated { get; set; }
		public bool Finished { get; set; }
		public int MaintenanceId { get; set; }
		public int CategoryId { get; set; }
        public bool Accreditation { get; set; }

        public LaborView()
		{
		}

		public LaborView(Labor entity)
		{
			Id = entity.Id;
			Descr = entity.Descr;
		}

	}

}
