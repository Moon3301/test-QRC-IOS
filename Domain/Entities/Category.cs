namespace Domain
{ 
	public class Category : Entity
	{
		public string Descr { get; protected set; } = string.Empty;

		public Category() { }
		public Category(string descr)
		{
			Change(descr);
		}

		
		public Category(int id, string descr)
		{
			Change(id, descr);
		}
		public void Change(string descr)
		{
			Descr = descr;
		}

		public void Change(int id, string descr)
		{
			Id = id;
			Descr = descr;
		}

		public void Change(CategoryView view)
		{
			Change(view.Id, view.Descr);
		}

		public Category(CategoryView view) 
		{
			Change(view.Id, view.Descr);
		}
	}
	public class CategoryLabor : Entity
	{
		public int CategoryId { get; protected set; }
		public int LaborId { get; protected set; }
		public int Sort { get; protected set; }
		public bool Accreditation { get; protected set; }

		public CategoryLabor() { }
	}
	public class CategoryPart : Entity
	{
		public string Descr { get; protected set; }
		public int CategoryId { get; protected set; }
		public int PartId { get; protected set; }
		public int MeasurementId { get; protected set; }
		public string MeasurementDescr { get; protected set; }
		public int Sort { get; protected set; }



		public CategoryPart() { }
	}

	public class CategoryStep : Entity
	{
		public string Descr { get; protected set; }
		public int CategoryId { get; protected set; }
		public int StepId { get; protected set; }
		public int MeasurementId { get; protected set; }
		public string MeasurementDescr { get; protected set; }
		public int Sort { get; protected set; }
		public CategoryStep()
		{ }		
	}


	public class CategoryView : View
	{
		public string Descr { get; set; } = string.Empty;
		public CategoryView()
		{
		}
		public CategoryView(Category entity)
		{
			Change(entity.Id, entity.Descr);
		}

		public CategoryView(int id, string descr)
		{
			Change(id, descr);
		}
		public void Change(int id, string descr)
		{
			Id = id;
			Descr = descr;
		}
	}

	public class CategoryStepView : View
	{
		public int CategoryId { get; set; }
		public int MeasurementId { get; set; }
		public int MeasurementStepId { get; set; }
		public string Descr { get; set; }

		public CategoryStepView() { }
	}

	public class CategoryPartView : View
	{
		public int CategoryId { get; set; }
		public int MeasurementId { get; set; }
		public int MeasurementPartId { get; set; }
		public string Descr { get; set; }

		public CategoryPartView() { }
	}


}
