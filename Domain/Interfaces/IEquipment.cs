namespace Domain.Interfaces
{
	public interface IEquipmentService
	{
		Task<EquipmentItem> ViewById(int id, CancellationToken token = default);
		Task<PaginatedResult<EquipmentItem>> Filter(EquipmentFilter input, Pagination? pages = null, CancellationToken token = default);
        Task<int> Create(EquipmentItem view, CancellationToken token = default);
        Task<int> Update(EquipmentItem view, CancellationToken token = default);
		Task<IReadOnlyCollection<PartView>> PartCollection(int categoryId, int equipmentId = 0, CancellationToken token = default);
		Task PartUpdate(int EquipmentId, int PartId, decimal NominalValue, CancellationToken token = default);
		Task Delete(EquipmentFilter filter, CancellationToken token = default);
		Task<LabelView> Label(int equipmentId, CancellationToken token = default);
		Task<IReadOnlyCollection<SelectResult>> PhysicalFileAutocomplete(string search, CancellationToken token = default);
		Task<HistoryView> History(int id, Pagination pages, CancellationToken token = default);
		Task<HistoryView> EquipmentPrint(int id, CancellationToken token = default);
		Task<HistoryView> MonthPrint(int month, int year, CancellationToken token = default);
		Task<HistoryView> HistoryQR(int qr, Pagination pages, CancellationToken token = default);
	}
}