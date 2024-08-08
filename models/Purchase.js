const moment = require('moment');
const { db } = require('./pg');

class Purchase {

    static async add(objectData) {
        try {
            let params = [objectData.operator];
            let sql = `INSERT INTO purchases(operator) VALUES ($1)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah purchases');
        }
    }

    static async edit(objectData) {
        try {
            let params = [];
            let sql = '';
            if (objectData.supplier) {
                params = [objectData.operator, objectData.supplier, objectData.invoice];
                sql = `UPDATE purchases SET operator = $1, supplier=$2 WHERE invoice = $3`;
            } else {
                params = [objectData.operator, objectData.invoice];
                sql = `UPDATE purchases SET operator = $1 WHERE invoice = $2`;
            }
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah purchases');
        }
    }

    static async cek(invoice) {
        try {
            let sql = `SELECT * FROM purchases WHERE invoice = $1`;
            const result = await db.query(sql, [invoice]);
            result.rows[0].time = moment(result.rows[0].time).format('DD MMM YYYY HH:mm:ss');
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek purchases')
        }
    }

    // static async list(query) {
    //     try {
    //         let sql = `SELECT * FROM purchases WHERE is_deleted = false`;
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
    //             data.action = `<a class="btn btn-success btn-circle" href="/purchases/edit/${data.invoice}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${(data.invoice).substring(4).replace('-', '')})"><i class="fas fa-trash"></i></a>`;
    //         })
    //         const response = {
    //             "recordsTotal": total.rows[0].total,
    //             "recordsFiltered": filtered.rows[0].total,
    //             "data": result.rows
    //         }
    //         return response;
    //     } catch (err) {
    //         console.log(err, 'gagal baca purchases');
    //     }
    // }

    static async hapus(invoice) {
        try {
            let sql = `UPDATE purchases SET is_deleted = true WHERE invoice = $1`;
            await db.query(sql, [invoice]);
        } catch (err) {
            console.log(err, 'gagal hapus purchases');
        }
    }

    static async joinSuppliers(query, operatorid) {
        try {
            let sql = `SELECT * FROM purchases LEFT JOIN suppliers ON purchases.supplier = suppliers.supplierid WHERE is_deleted = false`;
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
                data.time = moment(data.time).format('DD MMM YYYY HH:mm:ss');
                data.action = `<a class="btn btn-success btn-circle" href="/purchases/edit/${data.invoice}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete('${(data.invoice)}')"><i class="fas fa-trash"></i></a>`;
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
            console.log(err, 'gagal baca purchases');
        }
    }

    // static async total(query) {
    //     try {
    //         if (query.startdate == '') delete query.startdate;
    //         if (query.enddate == '') delete query.enddate;
    //         let sql = `SELECT SUM(totalsum) AS totalpurchases FROM purchases WHERE is_deleted = false`;
    //         let params = [];
    //         if (query.startdate && query.enddate) {
    //             sql += ` time >= $1 AND time <= $2`;
    //             params.push(query.startdate, query.enddate);
    //         } else if (query.startdate) {
    //             sql += ` time >= $1`;
    //             params.push(query.startdate);
    //         } else if (query.enddate) {
    //             sql += ` time <= $1`;
    //             params.push(query.enddate);
    //         }
    //         const result = await db.query(sql, params);
    //         return rupiah(result.rows[0].totalpurchases);
    //     } catch (err) {
    //         console.log(err, 'gagal baca total purchases');
    //     }
    // }

}

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}

module.exports = Purchase;
