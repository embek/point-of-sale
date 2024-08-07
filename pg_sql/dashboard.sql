SELECT
	substring(sales.invoice,9,4) AS month,
	SUM(purchases.totalsum) AS expense,
	SUM(sales.totalsum)AS revenue,
	(SUM(sales.totalsum)-SUM(purchases.totalsum)) AS earning	
FROM public.sales LEFT JOIN purchases 
ON substring(sales.invoice,9,4) = substring(purchases.invoice,5,4)
WHERE (sales.is_deleted = false AND purchases.is_deleted = false)
GROUP BY substring(sales.invoice,9,4) 
ORDER BY substring(sales.invoice,9,4) ASC