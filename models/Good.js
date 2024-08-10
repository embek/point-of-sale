const { db } = require('./pg');

class Good {
    static async list(query, filterStock = false) {
        try {
            let sql = `SELECT * FROM goods`;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            if (query.search?.value && filterStock) sql += ` WHERE LOWER(name) LIKE LOWER('%${query.search.value}%') AND stock > 0`
            else if (query.search?.value) sql += ` WHERE LOWER(name) LIKE LOWER('%${query.search.value}%')`
            else if (filterStock) sql += ` WHERE stock > 0`;
            const limit = query.length || -1;
            const offset = query.start || 0;
            let sortBy = 'barcode';
            let sortMode = 'desc';
            if (query.columns) sortBy = query.columns[query.order[0].column].data;
            if (query.order) sortMode = query.order[0].dir;
            const filtered = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode} `;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset} `;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.picture = `<img src="/images/goods/${data.picture}" alt="${data.name}" height="100px">`;
                data.action = `<a class="btn btn-success btn-circle" href = "/goods/edit/${data.barcode}"> <i class="fas fa-info-circle"></i></a > <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete('${data.barcode}')"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": filtered.rows[0].total,
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

    static async cekStock(){
        try {
            let sql = `SELECT * FROM goods WHERE stock <= 5`;
            const result = await db.query(sql);
            return result.rows;
        } catch (err) {
            console.log(err, 'gagal bikin daftar goods kurang dari 5')
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