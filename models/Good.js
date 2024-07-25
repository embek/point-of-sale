const { db } = require('./pg');

class Good {
    static async list(query) {
        try {
            let sql = `SELECT * FROM goods`;
            if (query.search.value) sql += ` WHERE LOWER(name) LIKE LOWER('%${query.search.value}%')`;
            const limit = query.length;
            const offset = query.start;
            const sortBy = query.columns[query.order[0].column].data;
            const sortMode = query.order[0].dir;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode} `;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset} `;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.picture = `<img src="/images/goods/${data.picture}" alt="${data.name}" height="100px">`;
                data.action = `<a class="btn btn-success btn-circle" href = "/goods/edit/${data.barcode}"> <i class="fas fa-info-circle"></i></a > <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete('${data.barcode}')"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": total.rows[0].total,
                "data": result.rows
            }
            return response;
        } catch (err) {
            console.log(err, 'gagal baca goods');
        }
    }

    static async add(objectData) {
        try {
            let params = [objectData.barcode, objectData.name, objectData.stock, objectData.purchaseprice, objectData.sellingprice, objectData.unit, objectData.picture];
            let sql = `INSERT INTO goods(barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah goods');
        }
    }

    static async edit(objectData) {
        try {
            let params = [objectData.name, objectData.stock, objectData.purchaseprice, objectData.sellingprice, objectData.unit, objectData.picture, objectData.barcode];
            let sql = `UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7`;
            await db.query(sql, params)
        } catch (err) {
            console.log(err, 'gagal edit goods');
        }
    }

    static async hapus(barcode) {
        try {
            let sql = `DELETE FROM goods WHERE barcode = $1`;
            await db.query(sql, [barcode]);
        } catch (err) {
            console.log(err, 'gagal hapus goods');
        }
    }

    static async cek(data) {
        try {
            let sql = `SELECT * FROM goods WHERE barcode = $1`;
            const result = await db.query(sql, [data]);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek goods')
        }
    }
}

module.exports = Good;