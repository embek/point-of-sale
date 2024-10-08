const { db } = require('./pg');

class Supplier {
    static async add(objectData) {
        try {
            let params = [objectData.name, objectData.address, objectData.phone];
            let sql = `INSERT INTO suppliers(name,address,phone) VALUES ($1,$2,$3)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah suppliers');
        }
    }

    static async edit(objectData) {
        try {
            let params = [objectData.address, objectData.name, objectData.phone, objectData.supplierid];
            let sql = `UPDATE suppliers SET address = $1, name = $2, phone = $3 WHERE supplierid = $4 `;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal edit suppliers');
        }
    }

    static async cek(supplierid) {
        try {
            let sql = `SELECT * FROM suppliers WHERE supplierid = $1`;
            const result = await db.query(sql, [supplierid]);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek suppliers')
        }
    }

    static async list(query) {
        try {
            let sql = `SELECT * FROM suppliers`;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            if (query.search?.value) sql += ` WHERE LOWER(name) LIKE LOWER('%${query.search.value}%') OR LOWER(address) LIKE LOWER('%${query.search.value}%') OR LOWER(phone) LIKE LOWER('%${query.search.value}%')`;
            const limit = query.length || -1;
            const offset = query.start || 0;
            let sortBy = 'supplierid';
            let sortMode = 'asc';
            if (query.columns) sortBy = query.columns[query.order[0].column].data;
            if (query.order) sortMode = query.order[0].dir;
            const filtered = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode}`;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
            console.log(sql);
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.action = ` <a class="btn btn-success btn-circle" href="/suppliers/edit/${data.supplierid}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${data.supplierid})"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": filtered.rows[0].total,
                "data": result.rows
            }
            return response;
        } catch (err) {
            console.log(err, 'gagal baca suppliers');
        }
    }

    static async hapus(supplierid) {
        try {
            let sql = `DELETE FROM suppliers WHERE supplierid = $1`;
            await db.query(sql, [supplierid]);
        } catch (err) {
            console.log(err, 'gagal hapus suppliers');
        }
    }

}

module.exports = Supplier;