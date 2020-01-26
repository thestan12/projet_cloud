let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'cloud-esgi.mysql.database.azure.com',
    user: 'esgi_cloud_admin@cloud-esgi',
    password: 'Thebeststanpasswordever95',
    database: 'cloud',
    dateStrings: 'date',
});

connection.connect();


module.exports = connection;