const moment = require('moment');
const { db } = require('./pg');

class Sale {

    static async add(objectData) {
        try {
            let params = [objectData.operator];
            let sql = `INSERT INTO sales(operator) VALUES ($1)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah sales');
        }
    }

    static async edit(objectData) {
        try {
            let params = [];
            let sql = '';
            if (objectData.customer) {
                params = [objectData.operator, objectData.customer, objectData.pay, objectData.invoice];
                sql = `UPDATE sales SET operator = $1, customer=$2, pay = $3 WHERE invoice = $4`;
            } else {
                params = [objectData.operator, objectData.invoice];
                sql = `UPDATE sales SET operator = $1 WHERE invoice = $2`;
            }
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah sales');
        }
    }

    static async cek(invoice) {
        try {
            let sql = `SELECT * FROM sales WHERE invoice = $1`;
            const result = await db.query(sql, [invoice]);
            result.rows[0].time = moment(result.rows[0].time).format('DD MMM YYYY HH:mm:ss');
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek sales')
        }
    }

    // static async list(query) {
    //     try {
    //         let sql = `SELECT * FROM sales WHERE is_deleted = false`;
    //         const total = await db.query(sql.replace('*', 'count(*) AS total'));
    //         if (query.search?.value) sql += ` AND LOWER(invoice) LIKE LOWER('%${query.search.value}%')`;
    //         const limit = query.length || -1;
    //         const offset = query.start || 0;
    //         let sortBy = 'invoice';
    //         let sortMode = 'desc';
    //         if (query.columns) sortBy = query.columns[query.order[0].column].data;
    //         if (query.order) sortMode = query.order[0].dir;
    //         const filtered = await db.query(sql.replace('*', 'count(*) AS total'));
    //         sql += ` ORDER BY ${sortBy} ${sortMode}`;
    //         if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
    //         const result = await db.query(sql);
    //         result.rows.forEach(data => {
    //             data.time = moment(data.time).format('DD MMM YYYY HH:mm:ss');
    //             data.action = `<a class="btn btn-success btn-circle" href="/sales/edit/${data.invoice}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${(data.invoice).substring(4).replace('-', '')})"><i class="fas fa-trash"></i></a>`;
    //         })
    //         const response = {
    //             "recordsTotal": total.rows[0].total,
    //             "recordsFiltered": filtered.rows[0].total,
    //             "data": result.rows
    //         }
    //         return response;
    //     } catch (err) {
    //         console.log(err, 'gagal baca sales');
    //     }
    // }

    static async hapus(invoice) {
        try {
            let sql = `UPDATE sales SET is_deleted = true WHERE invoice = $1`;
            await db.query(sql, [invoice]);
        } catch (err) {
            console.log(err, 'gagal hapus sales');
        }
    }

    static async joinCustomers(query, operatorid) {
        try {
            let sql = `SELECT * FROM sales LEFT JOIN customers ON sales.customer = customers.customerid WHERE is_deleted = false`;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            if (query.search?.value) sql += ` AND (LOWER(invoice) LIKE LOWER('%${query.search.value}%') OR LOWER(name) LIKE LOWER('%${query.search.value}%'))`;
            const limit = query.length || -1;
            const offset = query.start || 0;
            let sortBy = 'invoice';
            let sortMode = 'desc';
            if (query.columns) sortBy = query.columns[query.order[0].column].data;
            if (query.order) sortMode = query.order[0].dir;
            const filtered = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode}`;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.totalsum = rupiah(data.totalsum);
                data.pay = rupiah(data.pay);
                data.change = rupiah(data.change);
                data.time = moment(data.time).format('DD MMM YYYY HH:mm:ss');
                data.action = `<a class="btn btn-success btn-circle" href="/sales/edit/${data.invoice}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete('${(data.invoice)}')"><i class="fas fa-trash"></i></a>`;
                if (operatorid != data.operator) {
                    data.action = data.action.replace('btn-circle" href', 'btn-circle disabled" href').replace('btn-circle" data', 'btn-circle disabled" data');
                }
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": filtered.rows[0].total,
                "data": result.rows
            }
            return response;
        } catch (err) {
            console.log(err, 'gagal baca sales');
        }
    }

    static async total(query) {
        try {
            if (query.startdate == '') delete query.startdate;
            if (query.enddate == '') delete query.enddate;
            let sql = `SELECT COUNT(*) AS totalsales FROM sales WHERE is_deleted = false`;
            let params = [];
            if (query.startdate && query.enddate) {
                sql += ` AND time >= $1 AND time <= $2`;
                params.push(query.startdate, query.enddate);
            } else if (query.startdate) {
                sql += ` AND time >= $1`;
                params.push(query.startdate);
            } else if (query.enddate) {
                sql += ` AND time <= $1`;
                params.push(query.enddate);
            }
            const result = await db.query(sql, params);
            return result.rows[0].totalsales;
        } catch (err) {
            console.log(err, 'gagal baca total sales');
        }
    }

    static async joinPurchases(query, forCSV = false) {
        try {
            if (query.startdate == '') delete query.startdate;
            if (query.enddate == '') delete query.enddate;
            let sql = `SELECT
                            substring(sales.invoice,9,4) AS month,
	                        SUM(purchases.totalsum) AS expense,
	                        SUM(sales.totalsum)AS revenue,
	                        (SUM(sales.totalsum)-SUM(purchases.totalsum)) AS earning	
                            FROM public.sales LEFT JOIN purchases 
                            ON substring(sales.invoice,9,4) = substring(purchases.invoice,5,4)
                            WHERE (sales.is_deleted = false AND purchases.is_deleted = false)`;
            // const total = await db.query(sql + ` GROUP BY substring(sales.invoice,9,4) 
            //         ORDER BY substring(sales.invoice,9,4) ASC`);
            let params = [];
            if (query.startdate && query.enddate) {
                sql += ` AND (sales.time >= $1 AND sales.time <= $2) AND (purchases.time >= $1 AND purchases.time <= $2)`;
                params.push(query.startdate, query.enddate);
            } else if (query.startdate) {
                sql += ` AND sales.time >= $1 AND purchases.time >= $1`;
                params.push(query.startdate);
            } else if (query.enddate) {
                sql += ` AND sales.time <= $1 AND purchases.time <= $1`;
                params.push(query.enddate);
            }
            sql += ` GROUP BY substring(sales.invoice,9,4) 
                    ORDER BY substring(sales.invoice,9,4) ASC`;
            const result = await db.query(sql, params);
            let totalExpense = 0;
            let totalRevenue = 0;
            let totalEarning = 0;
            let arr = [];
            result.rows.forEach(value => {
                value.month = monthly(value.month);
                totalExpense += parseFloat(value.expense);
                totalRevenue += parseFloat(value.revenue);
                totalEarning += parseFloat(value.earning);
                if (forCSV) arr.push({ Month: value.month, Expense: Number(value.expense), Revenue: Number(value.revenue), Earning: Number(value.earning) });
            })
            totalExpense = rupiah(totalExpense);
            totalRevenue = rupiah(totalRevenue);
            totalEarning = rupiah(totalEarning);
            if (forCSV) return arr;
            return { data: result.rows, totalEarning, totalExpense, totalRevenue };
        } catch (err) {
            console.log(err, 'gagal baca join sales purchases');
        }
    }

    static async sources(query) {
        try {
            if (query.startdate == '') delete query.startdate;
            if (query.enddate == '') delete query.enddate;
            let sql = `SELECT COUNT(*) AS umum FROM sales WHERE is_deleted = false AND customer = 1`;
            let params = [];
            if (query.startdate && query.enddate) {
                sql += ` AND time >= $1 AND time <= $2`;
                params.push(query.startdate, query.enddate);
            } else if (query.startdate) {
                sql += ` AND time >= $1`;
                params.push(query.startdate);
            } else if (query.enddate) {
                sql += ` AND time <= $1`;
                params.push(query.enddate);
            }
            const result1 = await db.query(sql, params);
            const result2 = await db.query(sql.replace('umum', 'customers').replace('customer = 1', 'customer <> 1'), params);
            return { umum: result1.rows[0].umum, customers: result2.rows[0].customers };
        } catch (err) {
            console.log(err, 'gagal baca sources sales');
        }
    }

}

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}

function monthly(tanggal) {
    const nama = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return nama[Number((tanggal.substring(2, 4))) - 1] + ' ' + (tanggal.substring(0, 2))
}

module.exports = Sale;
