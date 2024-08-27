ALTER TABLE [dbo].[UserToken] DROP CONSTRAINT [FK_UserToken_User_UserId]
GO

ALTER TABLE [dbo].[UserRole] DROP CONSTRAINT [FK_UserRole_User_UserId]
GO

ALTER TABLE [dbo].[UserRole] DROP CONSTRAINT [FK_UserRole_Role_RoleId]
GO

ALTER TABLE [dbo].[UserLogin] DROP CONSTRAINT [FK_UserLogin_User_UserId]
GO

ALTER TABLE [dbo].[UserClaim] DROP CONSTRAINT [FK_UserClaim_User_UserId]
GO

ALTER TABLE [dbo].[RoleClaim] DROP CONSTRAINT [FK_RoleClaim_Role_RoleId]
GO

ALTER TABLE [dbo].[EquipmentPart] DROP CONSTRAINT [FK_EquipmentPart_Equipment_EquipmentId]
GO

/****** Object:  Table [dbo].[UserToken]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserToken]') AND type in (N'U'))
DROP TABLE [dbo].[UserToken]
GO

/****** Object:  Table [dbo].[UserRole]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRole]') AND type in (N'U'))
DROP TABLE [dbo].[UserRole]
GO

/****** Object:  Table [dbo].[UserLogin]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserLogin]') AND type in (N'U'))
DROP TABLE [dbo].[UserLogin]
GO

/****** Object:  Table [dbo].[UserClaim]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserClaim]') AND type in (N'U'))
DROP TABLE [dbo].[UserClaim]
GO

/****** Object:  Table [dbo].[User]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND type in (N'U'))
DROP TABLE [dbo].[User]
GO

/****** Object:  Table [dbo].[Tower]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tower]') AND type in (N'U'))
DROP TABLE [dbo].[Tower]
GO

/****** Object:  Table [dbo].[RoleClaim]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RoleClaim]') AND type in (N'U'))
DROP TABLE [dbo].[RoleClaim]
GO

/****** Object:  Table [dbo].[Role]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Role]') AND type in (N'U'))
DROP TABLE [dbo].[Role]
GO

/****** Object:  Table [dbo].[Organization]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Organization]') AND type in (N'U'))
DROP TABLE [dbo].[Organization]
GO

/****** Object:  Table [dbo].[MeasurementStep]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MeasurementStep]') AND type in (N'U'))
DROP TABLE [dbo].[MeasurementStep]
GO

/****** Object:  Table [dbo].[MeasurementPart]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MeasurementPart]') AND type in (N'U'))
DROP TABLE [dbo].[MeasurementPart]
GO

/****** Object:  Table [dbo].[Measurement]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Measurement]') AND type in (N'U'))
DROP TABLE [dbo].[Measurement]
GO

/****** Object:  Table [dbo].[MaintenanceMeasurement]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MaintenanceMeasurement]') AND type in (N'U'))
DROP TABLE [dbo].[MaintenanceMeasurement]
GO

/****** Object:  Table [dbo].[MaintenanceLabor]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MaintenanceLabor]') AND type in (N'U'))
DROP TABLE [dbo].[MaintenanceLabor]
GO

/****** Object:  Table [dbo].[Maintenance]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Maintenance]') AND type in (N'U'))
DROP TABLE [dbo].[Maintenance]
GO

/****** Object:  Table [dbo].[Labor]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Labor]') AND type in (N'U'))
DROP TABLE [dbo].[Labor]
GO

/****** Object:  Table [dbo].[EquipmentPart]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EquipmentPart]') AND type in (N'U'))
DROP TABLE [dbo].[EquipmentPart]
GO

/****** Object:  Table [dbo].[Equipment]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Equipment]') AND type in (N'U'))
DROP TABLE [dbo].[Equipment]
GO

/****** Object:  Table [dbo].[CategoryStep]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CategoryStep]') AND type in (N'U'))
DROP TABLE [dbo].[CategoryStep]
GO

/****** Object:  Table [dbo].[CategoryPart]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CategoryPart]') AND type in (N'U'))
DROP TABLE [dbo].[CategoryPart]
GO

/****** Object:  Table [dbo].[CategoryLabor]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CategoryLabor]') AND type in (N'U'))
DROP TABLE [dbo].[CategoryLabor]
GO

/****** Object:  Table [dbo].[Category]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Category]') AND type in (N'U'))
DROP TABLE [dbo].[Category]
GO

/****** Object:  Table [dbo].[Building]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Building]') AND type in (N'U'))
DROP TABLE [dbo].[Building]
GO

/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 5/30/2024 5:17:04 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]') AND type in (N'U'))
DROP TABLE [dbo].[__EFMigrationsHistory]
GO


