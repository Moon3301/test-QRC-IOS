using Domain;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.Common;
using System.Reflection;

namespace Infrastructure.Databases
{
	public class DatabaseCommand(DbConnection connection) : IDatabaseCommand, IDisposable
    {
        private bool _disposed = false;
        private readonly DbConnection _connection = connection ?? throw new ArgumentNullException(nameof(connection));

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    // Dispose managed state (managed objects).
                    _connection?.Dispose();
                }

                // Free unmanaged resources (unmanaged objects) and override finalizer.
                // Set large fields to null.

                _disposed = true;
            }
        }

        ~DatabaseCommand()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: false);
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        private void ThrowIfDisposed()
        {
            if (_disposed)
            {
                throw new ObjectDisposedException(GetType().FullName);
            }
        }


        public async Task<DbCommand> Initialize(string procedure, object? parameters = null,
			Pagination? pages = null, CancellationToken token = default)
		{
            ThrowIfDisposed();

            if (_connection.State != ConnectionState.Open) await _connection.OpenAsync(token);
			var command = _connection.CreateCommand();

			command.CommandType = CommandType.StoredProcedure;
			command.CommandText = procedure;
			command.Parameters.AddRange(ConvertToDatabaseParameters(parameters, pages).ToArray());

			return command;
		}

        public static List<DbParameter> ConvertToDatabaseParameters(object? parameters = null, Pagination? pages = null)
        {
            List<DbParameter> list = [];

            if (parameters != null)
            {
                Type objType = parameters.GetType();
                PropertyInfo[] properties = objType.GetProperties();
                foreach (PropertyInfo property in properties)
                {
                    // Check if the property is a base type
                    if (IsBaseType(property.PropertyType))
                    {
                        string propertyName = property.Name;
                        object? propertyValue = property.GetValue(parameters);

                        if (propertyValue is Enum enumValue)
                        {
                            propertyValue = Convert.ToInt32(enumValue); // Convert enum to int
                        }

                        // Handle special cases based on the property type, like DBNull.Value for null values, etc.
                        SqlParameter parameter = new SqlParameter("@" + propertyName, propertyValue ?? DBNull.Value);
                        list.Add(parameter);
                    }
                    else
                    {
                        // If it's a complex type, get its properties
                        object? propertyValue = property.GetValue(parameters);
                        if (propertyValue != null)
                        {
                            PropertyInfo[] children = property.PropertyType.GetProperties();
                            foreach (PropertyInfo child in children)
                            {
                                string childPropertyName = child.Name;
                                object? childPropertyValue = child.GetValue(propertyValue);

                                if (childPropertyValue is Enum enumChildValue)
                                {
                                    childPropertyValue = Convert.ToInt32(enumChildValue); // Convert enum to int
                                }

                                // Handle special cases based on the property type, like DBNull.Value for null values, etc.
                                SqlParameter parameter = new SqlParameter("@" + childPropertyName, childPropertyValue ?? DBNull.Value);
                                list.Add(parameter);
                            }
                        }
                    }
                }
            }

            if (pages != null)
            {
                list.Add(new SqlParameter("@PageIndex", pages.PageIndex));
                list.Add(new SqlParameter("@PageSize", pages.PageSize));
            }

            return list;
        }

        private static bool IsBaseType(Type type)
        {
            return type.IsPrimitive || type.IsEnum || type == typeof(string) || type == typeof(decimal) || type == typeof(DateTime);
        }


        private static SqlDbType GetSqlDbType(object value)
		{
			// Map .NET types to SqlDbType values. You can extend this as needed.
			if (value is int) return SqlDbType.Int;
			if (value is string) return SqlDbType.NVarChar;
			if (value is DateTime) return SqlDbType.DateTime;
			// Add more data type mappings as required.
			throw new SolutionException($"No se encontro el tipo para convertir el parámetro: {value}");
		}

		public async Task ExecuteNonQuery(string procedure, object? parameters = null, CancellationToken token = default)
		{
			using var command = await Initialize(procedure, parameters);
			try
			{
				await command.ExecuteNonQueryAsync(token);
			}
			catch (SqlException ex)
			{
				throw new SolutionException("Ha ocurrido una excepción en la base de datos", ex);
			}
		}



		public async Task<object?> ExecuteScalar(string procedure, object? parameters = null, CancellationToken token = default)
		{
			using var command = await Initialize(procedure, parameters);
			try
			{
				return await command.ExecuteScalarAsync(token);
			}
			catch (SqlException ex)
			{
				throw new SolutionException("Ha ocurrido una excepción en la base de datos", ex);
			}
		}

		public async Task<DbDataReader> ExecuteReader(string procedure, object? parameters = null, Pagination ? pages = null, CancellationToken token = default)
		{
			using var command = await Initialize(procedure, parameters, pages);
			try
			{
				return await command.ExecuteReaderAsync(token);
			}
			catch (SqlException ex)
			{
				throw new SolutionException("Ha ocurrido una excepción en la base de datos", ex);
			}
		}

		public async Task<Item> ReadItem<Entity, Item>(int id, Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null,
			CancellationToken token = default) where Item : class, new()
		{
			string procedure = $"{typeof(Entity).Name}Read";

			return await ReadItem(procedure, new { id }, itemReader, token);
		}

		public async Task<Item> ReadItem<Item>(string procedure, object? parameters = null, Func<DbDataReader,
			Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default) where Item : class, new()
		{
			using var command = await Initialize(procedure, parameters);
			using var reader = await command.ExecuteReaderAsync(token);
					IReadOnlyCollection<Item> result;
					if (itemReader != null)
						result = await itemReader(reader);
					else
						result = await ItemReader<Item>(reader);

					if (result.Count > 0)
						return result.First();
					else
						return new Item();
		}

		public async Task<PaginatedResult<Item>> ReadPage<Entity, Item>
		(
			object? parameters = null, Pagination? pages = null,
			Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default
		)
		{
			string procedure = $"{typeof(Entity).Name}Read";
			return await ReadPage(procedure, parameters, pages, itemReader, token);
		}

		public async Task<PaginatedResult<Item>> ReadPage<Item>
		(
			string procedure, object? parameters = null, Pagination? pages = null,
			Func<DbDataReader, Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default
		)
		{
			using var command = await Initialize(procedure, parameters, pages, token);
			using var reader = await command.ExecuteReaderAsync(token);
					var result = new PaginatedResult<Item>();

					if (pages != null && await reader.ReadAsync(token))
					{
						result.Pages = pages;
						result.Pages.PageCount = Convert.ToInt32(reader[0]);
						await reader.NextResultAsync(token);
					}

					if (itemReader != null)
						result.Items = await itemReader(reader);
					else
						result.Items = await ItemReader<Item>(reader);
					await reader.NextResultAsync(token);

					return result;
		}

		public async Task<IReadOnlyCollection<Item>> ReadCollection<Item>(string procedure, object? parameters = null, Func<DbDataReader,
			Task<IReadOnlyCollection<Item>>>? itemReader = null, CancellationToken token = default) where Item : class, new()
		{
			using var command = await Initialize(procedure, parameters);
            using var reader = await command.ExecuteReaderAsync(token);
            if (itemReader != null)
                return await itemReader(reader);
            else
                return await ItemReader<Item>(reader);
        }
       
		private static bool HasColumn(DbDataReader reader, string field)
		{
			
			var schema = reader.GetSchemaTable();
            if (schema == null) return false;
            foreach (DataRow row in schema.Rows)
			{
				if (row["ColumnName"].ToString() == field)
					return true;
			} //Still here? Column not found. 
			return false;
		}

		private static async Task<IReadOnlyCollection<Item>> ItemReader<Item>(DbDataReader reader)
		{
			var items = new List<Item>();
			while (reader.Read())
			{
				Item instance = Activator.CreateInstance<Item>();
				if (instance != null)
				{
					var properties = instance.GetType().GetProperties();
                    foreach (var prop in properties.Where(prop => HasColumn(reader, prop.Name)))
                    {
                        int ordinal = reader.GetOrdinal(prop.Name);
                        if (ordinal >= 0 && !await reader.IsDBNullAsync(ordinal))
                        {
                            object value = await reader.GetFieldValueAsync<object>(ordinal);
                            // Check if the property is of enum type
                            if (prop.PropertyType.IsEnum)
                            {
                                // Convert the database value to the enum type
                                if (Enum.TryParse(prop.PropertyType, value.ToString(), out var enumValue))
                                {
                                    prop.SetValue(instance, enumValue);
                                }
                            }
                            else
                            {
                                // For non-enum properties, set the value directly
                                prop.SetValue(instance, value);
                            }
                        }
                    }

                    items.Add(instance);
				}
			}
			return items;
		}
		
	}

}
