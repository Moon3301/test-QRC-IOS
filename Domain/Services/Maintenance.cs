using Domain.Interfaces;
using System.Data.Common;

namespace Domain.Services
{
	public class MaintenanceService : Service, IMaintenanceService
	{
		public MaintenanceService(IDatabaseUnit unit, IDatabaseCommand command) : base(unit, command)
		{
		}

		public async Task<Graphic> StatusGraphic(GraphicFilter filter)
		{
            var parameters = new { 
				organizationId = filter.OrganizationId,
                month = filter.Month,
                year = filter.Year,
                shift = filter.Shift
            };
            using var reader = await _command.ExecuteReader("StatusGraphic", parameters);
            await reader.ReadAsync();
            return new Graphic()
            {
                Finished = Convert.ToInt32(reader["Finished"]),
                Pending = Convert.ToInt32(reader["Pending"])
            };
        }
		public async Task<Graphic> PriorityGraphic(GraphicFilter filter)
		{
            var parameters = new
            {
                organizationId = filter.OrganizationId,
                month = filter.Month,
                year = filter.Year,
                shift = filter.Shift
            };
            using var reader = await _command.ExecuteReader("PriorityGraphic", parameters);

            var view = new Graphic()
            {
                FinishedPriority = [],
                PendingPriority = []
            };
            while (await reader.ReadAsync())
            {
                view.FinishedPriority.Add((int)reader["Quantity"]);
            }
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                view.PendingPriority.Add((int)reader["Quantity"]);
            }
            return view;
        }

		public async Task<MaintenanceView> ViewById(int id)
		{
			return new MaintenanceView(await _database.Maintenance.GetAsync(id));
		}

		public async Task Create(EquipmentFilter filter, string supervisorId, string technicianId, string helperId, DateTime? programmed = null)
		{
			var parameters = new
			{
				filter,
				supervisorId,
				technicianId,
				helperId,
				programmed
			};
            await _command.ExecuteNonQuery("MaintenanceCreate", parameters);
        }

		public async Task<PaginatedResult<MaintenanceView>> Filter(MaintenanceFilter filter, Pagination pages, CancellationToken token = default)
		{
            var result = new PaginatedResult<MaintenanceView>();
            result.Pages.Entity = "Maintenance";
            result.Pages.PageIndex = pages.PageIndex;

            List<MaintenanceView> items =[];

            using var reader = await _command.ExecuteReader("MaintenanceFilter", filter, pages, token);
            await reader.ReadAsync();
            result.Pages.PageCount = (int)reader[0];

            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                items.Add(Reader.MaintenanceSimplified(reader));
            }
            result.Items = items;
            return result;
        }

        public async Task<Work> Work(int id)
		{
            Work work = new() { Id = id };

            using var reader = await _command.ExecuteReader("MaintenanceWork", new { id });

            await reader.ReadAsync();
            work.Maintenance = Reader.Maintenance(reader);

            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                work.Labor.Add(Reader.Labor(reader));
            }

            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                work.Measurement.Add(Reader.Measurement(reader));
            }
            return work;
        }

		public async Task<Work> WorkQR(int qr)
		{
            var maintenanceId = await _command.ExecuteScalar("MaintenanceIdByQR", new { qr });
            maintenanceId ??= 0;
            return await Work((int)maintenanceId);
        }

        public async Task<ICollection<int>> FilterPrint(MaintenanceFilter filter)
        {
            using var reader = await _command.ExecuteReader("MaintenanceFilterPrint", filter );

            List<int> maintenances = [];
            while (await reader.ReadAsync())
            {
                maintenances.Add(reader.GetInt32(0));
            }

            return maintenances;
        }

        public async Task<PrintView> Print(int maintenanceId)
		{
            using var reader =
                await _command.ExecuteReader("MaintenancePrint", new { maintenanceId });

            PrintView item = new();
            while (await reader.ReadAsync())
            {
                item.Maintenance = Reader.Maintenance(reader);
            }
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                item.LaborCollection.Add(Reader.Labor(reader));
            }
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                item.MeasurementCollection.Add(Reader.Measurement(reader));
            }
            ;
            item.ConvertToHierarchy();
			return item;
		}


		public async Task StatusUpdate(int id, MaintenanceStatus status)
		{
			var parameters = new { id, status };
			await _command.ExecuteNonQuery("MaintenanceStatusUpdate", parameters);
		}

		public async Task VisibleInPdfUpdate(int id, bool visible)
		{
			var parameters = new { id, visible };
			await _command.ExecuteNonQuery("ObservationVisibleInPdfUpdate", parameters);
		}

		public async Task Finish(int id, int equipmentId)
		{
			var parameters = new { id, equipmentId };
			await _command.ExecuteNonQuery("MaintenanceFinish", parameters);
		}

		public async Task LaborUpdate(int id, int maintenanceId, bool finished)
		{
			var parameters = new { id, maintenanceId, finished };
			await _command.ExecuteNonQuery("MaintenanceLaborUpdate", parameters);
		}

		public async Task MeasurementUpdate(int id, decimal value)
		{
			var parameters = new { id, value };
			await _command.ExecuteNonQuery("MaintenanceMeasurementUpdate", parameters);
		}

		public async Task ObservationUpdate(int id, string observation)
		{
			var parameters = new { id, observation };
			await _command.ExecuteNonQuery("MaintenanceObservationUpdate", parameters);
		}

		public async Task ImagesUpdate(int id, string image)
		{
			var parameters = new { id, image };
			await _command.ExecuteNonQuery("MaintenanceImagesUpdate", parameters);
		}

		//public async Task Delete(EquipmentFilter equipment, MaintenanceStatus status, int maintenanceId = 0)
		//{
		//	await _database.EquipmentRepository.MaintenanceDelete(equipment, status, maintenanceId);
		//}
	}
}
