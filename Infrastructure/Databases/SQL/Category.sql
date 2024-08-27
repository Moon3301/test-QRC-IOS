UPDATE [User] SET OrganizationId = 1

DECLARE @CategoryId INT;

SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'FAN COIL')
UPDATE Equipment SET PhysicalFile = 'AF', [Priority] = 4
WHERE CategoryId = @CategoryId

SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'REFRIGERADOR')
PRINT 'REFRIGERADOR'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Chequeo de temperatura de Compresor', 1),
        ('Chequeo de Luces Interiores', 2),
        ('Funcionamiento de termostato de gabinete', 3),
        ('Funcionamiento de termostato de cooler', 4),
        ('Chequeo de estado de burletes', 5),
        ('Limpieza de serpentín (Condensador)', 6),
        ('Limpieza de bandeja de condensado', 7),
        ('Reapriete de borneras de motor', 8),
        ('Inspección visual de filtración de gas refrigerante', 9),
        ('Limpieza General del equipo', 10)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('Gabinete', 1),
        ('Freezer', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('L', 1),
        ('Nominal', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Compresor', 1),
        ('Ventilador', 2)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);








SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'VITRINA')
PRINT 'VITRINA'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Chequeo de temperatura de Compresor', 1),
        ('Chequeo de Luces Interiores', 2),
        ('Funcionamiento de termostato de gabinete', 3),
        ('Chequeo de estado de burletes', 4),
        ('Limpieza de serpentín (Condensador)', 5),
        ('Limpieza de bandeja de condensado', 6),
        ('Reapriete de borneras de motor', 7),
        ('Inspección visual de filtración de gas refrigerante', 8),
        ('Limpieza General del equipo', 9)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('Gabinete', 1)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('L', 1),
        ('Nominal', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Compresor', 1),
        ('Ventilador', 2)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);








SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'MAQUINA DE HIELO')
PRINT 'MAQUINA DE HIELO'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Chequeo de temperatura de Compresor', 1),
        ('Funcionamiento de termostato de Cooler', 2),
        ('Limpieza de serpentín (Condensador)', 3),
        ('Limpieza de bandeja de condensado', 4),
        ('Reapriete de borneras de motor', 5),
        ('Inspección visual de filtración de gas refrigerante', 6),
        ('Limpieza General del equipo', 7)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('Freezer', 1)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('L', 1),
        ('Nominal', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Compresor', 1),
        ('Ventilador', 2)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);









SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'CONGELADOR')
PRINT 'CONGELADOR'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Chequeo de temperatura de Compresor', 1),
        ('Chequeo de Luces Interiores', 2),
        ('Funcionamiento de termostato de Cooler', 3),
        ('Chequeo de estado de burletes', 4),
        ('Limpieza de serpentín (Condensador)', 5),
        ('Limpieza de bandeja de condensado', 6),
        ('Reapriete de borneras de motor', 7),
        ('Inspección visual de filtración de gas refrigerante', 8),
        ('Limpieza General del equipo', 9)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('Cooler', 1)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId
JOIN (
    VALUES
        ('L', 1),
        ('Nominal', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Compresor', 1),
        ('Ventilador', 2)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);









SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'FAN COIL')
PRINT 'FAN COIL'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Limpieza serpentín de Agua Caliente', 2),
        ('Limpieza serpentín de Agua Fría', 3),
        ('Limpieza rejilla de extracción de baño', 4),
        ('Chequeo y limpieza de termostato', 5),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 6),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 7),
        ('Reapriete de borneras de motores', 8),
        ('Chequeo de válvulas', 9),
        ('Chequeo de llaves de corte', 10),
        ('Revisión auditiva de rodamientos y vibraciones', 11),
        ('Limpieza de motor eléctrico', 12),
        ('Limpieza general del equipo', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr)


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 2
JOIN (
    VALUES
        ('Alta', 1),
        ('Media', 2),
        ('Baja', 3)

) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr)

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('Alta', 1),
        ('Media', 2),
        ('Baja', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Motor 1', 1),
        ('Motor 2', 2),
        ('Motor 3', 3)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);







SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'UNIDAD MANEJADORA DE AIRE')
PRINT @categoryId

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza serpentín de Agua Caliente', 1),
        ('Limpieza serpentín de Agua Fría', 2),
        ('Chequeo de correas', 3),
        ('Alineación de poleas', 4),
        ('Cambio de correas', 5),
        ('Chequeo y limpieza de termostato', 6),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 7),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 8),
        ('Reapriete de borneras de motores', 9),
        ('Chequeo de válvulas', 10),
        ('Chequeo de llaves de corte Agua Fría y Caliente', 11),
        ('Revisión auditiva de rodamientos y vibraciones', 12),
        ('Limpieza de motor eléctrico', 13),
        ('Limpieza general del equipo', 14),
        ('Lubricación de rodamientos', 15),
        ('Inspección de juntas, lonas y aislación', 16)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);



DELETE FROM CategoryStep
WHERE CategoryId = @categoryId

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2)

) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr)


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 2
JOIN (
    VALUES
        ('', 1)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);



DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Motor 1', 1),
        ('Motor 2', 2)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);










SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'VENTILADOR EXTRACTOR DE AIRE')
PRINT 'VENTILADOR EXTRACTOR DE AIRE'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Chequeo de correas', 1),
        ('Alineación de poleas', 2),
        ('Cambio de correas', 3),
        ('Limpieza rejilla(s) de extracción', 4),
        ('Reapriete de borneras de motores', 5),
        ('Revisión auditiva de rodamientos y vibraciones', 6),
        ('Limpieza de motor eléctrico', 7),
        ('Limpieza general del equipo', 8),
        ('Lubricación de rodamientos', 9),
        ('Inspección de lonas y aislación (si aplica)', 10)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 2
JOIN (
    VALUES
        ('', 1)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Motor', 1)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);







SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'VENTILADOR INYECTOR DE AIRE')
PRINT 'VENTILADOR INYECTOR DE AIRE'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Chequeo de correas', 1),
        ('Alineación de poleas', 2),
        ('Cambio de correas', 3),
        ('Limpieza de difusores', 4),
        ('Reapriete de borneras de motores', 5),
        ('Revisión auditiva de rodamientos y vibraciones', 6),
        ('Limpieza de motor eléctrico', 7),
        ('Limpieza general del equipo', 8),
        ('Lubricación de rodamientos', 9),
        ('Inspección de lonas y aislación (si aplica)', 10)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 2
JOIN (
    VALUES
        ('', 1)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Motor', 1)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);









SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'CORTINA DE AIRE')
PRINT 'CORTINA DE AIRE'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Reapriete de borneras de motores', 1),
        ('Revisión auditiva de rodamientos y vibraciones', 2),
        ('Limpieza de motor eléctrico', 3),
        ('Limpieza general del equipo', 4),
        ('Cambio de rodamientos', 5),
        ('Inspección de resistencia eléctrica (si aplica)', 6)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 2
JOIN (
    VALUES
        ('Alta', 1),
        ('Baja', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Motor 1', 1),
        ('Motor 2', 1)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);









SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'PURIFICADOR')
PRINT 'PURIFICADOR'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza general del equipo', 1),
        ('Limpieza/cambio de filtro', 2),
        ('Limpieza de sensores', 3),
        ('Limpieza de motor eléctrico', 4),
        ('Revisión auditiva de rodamientos y vibraciones', 5),
        ('Inspección de lonas y aislación (si aplica)', 6)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId

INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('l', 1),
        ('Nominal', 2)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('', 1)
) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);










SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'SPLIT DUCTO')
PRINT 'SPLIT DUCTO'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Chequeo de correas', 2),
        ('Alineación de poleas', 3),
        ('Cambio de correas', 4),
        ('Limpieza rejilla(s) de extracción', 5),
        ('Chequeo y limpieza de termostato', 6),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 7),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 8),
        ('Limpieza de Condensador', 9),
        ('Limpieza de Evaporador', 10),
        ('Chequeo de válvulas', 11),
        ('Revisión auditiva de rodamientos y vibraciones', 12),
        ('Revisión y limpieza de componentes eléctricos', 13),
        ('Reapriete de borneras de motores', 14),
        ('Limpieza general del equipo', 15),
        ('Inspección visual de filtración de gas refrigerante', 16)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);







SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'SPLIT MURO')
PRINT 'SPLIT MURO'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
       ('Limpieza de filtros', 1),
        ('Limpieza rejilla(s) de extracción', 2),
        ('Chequeo y limpieza de termostato', 3),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 4),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 5),
        ('Limpieza de Condensador', 6),
        ('Limpieza de Evaporador', 7),
        ('Chequeo de válvulas', 8),
        ('Revisión auditiva de rodamientos y vibraciones', 9),
        ('Revisión y limpieza de componentes eléctricos', 10),
        ('Reapriete de borneras de motores', 11),
        ('Limpieza general del equipo', 12),
        ('Inspección visual de filtración de gas refrigerante', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);





SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'SPLIT CASSETTE')
PRINT 'SPLIT CASSETTE'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
      ('Limpieza de filtros', 1),
        ('Limpieza rejilla(s) de extracción', 2),
        ('Chequeo y limpieza de termostato', 3),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 4),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 5),
        ('Limpieza de Condensador', 6),
        ('Limpieza de Evaporador', 7),
        ('Chequeo de válvulas', 8),
        ('Revisión auditiva de rodamientos y vibraciones', 9),
        ('Revisión y limpieza de componentes eléctricos', 10),
        ('Reapriete de borneras de motores', 11),
        ('Limpieza general del equipo', 12),
        ('Inspección visual de filtración de gas refrigerante', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);







SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'MINI SPLIT')
PRINT 'MINI SPLIT'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Limpieza rejilla(s) de extracción', 2),
        ('Chequeo y limpieza de termostato', 3),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 4),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 5),
        ('Limpieza de Condensador', 6),
        ('Limpieza de Evaporador', 7),
        ('Chequeo de válvulas', 8),
        ('Revisión auditiva de rodamientos y vibraciones', 9),
        ('Revisión y limpieza de componentes eléctricos', 10),
        ('Reapriete de borneras de motor', 11),
        ('Limpieza general del equipo', 12),
        ('Inspección visual de filtración de gas refrigerante', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);








SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'MULTI SPLIT')
PRINT 'MULTI SPLIT'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Limpieza rejilla(s) de extracción', 2),
        ('Chequeo y limpieza de termostato', 3),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 4),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 5),
        ('Limpieza de Condensador', 6),
        ('Limpieza de Evaporador', 7),
        ('Chequeo de válvulas', 8),
        ('Revisión auditiva de rodamientos y vibraciones', 9),
        ('Revisión y limpieza de componentes eléctricos', 10),
        ('Reapriete de borneras de motores', 11),
        ('Limpieza general del equipo', 12),
        ('Inspección visual de filtración de gas refrigerante', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);

DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);







SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'VENTANA')
PRINT 'VENTANA'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Limpieza rejilla(s) de extracción', 2),
        ('Chequeo y limpieza de termostato', 3),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 4),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 5),
        ('Limpieza de Condensador', 6),
        ('Limpieza de Evaporador', 7),
        ('Chequeo de válvulas', 8),
        ('Revisión auditiva de rodamientos y vibraciones', 9),
        ('Revisión y limpieza de componentes eléctricos', 10),
        ('Reapriete de borneras de motores', 11),
        ('Limpieza general del equipo', 12),
        ('Inspección visual de filtración de gas refrigerante', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);










SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'VRV - UI')
PRINT 'VRV - UI'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Limpieza rejilla(s) de extracción', 2),
        ('Chequeo y limpieza de termostato', 3),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 4),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 5),
        ('Limpieza de Condensador', 6),
        ('Limpieza de Evaporador', 7),
        ('Chequeo de válvulas', 8),
        ('Revisión auditiva de rodamientos y vibraciones', 9),
        ('Revisión y limpieza de componentes eléctricos', 10),
        ('Reapriete de borneras de motores', 11),
        ('Limpieza general del equipo', 12),
        ('Inspección visual de filtración de gas refrigerante', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);




SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'VRV - UE')
PRINT 'VRV - UE'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Limpieza rejilla(s) de extracción', 2),
        ('Chequeo y limpieza de termostato', 3),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 4),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 5),
        ('Limpieza de Condensador', 6),
        ('Limpieza de Evaporador', 7),
        ('Chequeo de válvulas', 8),
        ('Revisión auditiva de rodamientos y vibraciones', 9),
        ('Revisión y limpieza de componentes eléctricos', 10),
        ('Reapriete de borneras de motores', 11),
        ('Limpieza general del equipo', 12),
        ('Inspección visual de filtración de gas refrigerante', 13)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);



SET @CategoryId = (SELECT Id FROM Category WHERE Descr = 'COMPACTO')
PRINT 'COMPACTO'

DELETE FROM CategoryLabor
WHERE CategoryId = @categoryId

INSERT INTO CategoryLabor (CategoryId, LaborId, Sort)
SELECT
    @CategoryId,
    Labor.Id,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Labor
JOIN (
    VALUES
        ('Limpieza de filtros', 1),
        ('Chequeo de correas', 2),
        ('Alineación de poleas', 3),
        ('Cambio de correas', 4),
        ('Limpieza rejilla(s) de extracción', 5),
        ('Chequeo y limpieza de termostato', 6),
        ('Limpieza de difusores (rejilla de retorno si aplica)', 7),
        ('Limpieza de sistema de condensado y desagüe (Incluye mantención a bomba de condensado)', 8),
        ('Limpieza de Condensador', 9),
        ('Limpieza de Evaporador', 10),
        ('Chequeo de válvulas', 11),
        ('Revisión auditiva de rodamientos y vibraciones', 12),
        ('Revisión y limpieza de componentes eléctricos', 13),
        ('Reapriete de borneras de motores', 14),
        ('Limpieza general del equipo', 15),
        ('Inspección visual de filtración de gas refrigerante', 16)
) AS Labors (Descr, Sort) ON LOWER(Labor.Descr) = LOWER(Labors.Descr);


DELETE FROM CategoryStep
WHERE CategoryId = @categoryId


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 1
JOIN (
    VALUES
        ('Frío', 1),
        ('Calor', 2),
        ('Retorno', 3)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


INSERT INTO CategoryStep (CategoryId, StepId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    s.Id, s.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort) AS Sort
FROM
Measurement m
JOIN 
MeasurementStep s
ON m.Id = s.MeasurementId AND m.Id = 3
JOIN (
    VALUES
        ('R', 1),
        ('S', 2),
        ('T', 3),
        ('Nominal', 4)
) AS Steps (Descr, Sort) 
ON LOWER(s.Descr) = LOWER(Steps.Descr);


DELETE FROM CategoryPart
WHERE CategoryId = @CategoryId

INSERT INTO CategoryPart (CategoryId, PartId, Descr, MeasurementId, MeasurementDescr, Sort)
SELECT
    @CategoryId,
    p.Id, P.Descr,
	m.Id, m.Descr,
    ROW_NUMBER() OVER (ORDER BY Sort)
FROM
    Measurement m
JOIN 
MeasurementPart p
ON m.Id = p.MeasurementId
JOIN (
    VALUES
        ('Ventilador Exterior', 1),
        ('Ventilador Interior', 2),
        ('Compresor 1', 3),
        ('Compresor 2', 4)

) AS Parts (Descr, Sort) ON LOWER(p.Descr) = LOWER(Parts.Descr);

