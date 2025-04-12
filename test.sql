SELECT
    id, name, type, cost
    ,(SELECT SUM(cost) FROM products p2) AS total
    ,(SELECT SUM(cost) FROM products p3 WHERE p3.type = p1.type) AS total_by_type
    ,(SELECT SUM(cost) FROM products p3 WHERE p3.id <= p1.id) AS cumul_total
    ,(SELECT SUM(cost) FROM products p4 WHERE p4.type = p1.type AND p4.id <= p1.id) AS cumul_total_by_type
FROM products p1


SELECT
    id, name, type, cost,
    ,SUM(cost) OVER() AS total
    ,SUM(cost) OVER(PARTITION BY type) AS total_by_type
    ,SUM(cost) OVER(ORDER BY id ASC) AS cumul_total
    ,SUM(cost) OVER(PARTITION BY type ORDER BY id ASC) AS cumul_total_by_type
FROM products p1









