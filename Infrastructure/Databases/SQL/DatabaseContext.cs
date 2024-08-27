using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.Common;
using System.Reflection;
using System.Reflection.Emit;

namespace Infrastructure.Databases
{
    public class DatabaseContext : IdentityDbContext<User>
    {
        public DatabaseContext()
        {
            //ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            ChangeTracker.LazyLoadingEnabled = false;
        }
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            ChangeTracker.LazyLoadingEnabled = false;
        }

        public DbSet<Organization> Organization { get; set; }
        public DbSet<Building> Building { get; set; }
        public DbSet<Tower> Tower { get; set; }
        public DbSet<Measurement> Measurement { get; set; }
        public DbSet<Part> MeasurementPart { get; set; }
        public DbSet<MeasurementStep> MeasurementStep { get; set; }
        public DbSet<CategoryStep> MeasurementPartStep { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<CategoryLabor> CategoryLabor { get; set; }
        public DbSet<CategoryPart> CategoryPart { get; set; }
        public DbSet<CategoryStep> CategoryMeasurementStep { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<EquipmentPart> EquipmentPart { get; set; }
        public DbSet<Labor> Labor { get; set; }

        public DbSet<Maintenance> Maintenance { get; set; }
        public DbSet<MaintenanceLabor> MaintenanceLabor { get; set; }
        public DbSet<MaintenanceMeasurement> MaintenanceMeasurement { get; set; }

        private static bool IsNumericType(Type type)
        {
            return type == typeof(short)
                || type == typeof(int)
                || type == typeof(long)
                || type == typeof(float)
                || type == typeof(double)
                || type == typeof(decimal);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                var table = entity.GetTableName();
                if (table != null && table.StartsWith("AspNet"))
                {
                    entity.SetTableName(table[6..].TrimEnd('s'));
                }
                else
                {
                    foreach (var property in entity.GetProperties())
                    {
                        // Skip properties that are part of any key (primary key or foreign key)
                        if (entity.FindPrimaryKey()?.Properties.Contains(property) == true ||
                            entity.GetForeignKeys().Any(fk => fk.Properties.Contains(property)))
                        {
                            continue; // Skip setting default values for key properties
                        }
                        
                        else if (property.Name != "Id" && IsNumericType(property.ClrType))
                        {
                            property.SetDefaultValue(0);
                        }
                        else if (property.ClrType == typeof(DateTime))
                        {
                            property.SetColumnType("datetime");
                            property.SetDefaultValueSql("GETUTCDATE()");
                        }
                        else if (property.ClrType == typeof(bool))
                        {
                            property.SetDefaultValue(false);
                        }
                    }
                }
            }

            foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }

            foreach (var property in builder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetPrecision(12);
                property.SetScale(6);
            }

            builder.Entity<User>()
                .Property(_ => _.Position)
                .HasConversion<int>();

            builder.Entity<CategoryLabor>().
                Property(_ => _.Accreditation).
                HasDefaultValue(false);

            builder.Entity<CategoryLabor>()
                .HasIndex(_ => new { _.CategoryId, _.LaborId }).IsUnique()
                .IncludeProperties(x => new { x.Sort });

            builder.Entity<CategoryStep>()
                .HasIndex(_ => new { _.CategoryId, _.MeasurementId, _.StepId })
                .IsUnique();

            builder.Entity<CategoryPart>()
                .HasIndex(_ => new { _.CategoryId, _.MeasurementId, _.PartId })
                .IsUnique();

            builder.Entity<Equipment>()
                .HasIndex(_ => _.CategoryId);

            builder.Entity<Equipment>()
                .HasIndex(_ => _.NextMaintenance);

            builder.Entity<Equipment>()
            .HasIndex(_ => _.Deleted);

            builder.Entity<Equipment>()
                        .Property(p => p.NextMaintenance)
                        .HasComputedColumnSql("CASE\r\n WHEN Calendar = 15 THEN DATEADD(DAY, 15, LastMaintenance)\r\n ELSE DATEADD(MONTH, Calendar, LastMaintenance)\r\n END");

            builder.Entity<Maintenance>()
                .HasIndex(_ => _.EquipmentId)
                .IncludeProperties(_ => _.Programmed);

            builder.Entity<Maintenance>()
                .Property(_ => _.ObservationVisibleInPdf)
                .HasDefaultValue(false);

            builder.Entity<MaintenanceLabor>()
                .HasIndex(_ => new { _.MaintenanceId, _.LaborId })
                .IsUnique();

            builder.Entity<MaintenanceMeasurement>()
                .HasIndex(_ => new { _.MaintenanceId, _.MeasurementId, _.MeasurementStepId, _.PartId })
                .IsUnique();

            builder.Entity<Organization>()
            .HasMany<User>()
            .WithMany("Organizations")
            .UsingEntity<Dictionary<string, object>>(
                "OrganizationUser",
                _ => _.HasOne<User>().WithMany().HasForeignKey("UserId"),
                _ => _.HasOne<Organization>().WithMany().HasForeignKey("OrganizationId"));

            builder.Entity<Organization>()
            .HasMany<Category>()
            .WithMany("Organizations")
            .UsingEntity<Dictionary<string, object>>(
                "OrganizationCategory",
                _ => _.HasOne<Category>().WithMany().HasForeignKey("CategoryId"),
                _ => _.HasOne<Organization>().WithMany().HasForeignKey("OrganizationId"));


            Seed(builder);

        }

        protected static void Seed(ModelBuilder builder)
        {
        }
    }

    public static class DatabaseExtensions
    {
        public static List<T> ReadFromSql<T>(this DbContext context, string sql, Dictionary<string, object> parameters) where T : class, new()
        {
            using var cmd = context.Database.GetDbConnection().CreateCommand();

            cmd.CommandText = sql;
            if (cmd.Connection != null && cmd.Connection.State != ConnectionState.Open)
                cmd.Connection.Open();

            foreach (KeyValuePair<string, object> param in parameters)
            {
                DbParameter dbParameter = cmd.CreateParameter();
                dbParameter.ParameterName = param.Key;
                dbParameter.Value = param.Value;
                cmd.Parameters.Add(dbParameter);
            }

            List<T> results = [];
            using (var dataReader = cmd.ExecuteReader())
            {
                results = DataReaderToList<T>(dataReader);
            }
            return results;
        }
        public static List<T> DataReaderToList<T>(IDataReader dr)
        {
            List<T> list = [];
            while (dr.Read())
            {
                var obj = Activator.CreateInstance<T>();
                if (obj != null)
                {
                    foreach (PropertyInfo prop in obj.GetType().GetProperties())
                    {
                        if (!object.Equals(dr[prop.Name], DBNull.Value))
                        {
                            prop.SetValue(obj, dr[prop.Name], null);
                        }
                    }
                    list.Add(obj);

                }
            }
            return list;
        }
    }
}