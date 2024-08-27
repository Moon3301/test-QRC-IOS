namespace Domain.Interfaces
{
	public interface IMaintenanceService
	{
		Task Create(EquipmentFilter filter, string supervisorId, string technicianId, string helperId, DateTime? programmed = null);
		//Task Delete(EquipmentFilter equipment, MaintenanceStatus status, int maintenanceId = 0);
		Task<PaginatedResult<MaintenanceView>> Filter(MaintenanceFilter filter, Pagination pages, CancellationToken token = default);
		Task LaborUpdate(int id, int maintenanceId, bool finished);
		Task MeasurementUpdate(int id, decimal value);
		Task ObservationUpdate(int id, string observation);
		Task<Graphic> StatusGraphic(GraphicFilter filter);
		Task<Graphic> PriorityGraphic(GraphicFilter filter);
		Task StatusUpdate(int id, MaintenanceStatus status);
		Task<MaintenanceView> ViewById(int id);
		Task<Work> Work(int id);
		Task<Work> WorkQR(int qr);
		Task VisibleInPdfUpdate(int id, bool visible);
		Task Finish(int id, int equipmentId);
		Task<PrintView> Print(int maintenanceId);
        Task<ICollection<int>> FilterPrint(MaintenanceFilter filter);
		Task ImagesUpdate(int id, string image);
	}
}