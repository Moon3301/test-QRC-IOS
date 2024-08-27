UPDATE ml
SET ml.finished = 1
FROM maintenancelabor ml
JOIN maintenance m ON ml.maintenanceid = m.id
JOIN equipment e ON m.equipmentid = e.id
WHERE ml.laborid = 33 AND e.categoryid = 2;