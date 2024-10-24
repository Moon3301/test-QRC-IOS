GO

UPDATE [dbo].[CategoryLabor]
   SET [Accreditation] = 1
 WHERE CategoryId = 2 AND 
 (
 LaborId = 33 OR 
 LaborId = 9 OR 
 LaborId = 11 OR 
 LaborId = 13 OR 
 LaborId = 15 
 )
GO

UPDATE [dbo].[CategoryLabor]
   SET [Accreditation] = 1
 WHERE CategoryId = 9 AND 
 (
 LaborId = 10 OR 
 LaborId = 15
 )
GO

UPDATE [dbo].[CategoryLabor]
   SET [Accreditation] = 1
 WHERE CategoryId = 3 AND 
 (
 LaborId = 10 OR 
 LaborId = 15
 )
GO

UPDATE [dbo].[CategoryLabor]
   SET [Accreditation] = 1
 WHERE CategoryId = 7 AND 
 (
 LaborId = 11 OR 
 LaborId = 15 OR 
 LaborId = 10
 )
GO