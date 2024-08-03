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
                params = [objectData.operator, objectData.customer, objectData.invoice];
                sql = `UPDATE sales SET operator = $1, customer=$2 WHERE invoice = $3`;
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

    static async joinCustomers(query) {
        try {
            let sql = `SELECT * FROM sales LEFT JOIN customers ON sales.customer = customers.customerid WHERE is_deleted = false`;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            if (query.search?.value) sql += ` AND LOWER(invoice) LIKE LOWER('%${query.search.value}%')`;
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
                data.time = moment(data.time).format('DD MMM YYYY HH:mm:ss');
                data.action = `<a class="btn btn-success btn-circle" href="/sales/edit/${data.invoice}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete('${(data.invoice)}')"><i class="fas fa-trash"></i></a>`;
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

}

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}

module.exports = Sale;
