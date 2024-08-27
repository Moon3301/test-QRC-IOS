DELETE FROM Maintenance
DBCC CHECKIDENT ('Maintenance', RESEED, 1);
DELETE FROM MaintenanceLabor
DBCC CHECKIDENT ('MaintenanceLabor', RESEED, 1);
DELETE FROM MaintenanceMeasurement
DBCC CHECKIDENT ('MaintenanceMeasurement', RESEED, 1);

DELETE FROM Equipment
DBCC CHECKIDENT ('Equipment', RESEED, 1);
DELETE FROM EquipmentPart
DBCC CHECKIDENT ('EquipmentPart', RESEED, 1);


DELETE FROM Category
DBCC CHECKIDENT ('Category', RESEED, 1);
DELETE FROM CategoryLabor
DBCC CHECKIDENT ('CategoryLabor', RESEED, 1);
DELETE FROM CategoryPart
DBCC CHECKIDENT ('CategoryPart', RESEED, 1);
DELETE FROM CategoryStep
DBCC CHECKIDENT ('CategoryStep', RESEED, 1);



DELETE FROM [Organization]
DBCC CHECKIDENT ('[Organization]', RESEED, 1);
DELETE FROM Building
DBCC CHECKIDENT ('Building', RESEED, 1);
DELETE FROM Tower
DBCC CHECKIDENT ('Tower', RESEED, 1);