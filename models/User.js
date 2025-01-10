const { db } = require('./pg')

class User {
    static async add(objectData) {
        try {
            let params = [objectData.email, objectData.name, objectData.password, objectData.role];
            let sql = `INSERT INTO users(email,name,password,role) VALUES ($1,$2,$3,$4)`;
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal tambah users');
        }
    }

    static async edit(objectData, tipe = '') {
        try {
            let params = [];
            let sql = '';
            if (tipe = 'profile') {
                params = [objectData.email, objectData.name, objectData.userid];
                sql = `UPDATE users SET email = $1, name = $2 WHERE userid = $3 `;
            } else if (tipe = 'password') {
                params = [objectData.password, objectData.userid];
                sql = `UPDATE users SET password = $1 WHERE userid = $2 `;
            } else {
                params = [objectData.email, objectData.name, objectData.role, objectData.userid];
                sql = `UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4 `;
            }
            await db.query(sql, params);
        } catch (err) {
            console.log(err, 'gagal edit users');
        }
    }

    static async cek(jenisData, data) {//jenisData bisa berupa email atau userid
        try {
            let sql = `SELECT * FROM users WHERE ${jenisData} = $1`;
            const result = await db.query(sql, [data]);
            return result.rows[0];
        } catch (err) {
            console.log(err, 'gagal cek users')
        }
    }

    static async list(query) {
        try {
            let sql = `SELECT * FROM users`;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            if (query.search?.value) sql += ` WHERE LOWER(name) LIKE LOWER('%${query.search.value}%') OR LOWER(email) LIKE LOWER('%${query.search.value}%')`;
            const limit = query.length || -1;
            const offset = query.start || 0;
            let sortBy = 'userid';
            let sortMode = 'asc';
            if (query.columns) sortBy = query.columns[query.order[0].column].data;
            if (query.order) sortMode = query.order[0].dir;
            const filtered = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode}`;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.action = `<a class="btn btn-success btn-circle" href="/users/edit/${data.userid}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${data.userid})"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": filtered.rows[0].total,
                "data": result.rows
            }
            return response;
        } catch (err) {
            console.log(err, 'gagal baca users');
        }
    }

    static async hapus(userid) {
        try {
            let sql = `DELETE FROM users WHERE userid = $1`;
            await db.query(sql, [userid]);
        } catch (err) {
            console.log(err, 'gagal hapus users');
        }
    }
}

module.exports = User;