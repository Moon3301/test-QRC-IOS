using Domain.Interfaces;
using Domain.Services;
using Domain;
using Mapster;
using System.Data.Common;
using System.Diagnostics.Metrics;
using System.Drawing;

namespace Domain.Services
{
    public class EquipmentService(IDatabaseUnit unit, IDatabaseCommand command) : Service(unit, command), IEquipmentService
    {
        public async Task<IReadOnlyCollection<SelectResult>> PhysicalFileAutocomplete(string search, CancellationToken token = default)
        {
            return await _command.ReadCollection<SelectResult>("PhysicalFileAutocomplete", new { search }, null, token);
        }


        public async Task<LabelView> Label(int equipmentId, CancellationToken token)
        {
            object parameters = new { equipmentId };
            using var reader = await _command.ExecuteReader("EquipmentLabel", parameters, null, token);

            await reader.ReadAsync(token);
            return new LabelView()
            {
                Equipment = Reader.Equipment(reader),
                Organization = new OrganizationView()
                {
                    ManagerPhone = Reader.ReadString(reader, "ManagerPhone"),
                    SupervisorPhone = Reader.ReadString(reader, "SupervisorPhone"),
                }
            };
        }

        public async Task<int> Create(EquipmentItem view, CancellationToken token = default)
        {
            int last = (int) await _command.ExecuteScalar("EquipmentReadLastQR");
            view.QR = last + 1;

            Equipment entity = new(view);
            await _database.Equipment.CreateAsync(entity, true, token);
            return entity.Id;
        }

        public async Task<int> Update(EquipmentItem view, CancellationToken token)
        {
            Equipment entity = await _database.Equipment.GetAsync(view.Id, token);

            if (entity != null && view.Calendar != entity.Calendar)
            {
                var parameters = new
                {
                    EquipmentId = view.Id,
                    view.Calendar
                };
                await _command.ExecuteNonQuery("CalendarChange", parameters, token);
            }

            view.Adapt(entity);

            await _database.Equipment.UpdateAsync(entity, true, token);
            return entity.Id;
        }

        public async Task Delete(EquipmentFilter filter, CancellationToken token = default)
        {
            await _command.ExecuteNonQuery("EquipmentDelete", filter, token);
        }

        public async Task<EquipmentItem> ViewById(int id, CancellationToken token = default)
        {
            return new EquipmentItem(await _database.Equipment.GetAsync(id, token));
        }

        public async Task<PaginatedResult<EquipmentItem>> Filter(EquipmentFilter input, Pagination? paging = null, CancellationToken token = default)
        {
            var result = await _command.ReadPage<EquipmentItem>("EquipmentFilter", input, paging, Reader.EquipmentCollection, token);
            result.Pages.Entity = "Equipment";
            return result;
        }

        public async Task<HistoryView> HistoryQR(int qr, Pagination pages, CancellationToken token = default)
        {
            int id = (int)await _command.ExecuteScalar("EquipmentReadIdByQR", new { qr }, token);
            return await History(id, pages);
        }

        public async Task<HistoryView> History(int id, Pagination pages, CancellationToken token = default)
        {
            var result = new PaginatedResult<MaintenanceView>();
            result.Pages.Entity = "Maintenance";
            result.Pages.PageIndex = pages.PageIndex;

            List<MaintenanceView> items = [];

            using var reader = await _command.ExecuteReader("EquipmentHistory", new { id }, pages, token);

            await reader.ReadAsync(token);
            var equipment = Reader.Equipment(reader);
            await reader.NextResultAsync(token);

            await reader.ReadAsync(token);
            result.Pages.PageCount = (int)reader[0];
            await reader.NextResultAsync(token);

            while (await reader.ReadAsync(token))
            {
                items.Add(Reader.MaintenanceSimplified(reader));
            }
            result.Items = items;
            return new HistoryView()
            {
                Equipment = equipment,
                Maintenances = new PaginatedResult<MaintenanceView>()
                {
                    Items = items,
                    Pages = pages
                }
            };
        }

        public async Task<HistoryView> EquipmentPrint(int id, CancellationToken token = default)
        {
            var pages = new Pagination()
            {
                PageIndex = 1,
                PageSize = 100
            };
            return await History(id, pages, token);
        }

        public async Task<HistoryView> MonthHistory(int month, int year, Pagination pages, CancellationToken token = default)
        {
			var result = new PaginatedResult<MaintenanceView>
			{
				Pages = pages
			};
			result.Pages.Entity = "Maintenance";

            List<MaintenanceView> items = [];
            using var reader = await _command.ExecuteReader("MonthHistory", new { month, year }, null, token);

            while (await reader.ReadAsync(token))
            {
                items.Add(Reader.MaintenanceSimplified(reader));
            }
            result.Items = items;
            return new HistoryView()
            {
                Maintenances = result
            };
        }


        public async Task<HistoryView> MonthPrint(int month, int year, CancellationToken token = default)
        {
            var pages = new Pagination()
            {
                PageIndex = 1,
                PageSize = 1000
            };
            return await MonthHistory(month, year, pages, token);
        }

        public async Task<IReadOnlyCollection<PartView>> PartCollection(int categoryId, int equipmentId = 0, CancellationToken token = default)
        {
            var parameters = new { categoryId, equipmentId };
            return await _command.ReadCollection<PartView>("EquipmentPartCollection", parameters);
        }


        public async Task PartUpdate(int EquipmentId, int PartId, decimal NominalValue, CancellationToken token = default)
        {
            await _command.ExecuteNonQuery("EquipmentPartUpdate", new { EquipmentId, PartId, NominalValue }, token);
        }
    }
}
