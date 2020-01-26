let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'mysqlservercloudx.database.windows.net',
    user: 'ad007min',
    password: '4-v3ry-53cr37-p455w0rd',
    database: 'cloud',
    dateStrings: 'date',
});

connection.connect();


module.exports = connection;