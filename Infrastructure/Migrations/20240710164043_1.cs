using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class _1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Building",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrganizationId = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Building", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoryLabor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    LaborId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Sort = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Accreditation = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryLabor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoryPart",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    PartId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MeasurementId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MeasurementDescr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sort = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryPart", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoryStep",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StepId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MeasurementId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MeasurementDescr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sort = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryStep", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Equipment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QR = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    OrganizationId = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0),
                    BuildingId = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0),
                    TowerId = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0),
                    Shift = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhysicalFile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Asset = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Brand = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Serial = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Accreditation = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Calendar = table.Column<int>(type: "int", nullable: false),
                    LastMaintenance = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NextMaintenance = table.Column<DateTime>(type: "datetime2", nullable: true, computedColumnSql: "CASE\r\n WHEN Calendar = 15 THEN DATEADD(DAY, 15, LastMaintenance)\r\n ELSE DATEADD(MONTH, Calendar, LastMaintenance)\r\n END"),
                    Deleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipment", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Labor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Maintenance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SupervisorId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SupervisorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TechnicianId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TechnicianName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HelperId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HelperName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Programmed = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    Finished = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Observation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ObservationVisibleInPdf = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Images = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maintenance", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceLabor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaintenanceId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    LaborId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Finished = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceLabor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceMeasurement",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaintenanceId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MeasurementId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MeasurementDescr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartId = table.Column<int>(type: "int", nullable: true),
                    PartDescr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeasurementStepId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    MeasurementStepDescr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeasurementValue = table.Column<decimal>(type: "decimal(12,6)", precision: 12, scale: 6, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceMeasurement", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Measurement",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurement", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementPart",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeasurementId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementPart", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementStep",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeasurementId = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementStep", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Organization",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ManagerPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SupervisorPhone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organization", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tower",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BuildingId = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tower", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Position = table.Column<int>(type: "int", nullable: false),
                    Signature = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentPart",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    PartId = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    NominalValue = table.Column<decimal>(type: "decimal(12,6)", precision: 12, scale: 6, nullable: false, defaultValue: 0m)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentPart", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EquipmentPart_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OrganizationCategory",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    OrganizationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationCategory", x => new { x.CategoryId, x.OrganizationId });
                    table.ForeignKey(
                        name: "FK_OrganizationCategory_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationCategory_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaim_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OrganizationUser",
                columns: table => new
                {
                    OrganizationId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationUser", x => new { x.OrganizationId, x.UserId });
                    table.ForeignKey(
                        name: "FK_OrganizationUser_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationUser_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserClaim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaim_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserLogin",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogin", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogin_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserRole",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRole", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRole_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserRole_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserToken",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserToken", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserToken_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryLabor_CategoryId_LaborId",
                table: "CategoryLabor",
                columns: new[] { "CategoryId", "LaborId" },
                unique: true)
                .Annotation("SqlServer:Include", new[] { "Sort" });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryPart_CategoryId_MeasurementId_PartId",
                table: "CategoryPart",
                columns: new[] { "CategoryId", "MeasurementId", "PartId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CategoryStep_CategoryId_MeasurementId_StepId",
                table: "CategoryStep",
                columns: new[] { "CategoryId", "MeasurementId", "StepId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_CategoryId",
                table: "Equipment",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_Deleted",
                table: "Equipment",
                column: "Deleted");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_NextMaintenance",
                table: "Equipment",
                column: "NextMaintenance");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentPart_EquipmentId",
                table: "EquipmentPart",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Maintenance_EquipmentId",
                table: "Maintenance",
                column: "EquipmentId")
                .Annotation("SqlServer:Include", new[] { "Programmed" });

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceLabor_MaintenanceId_LaborId",
                table: "MaintenanceLabor",
                columns: new[] { "MaintenanceId", "LaborId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceMeasurement_MaintenanceId_MeasurementId_MeasurementStepId_PartId",
                table: "MaintenanceMeasurement",
                columns: new[] { "MaintenanceId", "MeasurementId", "MeasurementStepId", "PartId" },
                unique: true,
                filter: "[PartId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationCategory_OrganizationId",
                table: "OrganizationCategory",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationUser_UserId",
                table: "OrganizationUser",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Role",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaim_RoleId",
                table: "RoleClaim",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "User",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "User",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaim_UserId",
                table: "UserClaim",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogin_UserId",
                table: "UserLogin",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_RoleId",
                table: "UserRole",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Building");

            migrationBuilder.DropTable(
                name: "CategoryLabor");

            migrationBuilder.DropTable(
                name: "CategoryPart");

            migrationBuilder.DropTable(
                name: "CategoryStep");

            migrationBuilder.DropTable(
                name: "EquipmentPart");

            migrationBuilder.DropTable(
                name: "Labor");

            migrationBuilder.DropTable(
                name: "Maintenance");

            migrationBuilder.DropTable(
                name: "MaintenanceLabor");

            migrationBuilder.DropTable(
                name: "MaintenanceMeasurement");

            migrationBuilder.DropTable(
                name: "Measurement");

            migrationBuilder.DropTable(
                name: "MeasurementPart");

            migrationBuilder.DropTable(
                name: "MeasurementStep");

            migrationBuilder.DropTable(
                name: "OrganizationCategory");

            migrationBuilder.DropTable(
                name: "OrganizationUser");

            migrationBuilder.DropTable(
                name: "RoleClaim");

            migrationBuilder.DropTable(
                name: "Tower");

            migrationBuilder.DropTable(
                name: "UserClaim");

            migrationBuilder.DropTable(
                name: "UserLogin");

            migrationBuilder.DropTable(
                name: "UserRole");

            migrationBuilder.DropTable(
                name: "UserToken");

            migrationBuilder.DropTable(
                name: "Equipment");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Organization");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
