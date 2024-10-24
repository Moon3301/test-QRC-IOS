using Domain.Interfaces;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Memory;
using Client.Utilities;
using Domain.Services;

namespace Client.Controllers
{
	
	public class MaintenanceIndexModel
	{
		public MaintenanceFilter Input { get; set; }
        public SelectList CategorySelect { get; set; }
		public SelectList PhysicalSelect { get; set; }
		public PaginatedResult<MaintenanceView> Result { get; set; }
		public MaintenanceIndexModel(IUserAccount user, IServiceUnit service)
		{
			var credential = user.Credential().Result;

            var organization = service.Organization.Index(credential).Result.First().Id;
            CategorySelect = new SelectList(service.Category.Index(organization).Result, "Id", "Descr"); ;
			PhysicalSelect = new SelectList(service.Equipment.PhysicalFileAutocomplete("*").Result, "Id", "Descr"); ;
			Result = new() { Pages = new() { Entity = "Maintenance" } };
		}
	}

	[Route("[controller]")]
	public class Maintenance(IServiceUnit service, IUserAccount user) : SolutionController(service, user)
	{
        [HttpPost("Create")]
		public async Task<IActionResult> Create(EquipmentFilter filter, string supervisorId, string technicianId, string helperId, DateTime? programmed = null)
		{
			await _service.Maintenance.Create(filter, supervisorId, technicianId, helperId, programmed);
            MaintenanceFilter maintenanceFilter = new()
            {
                EquipmentId = filter.Id,
                PhysicalFile = filter.PhysicalFile,
                Status = MaintenanceStatus.Asignada
            };

            return await Index(maintenanceFilter);
		}

		[HttpPost("Index")]
		public async Task<IActionResult> Index(MaintenanceFilter filter, Pagination pages = null)
		{
			if (pages ==  null)
			{
				pages = new Pagination() { Entity = "Maintenance" };
            }
			var model = new MaintenanceIndexModel(_user, _service)
			{
				Input = filter,
				Result = await _service.Maintenance.Filter(filter, pages)
			};
			return PartialView("Maintenance/Index", model);
		}

		[HttpPost("Filter")]
		public async Task<IActionResult> Filter(MaintenanceFilter filter, Pagination pages)
		{
            if (pages == null)
            {
                pages = new Pagination() { Entity = "Maintenance" };
            }
            return PartialView("Maintenance/Result", await _service.Maintenance.Filter(filter, pages));
		}

		[HttpPost("Work")]
		public async Task<IActionResult> Work(int id)
		{
			return PartialView("Maintenance/Work", await _service.Maintenance.Work(id));
		}

		[HttpPost("WorkQR")]
		public async Task<IActionResult> WorkQR(int id)
		{
			return PartialView("Maintenance/Work", await _service.Maintenance.Work(id));
		}

		[HttpPost("LaborUpdate")]
		public async Task LaborUpdate(int id, int maintenanceId, bool finished)
		{
			await _service.Maintenance.LaborUpdate(id, maintenanceId, finished);
		}

		[HttpPost("MeasurementUpdate")]
		public async Task MeasurementUpdate(int id, decimal value)
		{
			await _service.Maintenance.MeasurementUpdate(id, value);
		}

		[HttpPost("ObservationUpdate")]
		public async Task ObservationUpdate(int id, string observation)
		{
			await _service.Maintenance.ObservationUpdate(id, observation);
		}

		[HttpPost("ImagesUpdate")]
		public async Task ImagesUpdate(int id, string image)
		{
			await _service.Maintenance.ImagesUpdate(id, image);
		}

		[HttpPost("StatusUpdate")]
		public async Task StatusUpdate(int id, MaintenanceStatus status)
		{
			await _service.Maintenance.StatusUpdate(id, status);
		}

		[HttpPost("VisibleInPdfUpdate")]
		public async Task VisibleInPdfUpdate(int id, bool visible)
		{
			await _service.Maintenance.VisibleInPdfUpdate(id, visible);
		}

		[HttpPost("Finish")]
		public async Task Finish(int id, int equipmentId)
		{
			await _service.Maintenance.Finish(id, equipmentId);
		}

		//[HttpPost("Delete")]
		//public async Task Delete(EquipmentFilter equipment, MaintenanceStatus status, int id)
		//{
		//	await _service.Maintenance.Delete(equipment, status, id);
		//}
	}
}
