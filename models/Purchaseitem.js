const { db } = require('./pg');

class Purchase {

    static async add(objectData) {
        try {
            let params = [objectData.invoice, objectData.itemcode, objectData.quantity];
            let sql = `INSERT INTO purchaseitems(invoice,itemcode,quantity) VALUES ($1,$2,$3)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah purchaseitems');
        }
    }

    static async cek(id) {
        try {
            let sql = `SELECT * FROM purchaseitems WHERE id = $1`;
            const result = await db.query(sql, [id]);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek purchaseitems')
        }
    }

    static async list(invoice) {
        try {
            let sql = `SELECT * FROM purchaseitems WHERE invoice = $1`;
            const result = await db.query(sql, [invoice])
            return result.rows;
        } catch (err) {
            console.log(err, 'gagal baca purchaseitems');
        }
    }

    static async hapus(id) {
        try {
            let sql = `DELETE FROM purchaseitems WHERE id = $1`;
            await db.query(sql, [id]);
        } catch (err) {
            console.log(err, 'gagal hapus purchaseitems');
        }
    }
}

module.exports = Purchase;
