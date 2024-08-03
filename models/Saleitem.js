const { db } = require('./pg');

class Saleitem {

    static async add(objectData) {
        try {
            let params = [objectData.invoice, objectData.itemcode, objectData.quantity];
            let sql = `INSERT INTO saleitems(invoice,itemcode,quantity) VALUES ($1,$2,$3)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah saleitems');
        }
    }

    static async edit(objectData) {
        try {
            let params = [objectData.quantity, objectData.id];
            let sql = `UPDATE saleitems SET quantity = quantity + $1 WHERE id = $2`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah saleitems');
        }
    }

    static async cek(invoice, itemcode) {
        try {
            let params = [itemcode, invoice];
            let sql = `SELECT * FROM saleitems WHERE itemcode = $1 AND invoice = $2`;
            const result = await db.query(sql, params);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek saleitems')
        }
    }

    static async cekId(id) {
        try {
            let sql = `SELECT * FROM saleitems WHERE id = $1`;
            const result = await db.query(sql, [id]);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek saleitems')
        }
    }

    // static async list(invoice) {
    //     try {
    //         let sql = `SELECT * FROM saleitems WHERE invoice = $1`;
    //         const result = await db.query(sql, [invoice]);
    //         result.rows.forEach(data => data.action = `<a class="btn btn-danger btn-circle btn-sm" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete('${data.id}')"><i class="fas fa-trash"></i></a>`)
    //         return result.rows;
    //     } catch (err) {
    //         console.log(err, 'gagal baca saleitems');
    //     }
    // }

    static async hapus(id) {
        try {
            let sql = `DELETE FROM saleitems WHERE id = $1`;
            const data = await db.query(sql, [id]);
        } catch (err) {
            console.log(err, 'gagal hapus saleitems');
        }
    }

    static async joinGoods(invoice) {
        try {
            let sql = `SELECT * FROM saleitems LEFT JOIN goods ON saleitems.itemcode = goods.barcode WHERE invoice = $1 ORDER BY id DESC`;
            const result = await db.query(sql, [invoice]);
            result.rows.forEach(data => data.action = `<a class="btn btn-danger btn-circle btn-sm" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete('${data.id}')"><i class="fas fa-trash"></i></a>`)
            return result.rows;
        } catch (err) {
            console.log(err, 'gagal baca hasil join saleitems dan goods');
        }
    }
}

module.exports = Saleitem;
