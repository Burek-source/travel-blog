// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'webcourse.cs.nuim.ie',
    user: 'u240316',
    password: 'ThohgheiK8ijinee',
    database: 'cs230_u240316',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL DB!');
});

module.exports = db;
