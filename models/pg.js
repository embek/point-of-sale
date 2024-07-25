const { Pool } = require('pg')

const db = new Pool({
    user: 'adzka',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'posdb',
})

module.exports = { db };