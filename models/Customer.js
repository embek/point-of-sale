const { db } = require('./pg');

class Customer {
    static async add(objectData) {
        try {
            let params = [objectData.name, objectData.address, objectData.phone];
            let sql = `INSERT INTO customers(name,address,phone) VALUES ($1,$2,$3)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah customers');
        }
    }

    static async edit(objectData) {
        try {
            let params = [objectData.address, objectData.name, objectData.phone, objectData.customerid];
            let sql = `UPDATE customers SET address = $1, name = $2, phone = $3 WHERE customerid = $4 `;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal edit customers');
        }
    }

    static async cek(customerid) {
        try {
            let sql = `SELECT * FROM customers WHERE customerid = $1`;
            const result = await db.query(sql, [customerid]);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek customers')
        }
    }

    static async list(query) {
        try {
            let sql = `SELECT * FROM customers`;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            if (query.search?.value) sql += ` WHERE LOWER(name) LIKE LOWER('%${query.search.value}%') OR LOWER(address) LIKE LOWER('%${query.search.value}%') OR LOWER(phone) LIKE LOWER('%${query.search.value}%')`;
            const limit = query.length || -1;
            const offset = query.start || 0;
            let sortBy = 'customerid';
            let sortMode = 'asc';
            if (query.columns) sortBy = query.columns[query.order[0].column].data;
            if (query.order) sortMode = query.order[0].dir;
            const filtered = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode}`;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.action = ` <a class="btn btn-success btn-circle" href="/customers/edit/${data.customerid}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${data.customerid})"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": filtered.rows[0].total,
                "data": result.rows
            }
            return response;
        } catch (err) {
            console.log(err, 'gagal baca customers');
        }
    }

    static async hapus(customerid) {
        try {
            let sql = `DELETE FROM customers WHERE customerid = $1`;
            await db.query(sql, [customerid]);
        } catch (err) {
            console.log(err, 'gagal hapus customers');
        }
    }

}

module.exports = Customer;