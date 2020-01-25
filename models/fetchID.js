let connection = require('../config/db')


class fetchID {

    static check(request, response, callback) {
        let email = request.body.email;
        connection.query("SELECT * FROM user WHERE email=?", [email], function (error, results, fields) {
            callback(request, response, error, results);
        });
    }
}

module.exports = fetchID ;
