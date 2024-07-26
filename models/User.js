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

    static async edit(objectData) {
        try {
            let params = [objectData.email, objectData.name, objectData.role, objectData.userid];
            let sql = `UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4 `;
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
            if (query.search.value) sql += ` WHERE LOWER(name) LIKE LOWER('%${query.search.value}%') OR LOWER(email) LIKE LOWER('%${query.search.value}%')`;
            const limit = query.length;
            const offset = query.start;
            const sortBy = query.columns[query.order[0].column].data;
            const sortMode = query.order[0].dir;
            const total = await db.query(sql.replace('*', 'count(*) AS total'));
            sql += ` ORDER BY ${sortBy} ${sortMode}`;
            if (limit != -1) sql += ` LIMIT ${limit} OFFSET ${offset}`;
            const result = await db.query(sql);
            result.rows.forEach(data => {
                data.action = `<a class="btn btn-success btn-circle" href="/users/edit/${data.userid}"><i class="fas fa-info-circle"></i></a> <a class="btn btn-danger btn-circle" data-toggle="modal" data-target="#deleteModal" onclick="ubahDelete(${data.userid})"><i class="fas fa-trash"></i></a>`;
            })
            const response = {
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": total.rows[0].total,
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