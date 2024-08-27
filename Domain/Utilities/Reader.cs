using Domain;
using System.Data.Common;
using System.Data;
using Microsoft.AspNetCore.Identity;
namespace Domain

{
    public static partial class Reader
    {
        public static async Task<IReadOnlyCollection<EquipmentItem>> EquipmentCollection(DbDataReader reader)
        {
            var items = new List<EquipmentItem>();
            while (await reader.ReadAsync())
            {
                items.Add(Equipment(reader));
            }
            return items;
        }

		public static EquipmentItem Equipment(DbDataReader reader)
        {
            EquipmentItem item = new()
            {
                Id = ReadInteger(reader, "Id"),
                QR = ReadInteger(reader, "QR"),
                CategoryId = ReadShort(reader, "CategoryId"),
                Category = ReadString(reader, "Category"),
                OrganizationId = ReadShort(reader, "OrganizationId"),
                Organization = ReadString(reader, "Organization"),
                Building = ReadString(reader, "Building"),
                Tower = ReadString(reader, "Tower"),
                Asset = ReadString(reader, "Asset"),
                Descr = ReadString(reader, "Descr"),
                Location = ReadString(reader, "Location"),
                Priority = ReadPriority(reader, "Priority"),
                Shift = ReadShift(reader, "Shift"),
                Calendar = ReadCalendar(reader, "Calendar"),
                Brand = ReadString(reader, "Brand"),
                Model = ReadString(reader, "Model"),
                Serial = ReadString(reader, "Serial"),
                LastMaintenance = ReadDateTime(reader, "LastMaintenance"),
                Programmed = ReadDateTime(reader, "Programmed"),
                HasObservation = ReadBoolean(reader, "HasObservation"),
                Images = ReadString(reader, "Images"),
                Accreditation = ReadBoolean(reader, "Accreditation")
            };
            return item;
        }

        public static MaintenanceView Maintenance(DbDataReader reader)
        {
            return new()
            {
                Id = ReadInteger(reader, "Id"),
                EquipmentId = ReadInteger(reader, "EquipmentId"),
                SupervisorId = ReadString(reader, "SupervisorId"),
                SupervisorName = ReadString(reader, "SupervisorName"),
                TechnicianId = ReadString(reader, "TechnicianId"),
                TechnicianName = ReadString(reader, "TechnicianName"),
                HelperId = ReadString(reader, "HelperId"),
                HelperName = ReadString(reader, "HelperName"),
                Programmed = ReadDateTime(reader, "Programmed"),
                Finished = ReadDateTime(reader, "Finished"),
                Status = ReadStatus(reader, "Status"),
                Observation = ReadString(reader, "Observation"),
                Images = ReadString(reader, "Images"),
                ObservationVisibleInPdf = ReadBoolean(reader, "ObservationVisibleInPdf"),
                Equipment = Equipment(reader)
            };
        }

        public static LaborView Labor(DbDataReader reader)
        {
            return new()
            {
                Id = ReadInteger(reader, "Id"),
                Descr = ReadString(reader, "Descr"),
                Finished = ReadBoolean(reader, "Finished"),
				Accreditation = ReadBoolean(reader, "Accreditation"),
				MaintenanceId = ReadInteger(reader, "MaintenanceId"),
			};
        }

        public static MeasurementView Measurement(DbDataReader reader)
        {
            return new()
            {
                Id = ReadInteger(reader, "Id"),
                MaintenanceId = ReadInteger(reader, "MaintenanceId"),
                MeasurementId = ReadInteger(reader, "MeasurementId"),
                MeasurementDescr = ReadString(reader, "MeasurementDescr"),
                MeasurementPartId = ReadInteger(reader, "PartId"),
                MeasurementPartDescr = ReadString(reader, "PartDescr"),
                MeasurementStepId = ReadInteger(reader, "MeasurementStepId"),
                MeasurementStepDescr = ReadString(reader, "MeasurementStepDescr"),
                MeasurementValue = ReadDecimal(reader, "MeasurementValue")
            };
        }

        public static MaintenanceView MaintenanceSimplified(DbDataReader reader)
        {
            return new()
            {
                Id = ReadInteger(reader, "Id"),
                EquipmentId = ReadInteger(reader, "EquipmentId"),
                SupervisorName = ReadString(reader, "SupervisorName"),
                TechnicianName = ReadString(reader, "TechnicianName"),
                Observation = ReadString(reader, "Observation"),
                Programmed = ReadDateTime(reader, "Programmed"),
                Finished = ReadDateTime(reader, "Finished"),
                Status = ReadStatus(reader, "Status"),
                Equipment = new()
                {
                    Id = ReadInteger(reader, "EquipmentId"),
                    Serial = ReadString(reader, "Serial"),
                    Category = ReadString(reader, "Category"),
                    Descr = ReadString(reader, "Descr"),
                    Location = ReadString(reader, "Location"),

                }
            };
        }


        public static Position ReadPosition(IDataReader reader, string columnName)
        {
            object data = ReadColumn(reader, columnName);
            return ((data == null) || (data == DBNull.Value)) ? 0 : (Position)Enum.Parse(typeof(Position), data.ToString());
        }

        public static Shift ReadShift(IDataReader reader, string columnName)
        {
            object data = ReadColumn(reader, columnName);
            return ((data == null) || (data == DBNull.Value)) ? 0 : (Shift)Enum.Parse(typeof(Shift), data.ToString());
        }

        public static Priority ReadPriority(IDataReader reader, string columnName)
        {
            object data = ReadColumn(reader, columnName);
            return ((data == null) || (data == DBNull.Value)) ? 0 : (Priority)Enum.Parse(typeof(Priority), data.ToString());
        }

        public static EquipmentCalendar ReadCalendar(IDataReader reader, string columnName)
        {
            object data = ReadColumn(reader, columnName);
            return ((data == null) || (data == DBNull.Value)) ? 0 : (EquipmentCalendar)Enum.Parse(typeof(EquipmentCalendar), data.ToString());
        }

        public static MaintenanceStatus ReadStatus(IDataReader reader, string columnName)
        {
            object data = ReadColumn(reader, columnName);
            return ((data == null) || (data == DBNull.Value)) ? 0 : (MaintenanceStatus)Enum.Parse(typeof(MaintenanceStatus), data.ToString());
        }




        private static bool ColumnExists(IDataReader reader, string name)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(name, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }

        private static object? ReadColumn(IDataReader reader, string name)
        {
            if (ColumnExists(reader, name))
                return reader[name];
            else
                return null;
        }

        public static decimal? ReadDecimal(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data == null) || (data == DBNull.Value)) ? null : Convert.ToDecimal(data);
        }


        public static double ReadDouble(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data == null) || (data == DBNull.Value)) ? 0 : Convert.ToDouble(data);
        }


        public static string ReadString(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return (data == null || data == DBNull.Value) ? string.Empty : Convert.ToString(data);
        }

        public static bool ReadBoolean(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data != null) && (data != DBNull.Value)) && Convert.ToBoolean(data);
        }


        public static int ReadInteger(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data == null) || (data == DBNull.Value)) ? 0 : Convert.ToInt32(data);
        }

        public static long ReadLong(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data == null) || (data == DBNull.Value)) ? 0 : Convert.ToInt64(data);
        }


        public static byte ReadByte(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data == null) || (data == DBNull.Value)) ? (byte)0 : Convert.ToByte(data);
        }


        public static short ReadShort(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data == null) || (data == DBNull.Value)) ? (short)0 : Convert.ToInt16(data);
        }

        public static DateTime ReadDateTime(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            return ((data == null) || (data == DBNull.Value)) ? DateTime.MinValue : Convert.ToDateTime(data);
        }


        public static Guid ReadGuid(IDataReader reader, string name)
        {
            object? data = ReadColumn(reader, name);
            if (data == null || data == DBNull.Value)
            {
                return Guid.Empty;
            }
            else
            {
                return Guid.TryParse(data.ToString(), out Guid result) ? result : Guid.Empty;
            }
        }



    }

    public static class DataReaderExtensions
    {
        public static bool ColumnExists(this IDataReader reader, string name)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(name, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }

        private static object? ReadColumn(this IDataReader reader, string name)
        {
            if (reader.ColumnExists(name))
                return reader[name];
            else
                return null;
        }

        public static decimal ReadDecimal(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data == null) || (data == DBNull.Value)) ? 0 : Convert.ToDecimal(data);
        }

        public static double ReadDouble(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data == null) || (data == DBNull.Value)) ? 0 : Convert.ToDouble(data);
        }
		public static Position ReadPosition(this IDataReader reader, string columnName)
		{
			object data = ReadColumn(reader, columnName);
			return ((data == null) || (data == DBNull.Value)) ? 0 : (Position)Enum.Parse(typeof(Position), data.ToString());
		}

		public static string ReadString(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return (data == null || data == DBNull.Value) ? string.Empty : Convert.ToString(data);
        }

        public static bool ReadBoolean(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data != null) && (data != DBNull.Value)) && Convert.ToBoolean(data);
        }

        public static int ReadInteger(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data == null) || (data == DBNull.Value)) ? 0 : Convert.ToInt32(data);
        }

        public static long ReadLong(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data == null) || (data == DBNull.Value)) ? 0 : Convert.ToInt64(data);
        }

        public static byte ReadByte(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data == null) || (data == DBNull.Value)) ? (byte)0 : Convert.ToByte(data);
        }

        public static short ReadShort(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data == null) || (data == DBNull.Value)) ? (short)0 : Convert.ToInt16(data);
        }

        public static DateTime ReadDateTime(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            return ((data == null) || (data == DBNull.Value)) ? DateTime.MinValue : Convert.ToDateTime(data);
        }

        public static Guid ReadGuid(this IDataReader reader, string name)
        {
            object? data = reader.ReadColumn(name);
            if (data == null || data == DBNull.Value)
            {
                return Guid.Empty;
            }
            else
            {
                return Guid.TryParse(data.ToString(), out Guid result) ? result : Guid.Empty;
            }
        }
    }


}
