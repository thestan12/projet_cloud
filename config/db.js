let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'moxa',
    password: '0000',
    database: 'cloud',
    dateStrings: 'date',
});

connection.connect();


module.exports = connection;