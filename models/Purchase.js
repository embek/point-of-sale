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

    static async cek(invoice) {
        try {
            let sql = `SELECT * FROM purchases WHERE invoice = $1`;
            const result = await db.query(sql, [invoice]);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek purchases')
        }
    }

    static async list(query) {
        try {
            let sql = `SELECT * FROM purchases WHERE isDeleted = false`;
            if (query.search.value) sql += ` AND LOWER(invoice) LIKE LOWER('%${query.search.value}%')`;
            const limit = query.length;
            const offset = query.start;
            const sortBy = query.columns[query.order[0].column].data;
            const sortMode = query.order[0].dir;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode}`;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.action = ` <a class="btn btn-success btn-circle" href="/purchases/edit/${data.invoice}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${data.invoice})"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": total.rows[0].total,
                "data": result.rows
            }
            return response;
        } catch (err) {
            console.log(err, 'gagal baca purchases');
        }
    }

    static async hapus(invoice) {
        try {
            let sql = `UPDATE purchases SET isDeleted = true WHERE invoice = $1`;
            await db.query(sql, [invoice]);
        } catch (err) {
            console.log(err, 'gagal hapus purchases');
        }
    }
}

module.exports = Purchase;
