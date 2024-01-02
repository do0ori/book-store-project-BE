const mariadb = require('mysql2');
const connection = mariadb.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    // timezone: 'Asia/Seoul',
    database: 'BookStore',
    dateStrings: true
});

module.exports = connection;