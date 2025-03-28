const mysql = require('mysql2');
const {ip}=require('../paths')
const db = mysql.createConnection({
    host: `localhost`,
    user: 'root',
    password: 'shivam1shivam',
    database: 'gsa',
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
