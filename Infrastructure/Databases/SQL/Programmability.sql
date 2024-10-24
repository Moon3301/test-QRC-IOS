USE [20240710]
GO
/****** Object:  UserDefinedFunction [dbo].[CalculateNextMaintenance]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[CalculateNextMaintenance]
(
    @Calendar INT,
    @LastMaintenance DATETIME
)
RETURNS DATETIME
AS
BEGIN
    RETURN (
        CASE 
            WHEN @Calendar = 15 THEN DATEADD(DAY, 15, @LastMaintenance)
            ELSE DATEADD(MONTH, @Calendar, @LastMaintenance)
        END
    );
END;
GO
/****** Object:  UserDefinedFunction [dbo].[EquipmentFilterTable]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[EquipmentFilterTable]
(
	@Id INT = 0,
	@OrganizationId INT = 0,
	@Calendar INT = 0,
	@Priority INT = 0,
	@Shift INT = 0,
	@CategoryId INT = 0,
    @Asset VARCHAR(100) = '',
    @Descr VARCHAR(100) = '',
    @Location VARCHAR(100) = '',
	@PhysicalFile VARCHAR(100) = '',
	@Serial VARCHAR(100) = '',
    @Brand VARCHAR(100) = '',
    @Model VARCHAR(100) = '',
	@Accreditation BIT = 0,
	@Month INT = 0
)
RETURNS TABLE
AS
RETURN
(
    SELECT [Id]
      ,[QR]
      ,[OrganizationId]
      ,[BuildingId]
      ,[TowerId]
      ,[Shift]
      ,[Priority]
      ,[CategoryId]
      ,[Descr]
      ,[Location]
      ,[PhysicalFile]
      ,[Asset]
      ,[Brand]
      ,[Model]
      ,[Serial]
      ,[Accreditation]
      ,[Calendar]
      ,[LastMaintenance]
      ,[NextMaintenance]
      ,[Deleted]
    FROM Equipment e	
    WHERE 
			(@Id = 0 OR Id = @Id)
			AND (Deleted = 0)
			AND	(@OrganizationId = 0 OR OrganizationId = @OrganizationId)
			AND (@Calendar = 0 OR [Calendar] = @Calendar)
		    AND (@Priority = 0 OR [Priority] = @Priority)
			AND (@Shift = 0 OR [Shift] = @Shift)
			AND (@CategoryId = 0 OR [CategoryId] = @CategoryId)
			AND (@Asset IS NULL OR @Asset = '' OR [Asset] LIKE '%' + @Asset + '%')
			AND (@Descr IS NULL OR @Descr = '' OR [Descr] LIKE '%' + @Descr + '%')
			AND (@Location IS NULL OR @Location = '' OR [Location] LIKE '%' + @Location + '%')
			AND (@PhysicalFile IS NULL OR @PhysicalFile = '' OR [PhysicalFile] LIKE '%' + @PhysicalFile + '%')
			AND (@Serial IS NULL OR @Serial = '' OR [Serial] LIKE '%' + @Serial + '%')
			AND (@Brand IS NULL OR @Brand = '' OR [Brand] LIKE '%' + @Brand + '%')
			AND (@Model IS NULL OR @Model = '' OR [Model] LIKE '%' + @Model + '%')
			AND (@Accreditation IS NULL OR @Accreditation = 0 OR [Accreditation] = @Accreditation)
			AND (@Month = 0 OR @Month = MONTH(NextMaintenance) OR LastMaintenance IS NULL)
			AND (@Month = 0 OR YEAR(GETUTCDATE()) = YEAR(NextMaintenance) OR LastMaintenance IS NULL)
)
GO
/****** Object:  StoredProcedure [dbo].[BuildingCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[BuildingCollection] 
AS
SELECT Id, Descr
FROM Building
GO
/****** Object:  StoredProcedure [dbo].[CalendarChange]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CalendarChange]
(
	@EquipmentId INT,
	@Calendar INT
)
AS BEGIN
BEGIN TRANSACTION

DECLARE @MaintenanceTechnicianId nvarchar(255);
DECLARE @MaintenanceHelperId nvarchar(255);

SELECT TOP 1
@MaintenanceTechnicianId = TechnicianId,
@MaintenanceHelperId = HelperId
FROM
Maintenance
WHERE
EquipmentId = @EquipmentId
AND MONTH(GETUTCDATE()) <= MONTH(Programmed)
AND YEAR(GETUTCDATE()) = YEAR(Programmed)
ORDER BY Programmed

--DECLARE @Id INT
--DECLARE ID_Cursor CURSOR FOR
--Select Id FROM Maintenance 
--WHERE EquipmentId = @EquipmentId
--AND MONTH(GETUTCDATE()) <= MONTH(Programmed)
--AND YEAR(GETUTCDATE()) = YEAR(Programmed)

--OPEN ID_Cursor
--FETCH NEXT FROM ID_Cursor INTO @Id

--WHILE @@FETCH_STATUS = 0
--BEGIN
--    -- Call the stored procedure with the current @ID
--    EXEC MaintenanceDelete @MaintenanceId = @Id

--    FETCH NEXT FROM ID_Cursor INTO @ID
--END

--CLOSE ID_Cursor
--DEALLOCATE ID_Cursor


IF @MaintenanceTechnicianId IS NOT NULL AND @MaintenanceHelperId IS NOT NULL
BEGIN
EXEC [dbo].[MaintenanceCreate] @Id = @EquipmentId, @TechnicianId = @MaintenanceTechnicianId,
		@HelperId = @MaintenanceHelperId
END

COMMIT
END
GO
/****** Object:  StoredProcedure [dbo].[CategoryAutocomplete]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryAutocomplete] 
(
    @search varchar(100) = '*'
)
AS
SELECT Id, Descr FROM dbo.[Category]
WHERE @search = '*' 
OR Descr LIKE '%'+ @search +'%'
GO
/****** Object:  StoredProcedure [dbo].[CategoryCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryCollection] 
(
    @organization int = 0
)
AS
SELECT Id, Descr
FROM Category JOIN OrganizationCategory ON CategoryId = Id
WHERE @organization = 0 OR OrganizationId = @organization
ORDER BY Descr
GO
/****** Object:  StoredProcedure [dbo].[CategoryLaborCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryLaborCollection] 
(
    @categoryId INT
)
AS
SELECT
  cl.Id, l.Descr, cl.CategoryId, cl.Accreditation
FROM
  Labor l
JOIN
  CategoryLabor cl ON l.Id = cl.LaborId
WHERE cl.CategoryId = @categoryId
ORDER BY cl.Sort

GO
/****** Object:  StoredProcedure [dbo].[CategoryLaborCreate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryLaborCreate] 
(
    @id INT = 0
)
AS
BEGIN TRANSACTION

IF @id = 0
BEGIN
DELETE FROM CategoryLabor
DBCC CHECKIDENT ('[CategoryLabor]', RESEED, 1)
END

SELECT * INTO #Categories FROM Category
WHERE @id = 0 OR Id = @id

INSERT INTO CategoryLabor (CategoryId, LaborId, Associated)
SELECT c.Id, l.Id, 'false'
FROM #Categories c, Labor l

COMMIT

GO
/****** Object:  StoredProcedure [dbo].[CategoryLaborUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryLaborUpdate] 
(
	@Id INT = 0,
    @CategoryId INT = 0,
	@LaborId INT = 0,
	@sort TINYINT = 0
)
AS
IF @id <> 0
DELETE 
CategoryLabor
WHERE Id = @id
ELSE
INSERT CategoryLabor (CategoryId, LaborId, Sort)
VALUES(@CategoryId, @LaborId, @Sort)

GO
/****** Object:  StoredProcedure [dbo].[CategoryPartCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryPartCollection] 
(
    @categoryId INT
)
AS
SELECT DISTINCT
	MeasurementId,
    MeasurementDescr,
	Id,
	PartId,
	Descr,
	Sort
FROM
CategoryPart
WHERE CategoryId = @categoryId
ORDER BY
    MeasurementId, PartId;
GO
/****** Object:  StoredProcedure [dbo].[CategoryPartCreate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryPartCreate] 
(
    @id INT = 0
)
AS
BEGIN TRANSACTION

DELETE FROM CategoryPart
WHERE @Id = 0 OR CategoryId = @Id
IF @Id = 0
DBCC CHECKIDENT ('[CategoryPart]', RESEED, 1)


SELECT * INTO #Categories FROM Category
WHERE @id = 0 OR Id = @id

INSERT INTO CategoryPart (CategoryId, MeasurementId, MeasurementDescr, PartId, Descr, Associated)
SELECT c.Id, m.Id, m.Descr, mp.Id, mp.Descr, 'false'
FROM #Categories c, MeasurementPart mp JOIN Measurement m ON m.Id = mp.MeasurementId

COMMIT

GO
/****** Object:  StoredProcedure [dbo].[CategoryStepCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryStepCollection] 
(
    @categoryId INT
)
AS
SELECT DISTINCT
	MeasurementId,
    MeasurementDescr,
	Id,
	StepId,
	Descr,
	Sort
FROM
CategoryStep
WHERE CategoryId = @categoryId
ORDER BY
    MeasurementId, Sort;
GO
/****** Object:  StoredProcedure [dbo].[CategoryStepCreate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CategoryStepCreate] 
(
    @id INT = 0
)
AS
BEGIN TRANSACTION


DELETE FROM CategoryStep
WHERE @Id = 0 OR CategoryId = @Id
IF @Id = 0
DBCC CHECKIDENT ('[CategoryStep]', RESEED, 1)


SELECT * INTO #Categories FROM Category
WHERE @id = 0 OR Id = @id

INSERT INTO CategoryStep (CategoryId, MeasurementId, MeasurementDescr, StepId, Descr, Associated)
SELECT c.Id, m.Id, m.Descr, ms.Id, ms.Descr, 'false'
FROM #Categories c, MeasurementStep ms JOIN Measurement m ON m.Id = ms.MeasurementId

COMMIT

GO
/****** Object:  StoredProcedure [dbo].[EquipmentDelete]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentDelete]
(
	@Id INT = 0,
	@OrganizationId INT = 0,
	@Calendar INT = 15,
	@Priority INT = 0,
	@Shift INT = 0,
	@CategoryId INT = 0,
    @Asset VARCHAR(100) = NULL,
    @Descr VARCHAR(100) = NULL,
    @Location VARCHAR(100) = NULL,
	@PhysicalFile VARCHAR(100) = NULL,
	@Serial VARCHAR(100) = NULL,
    @Brand VARCHAR(100) = NULL,
    @Model VARCHAR(100) = NULL,
	@Accreditation BIT = 0,
	@Month BIT = 0
)
AS
BEGIN
    SET NOCOUNT ON;
		UPDATE [dbo].EquipmentFilterTable(
		@Id,
		@OrganizationId,
		@Calendar,
		@Priority,
		@Shift,
		@CategoryId,
		@Asset,
		@Descr,
		@Location,
		@PhysicalFile,
		@Serial,
		@Brand,
		@Model,
		@Accreditation,
		@Month
		)
		SET Deleted = 1
END
GO
/****** Object:  StoredProcedure [dbo].[EquipmentFilter]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentFilter]
(
	@Id INT = 0,
	@OrganizationId INT = 0,
	@Calendar INT = 0,
	@Priority INT = 0,
	@Shift INT = 0,
	@CategoryId INT = 0,
    @Asset VARCHAR(100) = NULL,
    @Descr VARCHAR(100) = NULL,
    @Location VARCHAR(100) = NULL,
	@PhysicalFile VARCHAR(100) = NULL,
	@Serial VARCHAR(100) = NULL,
    @Brand VARCHAR(100) = NULL,
    @Model VARCHAR(100) = NULL,
	@Accreditation BIT = 0,
	@PageIndex INT = 1,
    @PageSize INT = 10,
	@Month INT = 0
)
AS
BEGIN
    SET NOCOUNT ON;
    
	DECLARE @StartRow INT = (@PageIndex - 1) * @PageSize
    DECLARE @EndRow INT = @PageIndex * @PageSize
    DECLARE @RowCount INT;

    SELECT e.*,
           ROW_NUMBER() OVER (ORDER BY e.Id) AS RowNum
	INTO #Filtered
    FROM [dbo].EquipmentFilterTable(
	@Id,
	@OrganizationId,
	@Calendar,
	@Priority,
	@Shift,
	@CategoryId,
    @Asset,
    @Descr,
    @Location,
	@PhysicalFile,
	@Serial,
    @Brand,
    @Model,
	@Accreditation,
	@Month
	) e
				
	SET @RowCount = (SELECT COUNT(*) FROM #Filtered)
	SELECT CEILING(CONVERT(INT, @RowCount) / @PageSize) + 1


 SELECT DISTINCT f.*, c.Descr AS Category, 
 o.Descr AS Organization, b.Descr AS Building, t.Descr AS Tower,
	CASE 
        WHEN (m.Observation IS NOT NULL AND m.Observation <> '') THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT)
    END AS HasObservation,
	m.Images
    FROM #Filtered f
	LEFT JOIN (
    SELECT 
        m1.*
    FROM 
        maintenance m1
    INNER JOIN (
        SELECT 
            EquipmentId, 
            MAX(Finished) AS Latest
        FROM 
            Maintenance
        GROUP BY 
            EquipmentId
    ) m2 ON m1.EquipmentId = m2.EquipmentId AND m1.Finished = m2.Latest
) m ON f.Id = m.EquipmentId AND m.Status = 5 AND m.Programmed < GETUTCDATE()
	LEFT JOIN Category c ON f.CategoryId = c.Id
	LEFT JOIN Organization o ON f.OrganizationId = o.Id
	LEFT JOIN Building b ON f.BuildingId = b.Id
	LEFT JOIN Tower t ON f.TowerId = t.Id
    WHERE RowNum > @StartRow AND RowNum <= @EndRow  
	ORDER BY f.Id

END
GO
/****** Object:  StoredProcedure [dbo].[EquipmentHistory]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentHistory] 
(
    @Id INT = 0,
	@PageIndex INT = 1,
	@PageSize INT = 10
)
AS
DECLARE @StartRow INT = (@PageIndex - 1) * @PageSize
DECLARE @EndRow INT = @PageIndex * @PageSize
DECLARE @RowCount INT;

SELECT DISTINCT m.[Id], m.Observation, c.Descr AS Category, 
e.Serial, m.EquipmentId, m.[Finished], 
m.[Status], m.SupervisorName, m.TechnicianName,
ROW_NUMBER() OVER (ORDER BY m.Finished DESC) AS RowNum
INTO #History
FROM Maintenance m 
JOIN Equipment e ON e.Id = m.EquipmentId 
JOIN Category c ON c.Id = e.CategoryId
WHERE (@Id = 0 OR m.EquipmentId = @Id)
AND m.Finished IS NOT NULL
--AND YEAR(m.Finished) > 2020
--AND m.Observation IS NOT NULL
--AND m.Observation <> ''

SELECT e.*, c.Descr AS Category FROM Equipment e
JOIN Category c ON c.Id = e.CategoryId
WHERE e.Id = @Id

SELECT @RowCount = COUNT(*) FROM #History
SELECT CEILING(CONVERT(INT, @RowCount) / @PageSize) + 1

SELECT * FROM #History
    WHERE RowNum > @StartRow AND RowNum <= @EndRow
	ORDER BY Finished DESC
GO
/****** Object:  StoredProcedure [dbo].[EquipmentLabel]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentLabel] 
(
	@EquipmentId INT
)
AS
UPDATE Equipment
SET QR = @EquipmentId
WHERE Id = @EquipmentId AND (QR = 0 OR QR IS NULL)

SELECT TOP 1 e.*, c.Descr AS Category, o.Descr AS Organization, o.ManagerPhone, o.SupervisorPhone	
    FROM Equipment e
	LEFT JOIN Category c ON e.CategoryId = c.Id
	LEFT JOIN Organization o ON e.OrganizationId = o.Id	
WHERE e.Id = @EquipmentId

GO
/****** Object:  StoredProcedure [dbo].[EquipmentPartCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentPartCollection] 
(
    @EquipmentId INT = 0,
	@CategoryId INT
)
AS
SELECT DISTINCT 
  @EquipmentId AS EquipmentId, p.Id AS PartId, p.Descr, ep.NominalValue
FROM
  MeasurementPart p
  JOIN
  CategoryPart cp 
  ON p.Id = cp.PartId AND cp.CategoryId = @CategoryId
  LEFT JOIN
  EquipmentPart ep
  ON p.Id = ep.PartId AND ep.EquipmentId = @EquipmentId

GO
/****** Object:  StoredProcedure [dbo].[EquipmentPartUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentPartUpdate] 
(
    @EquipmentId INT,
	@PartId INT,
	@NominalValue DECIMAL(12,6)
)
AS
MERGE INTO EquipmentPart AS TARGET
USING (VALUES (@EquipmentId, @PartId, @NominalValue)) AS source (EquipmentId, PartId, NominalValue)
ON TARGET.EquipmentId = source.EquipmentId AND target.PartId = source.PartId
WHEN MATCHED THEN
  UPDATE SET target.NominalValue = source.NominalValue
WHEN NOT MATCHED THEN
  INSERT (EquipmentId, PartId, NominalValue)
  VALUES (source.EquipmentId, source.PartId, source.NominalValue);
GO
/****** Object:  StoredProcedure [dbo].[EquipmentReadIdByQR]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentReadIdByQR] 
(
	@QR INT = 0
)
AS
SELECT Id
FROM Equipment
WHERE QR = @QR 
GO
/****** Object:  StoredProcedure [dbo].[EquipmentReadLastQR]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EquipmentReadLastQR] 
AS
SELECT MAX(QR)
FROM Equipment

GO
/****** Object:  StoredProcedure [dbo].[MaintenanceCreate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceCreate]
(
	@Id INT = 0,
	@OrganizationId INT = 0,
	@Calendar INT = 0,
	@Priority INT = 0,
	@Shift INT = 0,
	@CategoryId INT = 0,
    @Asset VARCHAR(100) = '',
    @Descr VARCHAR(100) = '',
    @Location VARCHAR(100) = '',
	@PhysicalFile VARCHAR(100) = '',
	@Serial VARCHAR(100) = '',
    @Brand VARCHAR(100) = '',
    @Model VARCHAR(100) = '',
	@Accreditation BIT = 0,
	@SupervisorId  VARCHAR(255) = '',
	@TechnicianId VARCHAR(255) = '',
	@HelperId VARCHAR(255) = '',
	@Month INT = 0,
	@Programmed DATETIME = NULL
)
AS
BEGIN

BEGIN TRANSACTION

SELECT Id,[QR]
      ,[OrganizationId]
      ,[BuildingId]
      ,[TowerId]
      ,[Shift]
      ,[Priority]
      ,[CategoryId]
      ,[Descr]
      ,[Location]
      ,[PhysicalFile]
      ,[Asset]
      ,[Brand]
      ,[Model]
      ,[Serial]
      ,[Accreditation]
      ,[Calendar]
      ,[LastMaintenance]
      ,[NextMaintenance]
      ,[Deleted]
	  INTO #Equipment
FROM [dbo].EquipmentFilterTable(
		@Id,
		@OrganizationId,
		@Calendar,
		@Priority,
		@Shift,
		@CategoryId,
		@Asset,
		@Descr,
		@Location,
		@PhysicalFile,
		@Serial,
		@Brand,
		@Model,
		@Accreditation,
		@Month)
		WHERE LastMaintenance IS NOT NULL

		DECLARE @Maintenance TABLE (Id INT, EquipmentId INT);

 INSERT INTO [dbo].[Maintenance]
           ([EquipmentId]
           ,[Programmed]
           ,[Finished]
           ,[Status]
           ,[Observation]
		   ,[SupervisorId]
		   ,[SupervisorName]
		   ,[TechnicianId]
		   ,[TechnicianName]
           ,[HelperId]
		   ,[HelperName]
		   )
		   OUTPUT INSERTED.Id, INSERTED.EquipmentId INTO @Maintenance(Id, EquipmentId)
SELECT DISTINCT e.[Id], 
CASE WHEN @Programmed IS NOT NULL THEN @Programmed ELSE dbo.CalculateNextMaintenance(e.Calendar, e.LastMaintenance) END,
	null, 1, '',
	@SupervisorId,
	s.Name,
	@TechnicianId,
	t.Name,
	@HelperId,
	h.Name
	FROM
	#Equipment e
	JOIN [User] s ON s.Id = @SupervisorId
	JOIN [User] t ON t.Id = @TechnicianId
	JOIN [User] h ON h.Id = @HelperId
WHERE NOT EXISTS (
    SELECT 1 
    FROM Maintenance m
    WHERE m.EquipmentId = e.Id 
 AND 
          -- Use direct comparison without redundant conversions
          FORMAT(m.Programmed, 'yyyy-MM-dd') = FORMAT(CASE WHEN @Programmed IS NOT NULL THEN @Programmed ELSE dbo.CalculateNextMaintenance(e.Calendar, e.LastMaintenance) END, 'yyyy-MM-dd')
);

INSERT MaintenanceLabor (MaintenanceId, LaborId, Finished)
SELECT m.Id, cl.LaborId, 0
FROM #Equipment e
JOIN @Maintenance m ON m.EquipmentId = e.Id 
JOIN CategoryLabor cl ON e.CategoryId = cl.CategoryId

ORDER BY cl.[Sort]


INSERT MaintenanceMeasurement (MaintenanceId, MeasurementId, MeasurementDescr, PartId, PartDescr, MeasurementStepId, MeasurementStepDescr)
SELECT DISTINCT
    m.Id,
	me.Id,
	me.Descr,
	p.Id,
    p.Descr,
	s.Id,
	s.Descr
FROM #Equipment e 
JOIN @Maintenance m ON m.EquipmentId = e.Id
JOIN Category c ON c.Id = e.CategoryId
JOIN CategoryStep cs ON cs.CategoryId = c.Id
JOIN MeasurementStep s ON s.MeasurementId = cs.MeasurementId AND s.Id = cs.StepId 
JOIN Measurement me ON me.Id = s.MeasurementId
LEFT JOIN MeasurementPart p ON p.MeasurementId = s.MeasurementId
JOIN CategoryPart cp ON (cp.CategoryId = c.Id AND cp.PartId = p.Id) OR p.Id IS NULL
ORDER BY 
    me.Id, p.Id, s.Id

UPDATE MaintenanceMeasurement
SET MeasurementValue = ep.NominalValue
FROM MaintenanceMeasurement AS mm 
INNER JOIN Maintenance m ON m.Id = mm.MaintenanceId
INNER JOIN #Equipment e ON e.Id = m.EquipmentId
INNER JOIN EquipmentPart ep ON e.Id = ep.EquipmentId 
WHERE mm.PartId = ep.PartId AND mm.MeasurementStepId = 19

COMMIT
END
GO
/****** Object:  StoredProcedure [dbo].[MaintenanceDelete]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceDelete]
(
	@Id INT = 0,
	@OrganizationId INT = 0,
	@Calendar INT = 15,
	@Priority INT = 0,
	@Shift INT = 0,
	@CategoryId INT = 0,
    @Asset VARCHAR(100) = NULL,
    @Descr VARCHAR(100) = NULL,
    @Location VARCHAR(100) = NULL,
	@PhysicalFile VARCHAR(100) = NULL,
	@Serial VARCHAR(100) = NULL,
    @Brand VARCHAR(100) = NULL,
    @Model VARCHAR(100) = NULL,
	@Accreditation BIT = 0,
	@Month INT = 0,
	@MaintenanceId INT = 0,
	@Status TINYINT = 0
)
AS
BEGIN
    SET NOCOUNT ON;
	IF @MaintenanceId <> 0
	BEGIN
	DELETE FROM Maintenance WHERE Id = @MaintenanceId
	DELETE FROM MaintenanceLabor WHERE MaintenanceId = @MaintenanceId
	DELETE FROM MaintenanceMeasurement WHERE MaintenanceId = @MaintenanceId

	END
	ELSE
	BEGIN
	SELECT m.Id INTO #Maintenance FROM Maintenance m
		JOIN
		[dbo].EquipmentFilterTable(
		@Id,
		@OrganizationId,
		@Calendar,
		@Priority,
		@Shift,
		@CategoryId,
		@Asset,
		@Descr,
		@Location,
		@PhysicalFile,
		@Serial,
		@Brand,
		@Model,
		@Accreditation,
		@Month
		) e
		ON m.EquipmentId = e.Id	
		WHERE (@Status = '' OR @Status = 0 OR [Status] = @Status)

DELETE FROM Maintenance WHERE Id IN (SELECT Id FROM #Maintenance)
DELETE FROM MaintenanceLabor WHERE MaintenanceId IN (SELECT Id FROM #Maintenance)
DELETE FROM MaintenanceMeasurement WHERE MaintenanceId IN (SELECT Id FROM #Maintenance)
END
END
GO
/****** Object:  StoredProcedure [dbo].[MaintenanceFilter]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceFilter] 
(
    @Id INT = 0,
	@EquipmentId INT = 0,
	@OrganizationId SMALLINT = 0,
	@CategoryId INT = 0,
	@PhysicalFile VARCHAR(100) = '',
	@Status TINYINT = 0,
	@Month INT = 0,
	@Year INT = 0,
	@PageIndex INT = 1,
    @PageSize INT = 10
)
AS
DECLARE @StartRow INT = (@PageIndex - 1) * @PageSize
DECLARE @EndRow INT = @PageIndex * @PageSize
DECLARE @RowCount INT;

SELECT DISTINCT m.[Id], c.Descr AS Category, e.Serial, m.EquipmentId, m.[Programmed], m.Finished,
m.[Status], m.SupervisorName, m.TechnicianName,
ROW_NUMBER() OVER (ORDER BY m.EquipmentId) AS RowNum
INTO #Filter
FROM Maintenance m 
JOIN Equipment e ON e.Id = m.EquipmentId 
JOIN Category c ON c.Id = e.CategoryId
WHERE (@Id = 0 OR m.Id = @Id) 
AND (@EquipmentId = 0 OR e.Id = @EquipmentId)
AND (@Status = 0 OR m.[Status] = @Status)
AND (@OrganizationId = 0 OR e.OrganizationId = @OrganizationId)
AND (@CategoryId = 0 OR e.CategoryId = @CategoryId)
AND (@PhysicalFile IS NULL OR @PhysicalFile = '' OR e.PhysicalFile = @PhysicalFile)
AND (@Month = 0 OR month(m.Programmed) = @Month) 
AND (@Year = 0 OR year(m.Programmed) = @Year)

SELECT @RowCount = COUNT(*) FROM #Filter
SELECT CEILING(CONVERT(INT, @RowCount) / @PageSize) + 1

SELECT * FROM #Filter
    WHERE RowNum > @StartRow AND RowNum <= @EndRow
	ORDER BY Programmed
GO
/****** Object:  StoredProcedure [dbo].[MaintenanceFilterPrint]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceFilterPrint] 
(
    @Id INT = 0,
	@EquipmentId INT = 0,
	@OrganizationId SMALLINT = 0,
	@CategoryId INT = 0,
	@PhysicalFile VARCHAR(100) = '',
	@Status TINYINT = 0,
	@Month INT = 0,
	@Year INT = 0
)
AS

SELECT m.Id
FROM Maintenance m 
JOIN Equipment e ON e.Id = m.EquipmentId
WHERE (@Id = 0 OR m.Id = @Id) 
AND (@EquipmentId = 0 OR e.Id = @EquipmentId)
AND (@Status = 0 OR m.[Status] = @Status)
AND (@OrganizationId = 0 OR e.OrganizationId = @OrganizationId)
AND (@CategoryId = 0 OR e.CategoryId = @CategoryId)
AND (@PhysicalFile IS NULL OR @PhysicalFile = '' OR e.PhysicalFile = @PhysicalFile)
AND (@Month = 0 OR month(m.Programmed) = @Month) 
AND (@Year = 0 OR year(m.Programmed) = @Year)
GO
/****** Object:  StoredProcedure [dbo].[MaintenanceFinish]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceFinish] 
(
    @Id INT,
	@EquipmentId INT
)
AS

UPDATE 
Maintenance
SET [Status] = 5, [Finished] = GETUTCDATE()
WHERE Id = @Id

UPDATE
Equipment 
SET [LastMaintenance] = GETUTCDATE()
WHERE Id = @equipmentId
GO
/****** Object:  StoredProcedure [dbo].[MaintenanceIdByQR]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceIdByQR] 
(
    @qr INT
)
AS

SELECT TOP 1 m.Id 
FROM Maintenance m JOIN Equipment e 
ON m.EquipmentId = e.Id
WHERE e.QR = @qr
ORDER BY Programmed DESC

GO
/****** Object:  StoredProcedure [dbo].[MaintenanceImagesUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceImagesUpdate] 
(
    @id INT,
    @image VARCHAR(MAX)
)
AS
BEGIN
    DECLARE @list VARCHAR(MAX) = '';
    SELECT @list = Images FROM Maintenance WHERE id = @id;
	

    -- Check if the image file already exists in the list
    IF @list IS NULL OR CHARINDEX(@image, @list) = 0
    BEGIN
		IF @list IS NULL OR @list = ''
		SET @list = @image;
		ELSE
		SET @list = CONCAT(@list, ';', @image);
	END
	ELSE
    BEGIN
	DECLARE @count int = 0;
	SET @count = LEN(@list) - LEN(REPLACE(@list, ';', ''))

	IF @count > 1
	SET @list = REPLACE(@list, CONCAT(';', @image), '');
	ELSE
	BEGIN
		SET @list = REPLACE(@list, @image, '');
		SET @list = REPLACE(@list, ';', '');
	END
		
    END
	
    UPDATE Maintenance SET Images = @list WHERE id = @id;
END
GO
/****** Object:  StoredProcedure [dbo].[MaintenanceLaborUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceLaborUpdate] 
(
    @id INT = 0,
	@maintenanceId INT = 0,
	@finished BIT
)
AS
IF @maintenanceId <> 0
UPDATE 
MaintenanceLabor
SET Finished = @finished
WHERE MaintenanceId = @maintenanceId
ELSE
UPDATE 
MaintenanceLabor
SET Finished = @finished
WHERE Id = @id



GO
/****** Object:  StoredProcedure [dbo].[MaintenanceMeasurementUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceMeasurementUpdate] 
(
    @id INT,
	@value DECIMAL(12,6)
)
AS
UPDATE 
MaintenanceMeasurement
SET MeasurementValue = @value
WHERE Id = @id

GO
/****** Object:  StoredProcedure [dbo].[MaintenanceObservationUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceObservationUpdate] 
(
    @id INT,
	@observation VARCHAR(MAX)
)
AS
UPDATE 
Maintenance
SET Observation = @observation
WHERE Id = @id

GO
/****** Object:  StoredProcedure [dbo].[MaintenancePrint]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenancePrint] 
(
	@MaintenanceId INT
)
AS

--SELECT e.*, c.Descr AS Category, o.Descr AS Organization, b.Descr AS Building, t.Descr AS Tower
--	INTO #Filtered
--    FROM Equipment e
--	JOIN Maintenance m ON m.EquipmentId = e.Id
--	LEFT JOIN Category c ON e.CategoryId = c.Id
--	LEFT JOIN Organization o ON e.OrganizationId = o.Id
--	LEFT JOIN Building b ON e.BuildingId = b.Id
--	LEFT JOIN Tower t ON e.TowerId = t.Id
--	WHERE m.Id = @MaintenanceId

-- Maintenance Details
SELECT DISTINCT e.Id AS EquipmentId, c.Descr AS Category, o.Descr AS Organization, e.OrganizationId, b.Descr AS Building, t.Descr AS Tower, 
e.Asset, e.Descr, e.[Location], e.Calendar, 
e.Brand, e.Model, e.Serial, e.LastMaintenance, e.Accreditation,
       m.Id AS Id,  
       m.[Status], 
       m.Observation,
	   m.ObservationVisibleInPdf,
       m.SupervisorId, m.SupervisorName,
	   m.TechnicianId, m.TechnicianName,
	   m.HelperId, m.HelperName,
	   m.Programmed,
	   m.Finished
FROM Equipment e
LEFT JOIN Category c ON e.CategoryId = c.Id
LEFT JOIN Organization o ON e.OrganizationId = o.Id
LEFT JOIN Building b ON e.BuildingId = b.Id
LEFT JOIN Tower t ON e.TowerId = t.Id
JOIN Maintenance m ON e.Id = m.EquipmentId
WHERE m.Id = @maintenanceId
ORDER BY Id

-- Labor Details
SELECT DISTINCT ml.Id, l.Descr, ml.Finished, m.Id AS MaintenanceId, cl.Accreditation
FROM Maintenance m
JOIN Equipment e ON m.EquipmentId = e.Id
JOIN MaintenanceLabor ml ON m.Id = ml.MaintenanceId
JOIN Labor l ON ml.LaborId = l.Id
JOIN CategoryLabor cl ON e.CategoryId = cl.CategoryId AND cl.LaborId = ml.LaborId
WHERE m.Id = @MaintenanceId
ORDER BY ml.Id

-- Measurement Details
SELECT DISTINCT mm.* 
FROM Maintenance m
JOIN MaintenanceMeasurement mm ON m.Id = mm.MaintenanceId
WHERE m.Id = @MaintenanceId
ORDER BY mm.Id

GO
/****** Object:  StoredProcedure [dbo].[MaintenanceStatusUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceStatusUpdate] 
(
    @id INT,
	@status INT
)
AS
IF @status = 5
BEGIN
UPDATE 
Maintenance
SET [Status] = @status, [Finished] = GETUTCDATE()
WHERE Id = @id
END
ELSE
BEGIN
UPDATE 
Maintenance
SET [Status] = @status
WHERE Id = @id
END

GO
/****** Object:  StoredProcedure [dbo].[MaintenanceWork]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MaintenanceWork] 
(
    @id int
)
AS

SELECT m.*, e.Descr, e.[Location], e.Model, e.Serial
FROM Maintenance m
JOIN Equipment e ON e.Id = m.EquipmentId
WHERE m.Id = @id


SELECT m.Id, l.Descr, m.Finished
FROM Labor l
JOIN MaintenanceLabor m ON l.Id = m.LaborId
WHERE m.MaintenanceId = @id

SELECT *
FROM MaintenanceMeasurement 
WHERE MaintenanceId = @id
ORDER By MeasurementId, PartId, MeasurementStepId


GO
/****** Object:  StoredProcedure [dbo].[MeasurementCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MeasurementCollection] 

AS
SELECT
  Id, Descr
FROM
  Measurement
GO
/****** Object:  StoredProcedure [dbo].[MonthHistory]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MonthHistory] 
(
    @month INT,
	@year INT
)
AS

SELECT DISTINCT m.[Id], m.Observation, c.Descr AS Category, 
e.Descr, e.[Location], e.Serial, m.EquipmentId, m.[Finished], 
m.[Status], m.SupervisorName, m.TechnicianName

FROM Maintenance m 
JOIN Equipment e ON e.Id = m.EquipmentId 
JOIN Category c ON c.Id = e.CategoryId
WHERE 
m.Finished IS NOT NULL
AND MONTH(m.Finished) = @month
AND YEAR(m.Finished) = @year
AND m.Observation IS NOT NULL
AND m.Observation <> ''

ORDER BY Finished DESC
GO
/****** Object:  StoredProcedure [dbo].[ObservationVisibleInPdfUpdate]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ObservationVisibleInPdfUpdate] 
(
    @id INT,
	@visible BIT
)
AS

UPDATE 
Maintenance
SET [ObservationVisibleInPdf] = @visible
WHERE Id = @id
GO
/****** Object:  StoredProcedure [dbo].[OrganizationCategoryRelation]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[OrganizationCategoryRelation] 
(
	@organization int,
	@category  int = 0,
	@remove bit = 0
)
AS


BEGIN
IF @category <> 0
BEGIN
IF @remove = 0
BEGIN
IF NOT EXISTS (
        SELECT 1 
        FROM OrganizationCategory 
        WHERE OrganizationId = @organization AND CategoryId = @category
    )

INSERT INTO [dbo].[OrganizationCategory]
           ([OrganizationId],[CategoryId])
     VALUES (@organization,@category)
END
ELSE
DELETE FROM [dbo].[OrganizationCategory]
WHERE OrganizationId = @organization AND CategoryId = @category
END

SELECT o.OrganizationId, CategoryId, c.Descr FROM [dbo].[OrganizationCategory] o
JOIN [dbo].[Category] c ON CategoryId = Id
WHERE o.OrganizationId = @organization
END
GO
/****** Object:  StoredProcedure [dbo].[OrganizationCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[OrganizationCollection] 
(
    @user nvarchar(256) = '*'
)
AS

IF @user = '*'
SELECT Id, Descr
FROM Organization
ELSE
SELECT Id, Descr
FROM Organization
JOIN OrganizationUser ON Id = OrganizationId
WHERE UserId = @user
GO
/****** Object:  StoredProcedure [dbo].[OrganizationUserRelation]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[OrganizationUserRelation] 
(
	@organization int,
	@user  nvarchar(256) = '',
	@remove bit = 0
)
AS


BEGIN
IF @user <> '' 
BEGIN
IF @remove = 0
BEGIN
IF NOT EXISTS (
        SELECT 1 
        FROM OrganizationUser 
        WHERE OrganizationId = @organization AND UserId = @user
    )

INSERT INTO [dbo].[OrganizationUser]
           ([OrganizationId],[UserId])
     VALUES (@organization,@user)
END
ELSE
DELETE FROM [dbo].[OrganizationUser]
WHERE OrganizationId = @organization AND UserId = @user
END

SELECT o.OrganizationId, UserId, UserName FROM [dbo].[OrganizationUser] o
JOIN [dbo].[User] u ON UserId = Id
WHERE o.OrganizationId = @organization
END
GO
/****** Object:  StoredProcedure [dbo].[PhysicalFileAutocomplete]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[PhysicalFileAutocomplete]
(
	@Search VARCHAR(100) = '*'
)
AS
BEGIN
SELECT DISTINCT PhysicalFile as Id, PhysicalFile AS Descr 
FROM Equipment e
WHERE 
e.PhysicalFile IS NOT NULL AND e.PhysicalFile <> ''
AND @Search = '*' OR PhysicalFile Like '%' + @Search + '%'
ORDER BY PhysicalFile
END
GO
/****** Object:  StoredProcedure [dbo].[PriorityGraphic]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[PriorityGraphic] 
(
    @organizationId INT,
	@month INT,
	@year INT,
	@shift TINYINT
)
AS

SELECT e.[Priority], COUNT(m.[Status]) AS Quantity
FROM Equipment e
LEFT JOIN maintenance m ON e.id = m.EquipmentId AND 
m.[Status] = 5 AND
YEAR(m.Programmed) = @year AND 
MONTH(m.Programmed) = @month AND 
(@organizationId = 0  OR e.OrganizationId = @organizationId)
WHERE e.[Priority] <> 0
AND e.[Shift] = @shift
GROUP BY e.[Priority]
ORDER BY e.[Priority]

SELECT e.[Priority], COUNT(m.[Status]) AS Quantity
FROM Equipment e
LEFT JOIN maintenance m ON e.id = m.EquipmentId AND 
m.[Status] <> 5 AND
YEAR(m.Programmed) = @year AND 
MONTH(m.Programmed) = @month AND 
(@organizationId = 0  OR e.OrganizationId = @organizationId)
WHERE e.[Priority] <> 0
AND e.[Shift] = @shift
GROUP BY e.[Priority]
ORDER BY e.[Priority]
GO
/****** Object:  StoredProcedure [dbo].[StatusGraphic]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[StatusGraphic] 
(
    @organizationId INT,
	@month INT,
	@year INT,
	@shift TINYINT
)
AS
SELECT 	
	(SELECT COUNT(*) FROM Maintenance m
	JOIN Equipment e ON e.Id = m.EquipmentId
	WHERE e.[Shift] = @shift
	AND YEAR(m.Programmed) = @year AND MONTH(m.Programmed) = @month
	AND m.[Status] = 5 AND (@organizationId = 0  OR e.OrganizationId = @organizationId)) AS Finished,

	(SELECT COUNT(*) FROM Maintenance m
	JOIN Equipment e ON e.Id = m.EquipmentId
	WHERE e.[Shift] = @shift
	AND YEAR(m.Programmed) = @year AND MONTH(m.Programmed) = @month
	AND m.[Status] <> 5 AND (@organizationId = 0 OR e.OrganizationId = @organizationId)) AS Pending;
GO
/****** Object:  StoredProcedure [dbo].[TowerCollection]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[TowerCollection] 
AS
SELECT Id, Descr
FROM Tower
GO
/****** Object:  StoredProcedure [dbo].[UpdateRecord]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateRecord]
  @TableName NVARCHAR(50),
  @FieldName NVARCHAR(50),
  @Id INT,
  @NewValue NVARCHAR(MAX)
AS
BEGIN
  DECLARE @SqlQuery NVARCHAR(MAX)
  DECLARE @SafeTableName NVARCHAR(50)
  DECLARE @SafeFieldName NVARCHAR(50)

  -- Validate and sanitize table name
  SET @SafeTableName = QUOTENAME(@TableName)

  -- Validate and sanitize field name
  SET @SafeFieldName = QUOTENAME(@FieldName)

  -- Validate ID (assuming a positive integer range)
  IF @Id <= 0
  BEGIN
    RAISERROR('Invalid Id. Please provide a positive integer value.', 16, 1)
    RETURN
  END

  -- Sanitize new value to prevent SQL injection
  SET @NewValue = REPLACE(@NewValue, '''', '''''')

  SET @SqlQuery = N'UPDATE ' + @SafeTableName + ' SET ' +
                  @SafeFieldName + ' = @NewValue WHERE ID = @Id'

  EXEC sp_executesql @SqlQuery, N'@NewValue NVARCHAR(MAX), @Id INT', @NewValue, @ID
END
GO
/****** Object:  StoredProcedure [dbo].[UserAutocomplete]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserAutocomplete] 
(
    @search varchar(100) = '*'
)
AS
SELECT Id, UserName FROM dbo.[User]
WHERE @search = '*' 
OR UserName LIKE '%'+ @search +'%'
GO
/****** Object:  StoredProcedure [dbo].[UserRead]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserRead] 
(
   @organization int = 0,
   @user nvarchar(256) = '',
   @position tinyint = 0
)
AS
IF @user = ''

IF @organization = 0
SELECT Id, Email, UserName, Name, Position
FROM [dbo].[User] 
ELSE
SELECT Id, Email, UserName, Name, Position
FROM [dbo].[User] 
JOIN OrganizationUser ON UserId = Id
WHERE OrganizationId = @organization
AND (@position = 0 OR Position = @position)
ELSE
BEGIN
SELECT Id, Email, UserName, Name, Position
FROM [dbo].[User]
WHERE NormalizedUserName = UPPER(@user)


SELECT [Name]
FROM [dbo].[UserRole] r
JOIN [dbo].[User] u ON u.Id = r.UserId
WHERE NormalizedUserName = UPPER(@user)
END
GO
/****** Object:  StoredProcedure [dbo].[UserUpdatePosition]    Script Date: 7/31/2024 10:30:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserUpdatePosition]
(
	@Id NVARCHAR(255),
	@Position INT
)
AS
BEGIN
    UPDATE [User] SET Position = @Position
	WHERE Id = @Id
END
GO
